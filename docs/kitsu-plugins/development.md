# Kitsu Plugins Development

The Kitsu API (Zou) plugin system allows you to create extensions of the API.
Each plugin includes a `manifest.toml` file to describe the plugin and manage
its versioning. A plugin can add routes to the API, add tables to the database,
and provide a frontend UI embedded in the Kitsu dashboard.

::: tip
For a step-by-step tutorial, see the [Build a Kitsu Plugin](/recipes/make-your-plugin) recipe.
:::

## Quickstart

You can [find a full example on Github](https://github.com/cgwire/kitsu-tickets).

1. Create your plugin skeleton:

```bash
zou create-plugin-skeleton --path ./plugins --id my-plugin
```

2. Define database models in `models.py` (if needed).

3. Implement business logic in `services.py`.

4. Create API endpoints in `resources.py`.

5. Register routes and lifecycle hooks in `__init__.py`.

6. Fill in plugin metadata in `manifest.toml`.

7. Generate database migrations (if you defined models):

```bash
zou migrate-plugin-db --path ./plugins/my-plugin
```

8. Package it:

```bash
zou create-plugin-package --path ./plugins/my-plugin --output-path ./dist
```

9. Install it:

```bash
zou install-plugin --path ./dist/my-plugin.zip
```

## Plugin Structure

```
my_plugin/
├── __init__.py          # Routes and lifecycle hooks
├── manifest.toml        # Plugin metadata
├── models.py            # SQLAlchemy models
├── resources.py         # Flask-RESTful API endpoints
├── services.py          # Business logic (optional)
├── frontend/            # Vue 3 or Nuxt frontend (optional)
│   ├── package.json
│   ├── vite.config.js
│   └── src/
├── migrations/          # Alembic database migrations
│   ├── env.py
│   └── versions/
└── tests/               # Test suite
    ├── conftest.py
    ├── test_resources.py
    └── test_services.py
```

---

### `manifest.toml`

A manifest file is required to describe how to deploy your plugin and inform
other users about how it can be used. It contains the plugin metadata:

```toml
id = "my_plugin"
name = "My Plugin"
version = "0.1.0"
description = "My plugin description."
maintainer = "Author <author@example.com>"
website = "mywebsite.com"
license = "GPL-3.0-only"
icon = "ticket-check"                   # Lucide icon name
frontend_project_enabled = true         # Show in production context
frontend_studio_enabled = true          # Show in studio context
```

### `__init__.py`

Routes are defined as a list of `(path, Resource)` tuples. Paths are
relative — Zou automatically prefixes them with `/api/plugins/<plugin_id>/`.

Four optional lifecycle hooks are called during install/uninstall:

```python
from . import resources

routes = [
    ("/tickets", resources.TicketsResource),
    ("/tickets/<ticket_id>", resources.TicketResource),
]

def pre_install(manifest):
    pass

def post_install(manifest):
    """Called after plugin installation. Use for seeding initial data."""
    pass

def pre_uninstall(manifest):
    pass

def post_uninstall(manifest):
    pass
```

### `models.py`

Define SQLAlchemy models using `db.Model` with `BaseMixin` and
`SerializerMixin`. Table names must be prefixed with `plugin_<plugin_id>_` to
avoid collisions with Zou's core tables.

::: warning Important
Plugins must **never** modify Zou's core models. Only create new tables. You
can query Zou models (`Person`, `Task`, `Project`, etc.) but must not alter
their schema.
:::

`BaseMixin` provides helper methods so you don't need to manipulate
`db.session` directly:

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

Define a `present()` method on your models to control which fields are exposed
by the API:

```python
from sqlalchemy_utils import UUIDType
from zou.app import db
from zou.app.models.serializer import SerializerMixin
from zou.app.models.base import BaseMixin


class Ticket(db.Model, BaseMixin, SerializerMixin):
    __tablename__ = "plugin_tickets_tickets"

    title = db.Column(db.Text())
    text = db.Column(db.Text())
    project_id = db.Column(
        UUIDType(binary=False),
        db.ForeignKey("project.id"),
        nullable=True,
        index=True,
    )

    def present(self):
        return {
            "id": str(self.id),
            "title": self.title,
            "text": self.text,
            "project_id": (
                str(self.project_id) if self.project_id else None
            ),
        }
```

Generate migrations after defining or modifying models:

```bash
zou migrate-plugin-db --path ./plugins/my-plugin
```

### `resources.py`

Define Flask-RESTful resources for your API endpoints.

- Use `@jwt_required()` on every endpoint for authentication
- Use `permissions.check_admin_permissions()` for admin-only endpoints
- Use `ArgsMixin` with `self.check_id_parameter(uuid)` to validate UUID
  parameters

```python
from flask import request
from flask_restful import Resource
from flask_jwt_extended import jwt_required
from zou.app.mixin import ArgsMixin
from zou.app.utils import permissions

from .models import Ticket


class TicketsResource(Resource, ArgsMixin):

    @jwt_required()
    def get(self):
        tickets = Ticket.get_all()
        return [t.present() for t in tickets]

    @jwt_required()
    def post(self):
        permissions.check_admin_permissions()
        data = request.get_json()
        ticket = Ticket.create(
            title=data.get("title"),
            text=data.get("text"),
            project_id=data.get("project_id"),
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
        permissions.check_admin_permissions()
        ticket = Ticket.get(ticket_id)
        if not ticket:
            return {"error": "Ticket not found"}, 404
        ticket.delete()
        return "", 204
```

### `services.py`

Optional file for business logic. Keeping logic separate from resources makes
it easier to test and reuse. Services can query both plugin models and Zou's
core models.

## Adding Views to the Kitsu Dashboard

### Studio-wide Section

Add these options to your manifest:

```toml
frontend_studio_enabled = true
icon = "ticket-check"
```

This adds a section in the Kitsu left sidebar. The icon is picked from the
[Lucide](https://lucide.dev/) icon set.

### Production Section

```toml
frontend_project_enabled = true
icon = "ticket-check"
```

This adds a section in the production menu at the top of the Kitsu UI.
Kitsu loads your `frontend/dist/index.html` with two query parameters:
`production_id` and `episode_id`, so your frontend knows the current context.

### Frontend Stack

Create your frontend in the `frontend/` folder. You can use **Vue 3 + Vite**
(lightweight, recommended for simple plugins) or **Nuxt** (full-featured
framework). Both must output static files to `frontend/dist/`.

Key constraints:
- Use `createWebHashHistory` for Vue Router (required for static file serving)
- Set `base: './'` in Vite config
- On initial load, transfer URL query params (`production_id`, `episode_id`)
  into the hash-based route

Build the frontend before packaging:

```bash
cd plugins/my-plugin/frontend
npm install && npm run build
```

See the [Build a Kitsu Plugin](/recipes/make-your-plugin) recipe for detailed
frontend configuration examples.

## Testing

Tests use Zou's `ApiDBTestCase` base class which provides automatic database
setup/teardown, fixture generators, authentication helpers, and HTTP method
helpers.

::: danger Critical
Always run tests with `DB_DATABASE=zoudb-test` to avoid destroying your
development database. The test framework runs `TRUNCATE ... CASCADE` on all
tables during setup.
:::

```bash
DB_DATABASE=zoudb-test python -m pytest tests/ -v
```

See the [Build a Kitsu Plugin](/recipes/make-your-plugin#_8-testing) recipe for
`conftest.py` setup and test examples.

## Development Workflow

During development, install the plugin in editable mode so that code changes
are picked up without reinstalling:

```bash
pip install -e ./plugins/my-plugin
```

For frontend development, start the Vite dev server for hot reload:

```bash
cd plugins/my-plugin/frontend
npm run dev
```

The Vite dev proxy forwards `/api` calls to your local Zou server, so the
frontend works against real data.

## Best Practices

* Use alphanumeric characters and hyphens for the plugin id.
* Follow semantic versioning (`x.y.z`).
* Prefix all database tables with `plugin_<plugin_id>_`.
* Write migrations whenever your plugin defines or modifies database models.
* Use `BaseMixin` methods (`get`, `get_by`, `create`, etc.) instead of
  `db.session` directly.
* Define a `present()` method on models to control API serialization.
* Use `@jwt_required()` on every endpoint.
* For license, use an SPDX identifier (see [SPDX list](https://spdx.org/licenses/)).
* Write tests using `ApiDBTestCase` and always run them against a test database.
