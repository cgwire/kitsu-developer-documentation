# Project Templates

A **project template** is a reusable snapshot of a project's configuration:
task types, task statuses, asset types, status automations, metadata
descriptors and production settings (fps, ratio, resolution, etc.). It does
**not** contain any production data — no tasks, no entities, no team, no
dates.

When you create a new project, you can pick a template to pre-populate
everything in one shot instead of configuring each setting individually.
Templates are global and managed by admins.

## Why use templates

If your studio repeatedly produces similar projects (e.g. animated shorts,
TV episodes, commercials), you probably configure each new project with the
same task types, statuses and metadata fields. Templates let you capture
that configuration once and reuse it across many projects.

You can create templates two ways:

1. **From scratch** — start empty, then attach task types, statuses and
   asset types one by one.
2. **From an existing project** — snapshot a well-configured project into
   a template, then re-use it on future productions.

## Listing templates

::: code-group
```python [Python]
templates = gazu.project_template.all_project_templates()
template = gazu.project_template.get_project_template(template_id)
template = gazu.project_template.get_project_template_by_name("Animated Series")
```
:::

## Creating a template from scratch

Start by creating an empty template, then attach the configuration you want.

### Create the template

::: code-group
```python [Python]
template = gazu.project_template.new_project_template(
    name="Animated Series",
    description="Default setup for our 11-minute episodes",
    fps="24",
    ratio="16:9",
    resolution="1920x1080",
    production_type="tvshow",
    production_style="3d",
)
```
:::

### Attach task types

::: code-group
```python [Python]
modeling = gazu.task.get_task_type_by_name("Modeling")
animation = gazu.task.get_task_type_by_name("Animation")

gazu.project_template.add_task_type_to_project_template(
    template, modeling, priority=1
)
gazu.project_template.add_task_type_to_project_template(
    template, animation, priority=2
)
```
:::

### Attach task statuses

::: code-group
```python [Python]
todo = gazu.task.get_task_status_by_name("Todo")
wip = gazu.task.get_task_status_by_name("WIP")
done = gazu.task.get_task_status_by_name("Done")

for index, status in enumerate([todo, wip, done], start=1):
    gazu.project_template.add_task_status_to_project_template(
        template, status, priority=index
    )
```
:::

### Attach asset types

::: code-group
```python [Python]
character = gazu.entity.get_entity_type_by_name("Character")
prop = gazu.entity.get_entity_type_by_name("Prop")

gazu.project_template.add_asset_type_to_project_template(template, character)
gazu.project_template.add_asset_type_to_project_template(template, prop)
```
:::

### Attach status automations

::: code-group
```python [Python]
automation = gazu.client.fetch_first("data/status-automations")
gazu.project_template.add_status_automation_to_project_template(
    template, automation
)
```
:::

### Set metadata descriptors

Templates store metadata descriptors as a JSONB snapshot. Pass the full list
to replace whatever was there before — descriptors aren't merged.

::: code-group
```python [Python]
descriptors = [
    {
        "name": "Difficulty",
        "entity_type": "Asset",
        "data_type": "list",
        "choices": ["easy", "medium", "hard"],
        "for_client": False,
        "departments": [],
    },
    {
        "name": "External ID",
        "entity_type": "Shot",
        "data_type": "string",
        "choices": [],
        "for_client": True,
        "departments": [],
    },
    {
        "name": "Render layer",
        "entity_type": "Task",
        "task_type_id": task_type["id"],
        "data_type": "string",
        "choices": [],
        "for_client": False,
        "departments": [],
    },
]

gazu.project_template.set_project_template_metadata_descriptors(
    template, descriptors
)
```
:::

When the template is later applied to a project, each descriptor in the
snapshot becomes a regular `MetadataDescriptor` row on that project. Task
descriptors keep their `task_type_id`; a `"Task"` entry without a
`task_type_id` is skipped at apply time.

## Creating a template from an existing project

If you already have a well-configured project, snapshot it into a template
in one call.

::: code-group
```python [Python]
template = gazu.project_template.new_project_template_from_project(
    project,
    name="Snapshot of Reference Show",
    description="Configuration extracted from our reference production",
)
```
:::

The snapshot includes:

- production settings (`fps`, `ratio`, `resolution`, `production_type`,
  `production_style`, `max_retakes`, file tree, generic `data` field, ...)
- task type links (with priorities)
- task status links (with priorities and `roles_for_board`)
- asset type links
- status automation links
- metadata descriptors

It does **not** include:

- team members
- dates (`start_date`, `end_date`)
- man-days, episode counts, episode span
- preview backgrounds
- the project status
- any production data (tasks, entities, comments)

## Applying a template

There are two ways to apply a template to a project.

### At creation time

Pass `project_template=` to `new_project()`. Any other field you set in the
same call (e.g. `production_type`, `production_style`) takes precedence over
the template's defaults — the template fills in everything else.

::: code-group
```python [Python]
template = gazu.project_template.get_project_template_by_name("Animated Series")

project = gazu.project.new_project(
    name="Episode 5 — The Heist",
    project_template=template,
)
```
:::

To override a template default, pass the field explicitly:

::: code-group
```python [Python]
project = gazu.project.new_project(
    name="Episode 6 — Pilot Recut",
    production_type="featurefilm",  # overrides the template's "tvshow"
    project_template=template,
)
```
:::

### To an existing project

Use `apply_project_template()` to add the template's configuration to a
project that's already created. The strategy is **additive**: existing links
are preserved, and any duplicate (same task type, status, asset type, etc.)
is skipped silently.

::: code-group
```python [Python]
gazu.project_template.apply_project_template(project, template)
```
:::

This is useful when you want to layer a second template on top of an
existing one, or when you set up a project manually and decide later to
align it with a template.

## Updating a template

Templates evolve as your studio changes. Use the standard CRUD wrappers:

::: code-group
```python [Python]
template["description"] = "Updated for the 2026 season"
gazu.project_template.update_project_template(template)
```
:::

Updates affect future projects only — projects already created from a
template are not retroactively re-synced.

## Deleting a template

::: code-group
```python [Python]
gazu.project_template.remove_project_template(template)
```
:::

Deleting a template does not affect projects that were created from it.

## Listening to template events

Three events are emitted on templates. They are global (no `project_id`
since templates are not tied to a project).

| Event | Data |
|---|---|
| `project-template:new` | `project_template_id` |
| `project-template:update` | `project_template_id` |
| `project-template:delete` | `project_template_id` |

::: code-group
```python [Python]
def on_template_created(data):
    print("Template created:", data["project_template_id"])

event_client = gazu.events.init()
gazu.events.add_listener(
    event_client, "project-template:new", on_template_created
)
gazu.events.run_client(event_client)
```
:::

## Next Steps

* Learn how to [structure a production](/guides/production-setup) once
  you've applied a template
* Set up [permissions and roles](/guides/permissions-roles) for your
  templates' future projects
* Listen to [project events](/guides/event-listeners) to react when
  templates are created or applied
