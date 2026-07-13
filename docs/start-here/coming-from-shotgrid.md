# Coming from ShotGrid

ShotGrid (now Autodesk Flow Production Tracking) exposes a single generic
query function: `sg.find(entity_type, filters, fields)`. Kitsu takes a
different approach. This page maps the `sg.find()` patterns you already know
to their Kitsu equivalents.

If you are planning a full data migration, see
[Migrate to Kitsu](/start-here/migrate-to-kitsu).

## Two different philosophies

In ShotGrid, the query logic lives in the filter triplets you pass to one
generic function. Kitsu does not ship a query metalanguage. Instead it
provides:

* **Named functions** in [gazu](https://gazu.cg-wire.com/), the Python
  client: `gazu.shot.all_shots_for_project()`,
  `gazu.task.all_tasks_for_person()`, and so on.
* **Simple equality filters** on every list route:
  `/data/tasks?project_id=<id>`.
* **Local processing**: fetch the list you need, then filter it in Python.
* **Events and caching** instead of repeated polling queries: see
  [Event Listeners](/guides/event-listeners) and [Caching](/guides/caching).
* **Dedicated routes via plugins** when your studio needs a heavy custom
  query: see [Make your Plugin](/recipes/make-your-plugin).

The rationale: production lists are small (thousands of rows, not millions),
so fetching a scoped list and filtering it locally is fast and keeps the API
surface predictable, cacheable and permission-checked.

## Translation cheat sheet

| ShotGrid | Kitsu (gazu) |
|----------|--------------|
| `sg.find("Project", [])` | `gazu.project.all_open_projects()` |
| `sg.find("Shot", [["project", "is", p]])` | `gazu.shot.all_shots_for_project(p)` |
| `sg.find_one("Shot", [["id", "is", id]])` | `gazu.shot.get_shot(id)` |
| `sg.find("Task", [["task_assignees", "is", me]])` | `gazu.task.all_tasks_for_person(me)` |
| `sg.find("Version", [["entity", "is", shot]])` | `gazu.files.get_last_output_files_for_entity(shot)` |
| `fields=["code", "sg_status_list"]` | `fields=` query parameter (see below) |
| Complex filters (`in`, `contains`, date ranges) | Fetch the scoped list, filter in Python |
| `sg.create()` / `sg.update()` / `sg.delete()` | `gazu.*.new_*()` / `update_*()` / `remove_*()` |
| Event daemon polling | `gazu.events` WebSocket listeners |

When no named function matches, the generic client covers every model
exposed by the API:

```python
tasks = gazu.client.fetch_all("tasks", {"project_id": project["id"]})
```

## Requesting only some fields

Every `/data/<model>` list route accepts a `fields` parameter, the
equivalent of ShotGrid's `fields` argument. It trims each returned entry to
the requested attributes (`id` and `type` are always included):

```python
persons = gazu.client.fetch_all(
    "persons", {"fields": "first_name,last_name"}
)
```

::: info
The `fields` parameter requires Zou 1.0.55 or later.
:::

## Complex queries

For anything beyond equality filters, fetch the scoped list and filter
locally:

```python
tasks = gazu.task.all_tasks_for_project(project)
wip = [t for t in tasks if t["task_status_id"] == wip_status["id"]]
```

On a studio network this is usually faster than it sounds: one request,
then plain Python. If the same heavy query keeps coming back, add a
dedicated route through a [plugin](/recipes/make-your-plugin): you get a
proper SQL query server side, with the permission model still applied.

## Staying in sync without polling

The idiomatic Kitsu replacement for the ShotGrid event daemon is the event
stream. Instead of re-running `find()` on a timer, subscribe once:

```python
gazu.events.add_listener(event_client, "task:update", my_callback)
```

See the [Event Listeners guide](/guides/event-listeners) for a full setup.
