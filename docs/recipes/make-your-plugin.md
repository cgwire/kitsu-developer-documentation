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

  * `__init__.py`
  * `models.py`
  * `resources.py`
  * `migrations/`
* Optional frontend (Nuxt app)

```
my_plugin/
├── __init__.py
├── manifest.toml
├── models.py
├── resources.py
├── frontend/
├── migrations/
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

Define plugin-specific metadata and models in `models.py`.

Example: Ticket model

```python
from sqlalchemy.orm import declarative_base
from sqlalchemy_utils import UUIDType, ChoiceType
from zou.app import db
from zou.app.models.serializer import SerializerMixin
from zou.app.models.base import BaseMixin
from zou.app.utils.plugins import create_plugin_metadata

plugin_metadata = create_plugin_metadata("tickets")
PluginBase = declarative_base(metadata=plugin_metadata)

TICKET_STATUSES = [
    ("open", "Open"),
    ("on hold", "On Hold"),
    ("closed", "Closed"),
]

class Ticket(PluginBase, BaseMixin, SerializerMixin):
    __tablename__ = "plugin_tickets_tickets"

    title = db.Column(db.Text())
    text = db.Column(db.Text())
    status = db.Column(
        ChoiceType(TICKET_STATUSES),
        default="open",
        nullable=False
    )

    task_id = db.Column(UUIDType(binary=False),
                        db.ForeignKey("task.id"),
                        index=True)

    project_id = db.Column(UUIDType(binary=False),
                           db.ForeignKey("project.id"),
                           nullable=True,
                           index=True)

    episode_id = db.Column(UUIDType(binary=False),
                           db.ForeignKey("entity.id"),
                           nullable=True,
                           index=True)

    person_id = db.Column(UUIDType(binary=False),
                          db.ForeignKey("person.id"),
                          nullable=True,
                          index=True)

    assignee_id = db.Column(UUIDType(binary=False),
                            db.ForeignKey("person.id"),
                            nullable=True,
                            index=True)
```

## 3. Generate Database Migration

Do not modify the database manually to easily revert changes.

Generate migration:

```bash
python zou/cli.py migrate-plugin-db --path ./plugins/my-plugin
```

## 4. Register API Routes

Define Flask-RESTful resources in `resources.py`.

Example:

```python
from flask_restful import Resource
from flask_jwt_extended import jwt_required
from .models import Ticket
from zou.app.utils import fields
from zou.app.mixin import ArgsMixin
from zou.app.services.persons_service import get_current_user
from zou.app.services.exception import NotFound

class TicketsResource(Resource, ArgsMixin):

    @jwt_required()
    def get(self):
        tickets = Ticket.query().all()
        return fields.serialize_list(tickets)

    @jwt_required()
    def post(self):
        person_id = get_current_user()["id"]

        args = self.get_args([
            ("title", "", True),
            ("text", "", True),
            ("status", "open", True),
            ("task_id", None, True),
            ("assignee_id", None, True),
            ("project_id", None, True),
            ("episode_id", None, True),
        ])

        ticket = Ticket(
            title=args["title"],
            text=args["text"],
            status=args["status"],
            task_id=args["task_id"],
            person_id=person_id,
            assignee_id=args["assignee_id"],
            project_id=args["project_id"],
            episode_id=args["episode_id"],
        )

        ticket.save()
        return ticket.serialize(), 201


class TicketResource(Resource):

    @jwt_required()
    def get(self, id):
        ticket = Ticket.query().get(id)
        if not ticket:
            raise NotFound("Ticket not found")
        return ticket.serialize()

    @jwt_required()
    def delete(self, id):
        ticket = Ticket.query().get(id)
        if not ticket:
            raise NotFound("Ticket not found")
        ticket.delete()
        return "", 204
```

## 5. Enable Frontend Integration

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

## 6. Create Frontend Page (Nuxt)

Create your Nuxt app in the `frontend` folder and add a page:

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

## 7. Create API Composable

Create reusable API wrapper:

**frontend/app/composables/useKitsu.js**
```javascript
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

## 9. Package Plugin

Create distributable archive:

```bash
python zou/cli.py create-plugin-package \
  --path ./plugins/my-plugin \
  --output-path ./dist
```

## 10. Install Plugin

Install the plugin:

```bash
python zou/cli.py install-plugin \
  --path ./dist/my-plugin.zip
```

Verify the plugin is correctly installed:

```bash
python zou/cli.py list-plugins
```

## Github Repository 

For the full implementation, clone the repository: [github.com/cgwire/kitsu-tickets](https://github.com/cgwire/kitsu-tickets)
