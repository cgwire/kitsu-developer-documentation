# Recipe: Build a Kitsu Plugin

This recipe shows the minimal steps required to build, register, and install a Kitsu plugin with database, API, and UI integration.

- [Full Github repository](https://github.com/cgwire/kitsu-tickets)

## Prerequisites

* Working Kitsu development environment
* Node installed (for frontend)

## Overview

A Kitsu plugin contains:

* `manifest.toml` (metadata)
* Backend:

  * `__init__.py` (routes and lifecycle hooks)
  * `models.py`
  * `resources.py`
  * `services.py` (business logic, optional)
  * `migrations/`
* Optional frontend (Vue 3 + Vite or Nuxt)

```
my_plugin/
├── __init__.py
├── manifest.toml
├── models.py
├── resources.py
├── services.py
├── frontend/
├── migrations/
├── tests/
│   ├── conftest.py
│   ├── test_resources.py
│   └── test_services.py
```

## 1. Scaffold the Plugin

From the `zou` folder:

```bash
python zou/cli.py create-plugin-skeleton --path ./plugins --id my-plugin
```

This generates the base structure and `manifest.toml`.

Example:

```toml
id = "my_plugin"
name = "My Plugin"
version = "0.1.0"
description = "My plugin description."
maintainer = "Author <author@example.com>"
website = "mywebsite.com"
license = "GPL-3.0-only"
```

## 2. Add Database Models

Define models in `models.py` using `db.Model` with `BaseMixin` and `SerializerMixin`.

::: warning Important
Plugins must **never** modify Zou's core models. Only create new tables prefixed with `plugin_<plugin_id>_`. You can query Zou models (Person, Task, Project, etc.) but must not alter their schema.
:::

### BaseMixin Helper Methods

`BaseMixin` provides these class and instance methods so you don't need to
manipulate `db.session` directly:

| Method | Description |
|--------|-------------|
| `Model.get(id)` | Get by primary key (UUID) |
| `Model.get_by(**kwargs)` | Get first match by column values |
| `Model.get_all()` | Get all rows |
| `Model.create(**kwargs)` | Create and commit |
| `Model.create_no_commit(**kwargs)` | Create without committing |
| `Model.commit()` | Commit current transaction |
| `instance.update(dict)` | Update fields and commit |
| `instance.delete()` | Delete and commit |

### present() Method

Define a `present()` method on your models to control which fields are
exposed by the API. This keeps serialization explicit and avoids leaking
internal fields (like the UUID primary key from `BaseMixin`).

### Example: Ticket Model

```python
from sqlalchemy_utils import UUIDType, ChoiceType
from zou.app import db
from zou.app.models.serializer import SerializerMixin
from zou.app.models.base import BaseMixin

TICKET_STATUSES = [
    ("open", "Open"),
    ("on hold", "On Hold"),
    ("closed", "Closed"),
]

class Ticket(db.Model, BaseMixin, SerializerMixin):
    __tablename__ = "plugin_tickets_tickets"

    title = db.Column(db.Text())
    text = db.Column(db.Text())
    status = db.Column(
        ChoiceType(TICKET_STATUSES),
        default="open",
        nullable=False,
    )

    task_id = db.Column(
        UUIDType(binary=False),
        db.ForeignKey("task.id"),
        index=True,
    )
    project_id = db.Column(
        UUIDType(binary=False),
        db.ForeignKey("project.id"),
        nullable=True,
        index=True,
    )
    episode_id = db.Column(
        UUIDType(binary=False),
        db.ForeignKey("entity.id"),
        nullable=True,
        index=True,
    )
    person_id = db.Column(
        UUIDType(binary=False),
        db.ForeignKey("person.id"),
        nullable=True,
        index=True,
    )
    assignee_id = db.Column(
        UUIDType(binary=False),
        db.ForeignKey("person.id"),
        nullable=True,
        index=True,
    )

    def present(self):
        return {
            "id": str(self.id),
            "title": self.title,
            "text": self.text,
            "status": self.status.value,
            "task_id": str(self.task_id) if self.task_id else None,
            "project_id": str(self.project_id) if self.project_id else None,
        }
```

### JSONB Pitfall

When mutating a JSONB column in-place (e.g. `person.data["key"] = value`),
SQLAlchemy does not detect the change. You must call `flag_modified`:

```python
from sqlalchemy.orm.attributes import flag_modified

person.data["country"] = "FR"
flag_modified(person, "data")
Person.commit()
```

## 3. Generate Database Migration

Do not modify the database manually to easily revert changes.

Generate migration:

```bash
python zou/cli.py migrate-plugin-db --path ./plugins/my-plugin
```

## 4. Define Routes and Hooks (`__init__.py`)

Routes are defined as a list of `(path, Resource)` tuples. Paths are
relative — Zou automatically prefixes them with `/api/plugins/<plugin_id>/`.

```python
from . import resources

routes = [
    ("/tickets", resources.TicketsResource),
    ("/tickets/<ticket_id>", resources.TicketResource),
]

def post_install(manifest):
    """Called after plugin installation. Use for seeding data."""
    from .models import Ticket
    # seed initial data if needed

def pre_install(manifest):
    pass

def pre_uninstall(manifest):
    pass

def post_uninstall(manifest):
    pass
```

## 5. Register API Routes

Define Flask-RESTful resources in `resources.py`.

### Authentication and Permissions

- Use `@jwt_required()` on every endpoint
- Use `permissions.check_admin_permissions()` for admin-only endpoints
- Use `ArgsMixin` with `self.check_id_parameter(uuid)` to validate UUID
  parameters

### Example

```python
from flask import request
from flask_restful import Resource
from flask_jwt_extended import jwt_required
from zou.app.mixin import ArgsMixin
from zou.app.services import persons_service
from zou.app.utils import permissions

from .models import Ticket


class TicketsResource(Resource, ArgsMixin):

    @jwt_required()
    def get(self):
        tickets = Ticket.get_all()
        return [t.present() for t in tickets]

    @jwt_required()
    def post(self):
        person_id = persons_service.get_current_user()["id"]
        data = request.get_json()
        ticket = Ticket.create(
            title=data.get("title"),
            text=data.get("text"),
            status=data.get("status", "open"),
            task_id=data.get("task_id"),
            person_id=person_id,
            assignee_id=data.get("assignee_id"),
            project_id=data.get("project_id"),
            episode_id=data.get("episode_id"),
        )
        return ticket.present(), 201


class TicketResource(Resource, ArgsMixin):

    @jwt_required()
    def get(self, ticket_id):
        self.check_id_parameter(ticket_id)
        ticket = Ticket.get(ticket_id)
        if not ticket:
            return {"error": "Ticket not found"}, 404
        return ticket.present()

    @jwt_required()
    def delete(self, ticket_id):
        self.check_id_parameter(ticket_id)
        ticket = Ticket.get(ticket_id)
        if not ticket:
            return {"error": "Ticket not found"}, 404
        ticket.delete()
        return "", 204
```

## 6. Enable Frontend Integration

First, decide your plugin's scope.

### Studio Scope

Adds a sidebar entry.

`manifest.toml`:

```toml
frontend_studio_enabled = true
icon = "ticket-check"
```

### Production Scope

Adds entry in project menu.

```toml
frontend_project_enabled = true
icon = "ticket-check"
```

Production plugins receive `production_id` and `episode_id` via query parameters.

## 7. Create Frontend

Create your app in the `frontend` folder. You can use either **Vue 3 + Vite**
(lightweight, recommended for simple plugins) or **Nuxt** (full-featured
framework). Both approaches must output static files to `frontend/dist/`.

### Option A: Vue 3 + Vite

#### Technology Stack

- Vue 3 (Composition API with `<script setup>`)
- Pinia (state management, options API with `state` + `actions`)
- Vite (build tool)
- Vue Router with `createWebHashHistory` (required for static plugin serving)

#### Vite Configuration

```js
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  base: './',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  }
})
```

- `base: './'` is required for static file serving inside Kitsu
- The dev proxy forwards `/api` to the local Zou server, stripping the
  `/api` prefix since Zou routes don't include it

#### Router (Hash History + Query Params)

Plugins are served as static files, so you must use `createWebHashHistory`.
Kitsu passes context via the real URL query string (`?production_id=xxx`),
so on initial load, transfer these params into the hash-based route:

```js
import { createRouter, createWebHashHistory } from 'vue-router'

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

let queryTransferred = false
router.beforeEach((to, from, next) => {
  if (!queryTransferred) {
    queryTransferred = true
    const realParams = new URLSearchParams(window.location.search)
    if (realParams.toString()) {
      const query = {}
      realParams.forEach((value, key) => {
        query[key] = value
      })
      next({ path: to.path, query })
      return
    }
  }
  next()
})
```

#### Context from Kitsu

Kitsu provides context to plugins via URL query parameters:

| Parameter | Description |
|-----------|-------------|
| `production_id` | Current production UUID (absent in studio context) |
| `episode_id` | Current episode UUID (for TV series) |

Use these to determine which view to show (studio-wide vs production-specific).

#### Zou API Access

Plugins can fetch data from the main Zou API using native `fetch`. Common endpoints:

| Endpoint | Description |
|----------|-------------|
| `GET /api/data/task-types` | All task types |
| `GET /api/data/projects/open` | All open productions |
| `GET /api/data/projects/:id/sequences` | Sequences for a production |
| `GET /api/data/projects/:id/episodes` | Episodes for a production |
| `GET /api/data/projects/:id/asset-types` | Asset types for a production |

#### Code Style

- **Backend**: [Black](https://black.readthedocs.io/) formatter with `--line-length 80`
- **Frontend**:
  - ESLint + Prettier using [Kitsu's ESLint config](https://github.com/cgwire/kitsu/blob/main/eslint.config.js)
  - Prettier: no semicolons, single quotes, no trailing commas (`.prettierrc`)
  - Use arrow functions (`const fn = () => {}`) in composables and components
  - CSS properties alphabetically ordered within each rule
  - Extract shared UI into sub-components when logic/template is duplicated

### Option B: Nuxt

You can also use Nuxt to build the frontend. Create a Nuxt app in the
`frontend` folder and use the `kitsu-client-js` library for API calls:

```javascript
// frontend/app/composables/useKitsu.js
import kitsuClient from "kitsu-client-js"

let instance = null

export const useKitsu = () => {
  if (!instance) {
    instance = kitsuClient.createClient("/api")
  }

  return {
    fetchTickets: () =>
      instance.get("/plugins/tickets/tickets"),

    createTicket: (data) =>
      instance.post("/plugins/tickets/tickets", data),

    deleteTicket: (id) =>
      instance.delete(`/plugins/tickets/tickets/${id}`),
  }
}
```

```vue
<template>
  <div>
    <TicketList :tickets="tickets" />
  </div>
</template>

<script setup>
const { fetchTickets } = useKitsu()
const tickets = ref([])

onMounted(async () => {
  tickets.value = await fetchTickets()
})
</script>
```

The context from Kitsu (`production_id`, `episode_id`) and the Zou API
endpoints are the same as for Option A.

## 8. Testing

Tests use Zou's `ApiDBTestCase` base class.

::: danger Critical
Always run tests with `DB_DATABASE=zoudb-test` to avoid destroying your
development database. The test framework runs `TRUNCATE ... CASCADE` on all
tables during setup.
:::

```bash
DB_DATABASE=zoudb-test python -m pytest tests/ -v
```

If the test database doesn't have tables yet, create them first:

```bash
DB_DATABASE=zoudb-test python -c \
  "from zou.app import app, db; app.app_context().push(); db.create_all()"
```

### conftest.py

You must register the plugin blueprint so that test routes are available:

```python
from flask import Blueprint
from zou.app import app
from zou.app.utils.api import configure_api_from_blueprint
from my_plugin import routes

def _register_plugin_blueprint():
    if "my_plugin" not in app.blueprints:
        blueprint = Blueprint("my_plugin", "my_plugin")
        configure_api_from_blueprint(blueprint, routes)
        app.register_blueprint(
            blueprint, url_prefix="/plugins/my_plugin"
        )

_register_plugin_blueprint()
```

### ApiDBTestCase

Provides:

- Automatic database setup/teardown with transactions
- Fixture generators: `generate_fixture_project()`,
  `generate_fixture_task()`, `generate_fixture_person()`, etc.
- Authentication helpers: `log_in_admin()`, `log_in_cg_artist()`,
  `log_out()`
- HTTP method helpers: `get(url)`, `post(url, data)`, `put(url, data)`,
  `delete(url)`

```python
from zou.utils.test_helpers import ApiDBTestCase
from my_plugin.models import Ticket

class TicketTestCase(ApiDBTestCase):

    def setUp(self):
        super().setUp()
        self.generate_fixture_project_status()
        self.generate_fixture_project()
        self.generate_fixture_person()

    def test_create_ticket(self):
        data = {"title": "Bug report", "text": "Details..."}
        response = self.post("/plugins/my_plugin/tickets", data)
        self.assertEqual(response["title"], "Bug report")

        ticket = Ticket.get_by(title="Bug report")
        self.assertIsNotNone(ticket)
```

::: tip
Use `BaseMixin` methods in tests too: `Model.get_by(...)`,
`Model.create(...)`, `Model.get_all()` instead of
`db.session` or `Model.query`.
:::

## 9. Development Workflow

During development, install the plugin in editable mode so that code changes
are picked up without reinstalling:

```bash
pip install -e ./plugins/my-plugin
```

If the plugin has a frontend, start the Vite dev server for hot reload:

```bash
cd plugins/my-plugin/frontend
npm install
npm run dev
```

The Vite dev proxy (configured in step 7) forwards `/api` calls to your local
Zou server, so the frontend works against real data during development.

When you modify models, generate a new migration (see step 3) and restart Zou
to apply it.

## 10. Package Plugin

Once your plugin is ready for distribution, create a zip archive:

```bash
python zou/cli.py create-plugin-package \
  --path ./plugins/my-plugin \
  --output-path ./dist
```

This bundles the backend code, migrations, manifest, and the `frontend/dist/`
folder (if present) into a single `.zip` file. Make sure to build the frontend
before packaging:

```bash
cd plugins/my-plugin/frontend && npm run build && cd -
python zou/cli.py create-plugin-package \
  --path ./plugins/my-plugin \
  --output-path ./dist
```

## 11. Install Plugin

Install from the packaged archive:

```bash
python zou/cli.py install-plugin \
  --path ./dist/my-plugin.zip
```

This will:
1. Copy plugin files to the Zou plugins directory
2. Run Alembic migrations to create or update database tables
3. Call `pre_install()` then `post_install()` hooks

Verify the plugin is correctly installed:

```bash
python zou/cli.py list-plugins
```

### Uninstall

To remove a plugin:

```bash
python zou/cli.py uninstall-plugin --id my_plugin
```

This calls `pre_uninstall()` and `post_uninstall()` hooks. Database tables
created by the plugin are **not** dropped automatically — remove them manually
if needed.

### Update

To update an already installed plugin, package the new version and run
`install-plugin` again. Zou will run any new migrations and call the install
hooks.

## Using Claude Code

You can use [Claude Code](https://docs.anthropic.com/en/docs/claude-code/overview)
to accelerate plugin development. Provide it with specification files
(`SPECS.md`, `FRONTEND_SPECS.md`, `KITSU_PLUGIN_GUIDE.md`) describing your
plugin's architecture, API, and frontend conventions. Claude Code will use
these specs as context to generate code that follows your project's patterns.

For a real-world example, see the spec files in the
[kitsu-carbon-plugin](https://github.com/cgwire/kitsu-carbon-plugin) repository.

## Github Repository

For the full implementation, clone the repository: [github.com/cgwire/kitsu-tickets](https://github.com/cgwire/kitsu-tickets)
