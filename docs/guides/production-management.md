# Creating and Structuring a Production

This section describes how a developer can use the Kitsu API to create, structure, and configure a production, from initial project setup to defining assets, shots, tasks, and metadata that support pipeline tracking and automation.

## 1. Production Setup

### Creating a Project

The project is the root container for all assets, shots, tasks, and metadata.

::: code-group
```python [Python]
project = gazu.project.new_project(name="Agent 327", production_type="short", production_style="2d")
```
```bash [cURL]

```
:::


### Assigning studios, departments, and users

Once a project exists, it must be connected to the people and organizational structure that will use it:

- **Studios** define the top-level organization.
- **Departments** (modeling, rigging, animation, lighting, etc.) define how work is divided.
- **Users** are assigned to possibly multiple departments and projects, but only one studio, with specific roles and permissions.

Define new departments:

::: code-group
```python [Python]
gazu.person.new_department(name="my department", color="#00FF00")
```
```bash [cURL]

```
:::

Add users to the project:

::: code-group
```python [Python]
gazu.project.add_person_to_team(project="8910...", person="hufhduh...")
```
```bash [cURL]

```
:::

Assign roles that control visibility and edit rights ([check the Access Control guide](/guides/access-control) for more info):

::: code-group
```python [Python]
person = gazu.person.new_person(
    first_name="hello",
    last_name="world",
    email="test@cg-wire.com",
    phone="",
    role="user"
)
```
```bash [cURL]

```
:::

## 2. Defining the Production Structure

The next step is defining what is being produced and how work is organized.

### Defining Shot Structure

A production / project is organized hierarchically into episodes (optional, for episodic productions), sequences (series of shots), and shots ().

Create episodes and sequences:

::: code-group
```python [Python]
gazu.shot.new_episode(project: str | dict, name: str)

gazu.shot.new_sequence(project: str | dict, name: str, episode: str | dict | None = None)
```
```bash [cURL]

```
:::

Adding a shot to a sequence:

::: code-group
```python [Python]
gazu.shot.new_shot(project="", sequence="", name="", nb_frames=50, frame_in=0, frame_out=50, description="", data={})
```
```bash [cURL]

```
:::

Query or update shots:

::: code-group
```python [Python]
shot = gazu.shot.get_shot(shot_id: str)

gazu.shot.update_shot(shot: dict)
```
```bash [cURL]

```
:::

This hierarchy is critical for scheduling, task assignment, and reporting, so make sure to get it right from the start.

### Defining Asset Types

Assets represent reusable production elements. Kitsu supports both standard and custom asset types like characters, props, sets / environments, vehicles, FX elements... or any studio-specific category.

Asset types define how assets are grouped, which tasks and statuses apply to them, and how they fit in the pipeline.

To create or configure asset types:

::: code-group
```python [Python]
gazu.asset.new_asset_type(name: str)

gazu.asset.update_asset_type(asset_type: dict)
```
```bash [cURL]

```
:::

### Defining Task Types and Statuses

Tasks represent units of work (modeling, rigging, animation, etc.), while statuses represent progress (to do, in progress, review, approved, etc.).

Define task types:

::: code-group
```python [Python]
gazu.task.new_task_type(name: str, color: str = '#000000', for_entity: str = 'Asset')
```
```bash [cURL]

```
:::

Assign tasks to assets, shots, or people:

::: code-group
```python [Python]
gazu.task.create_asset_tasks(asset: str | dict, task_types: list[str | dict])

gazu.task.create_shot_tasks(shot: str | dict, task_types: list[str | dict])

gazu.task.assign_task(task: str | dict, person: str | dict)
```
```bash [cURL]

```
:::

Control which task statuses are available for tracking:

::: code-group
```python [Python]
gazu.task.all_task_statuses()

gazu.task.update_task_status(task_status: dict)

gazu.task.remove_task_status(task_status: str | dict)
```
```bash [cURL]

```
:::

You can also [update task status automatically based on pipeline events with event listeners](/guides/event-listeners).

This structure enables consistent tracking across teams and tools.

## 3. Managing Metadata

Most studios need to track data that goes beyond built-in fields. Kitsu supports this through metadata descriptors: extra fields listed in the data attribute of entities.

### Defining Metadata Descriptors

::: code-group
```python [Python]
gazu.project.add_metadata_descriptor(
    project: str | dict, 
    name: str, 
    entity_type = "asset", 
    data_type: str = 'string', 
    choices: list[str] = [], 
    for_client: bool = False, 
    departments: list[str | dict] = []
)
```
```bash [cURL]

```
:::

### Using Metadata Descriptors

Meta columns allow you to attach structured data to assets, shots, and tasks. Common use cases include:

* Technical specifications
* Pipeline flags
* External IDs
* Delivery requirements

You can then visualize the metadata in the Kitsu dashboard or by reading the metadata field of an entity.

### Reading and Writing Metadata via the API

Writing metadata to an asset:

::: code-group
```python [Python]
gazu.asset.new_asset(
    project: str | dict, 
    asset_type: str | dict, 
    name: str, 
    description: str | None = None, 
    extra_data: dict = {}, 
    episode: str | dict = None, 
    is_shared: bool = False
)
```
```bash [cURL]

```
:::

## 4. Managing your production structure

## Get a project

::: code-group
```python [Python]
project = gazu.project.get_project(project_id)
project = gazu.project.get_project_by_name(name="Agent 327")
```
```bash [cURL]

```
:::

## List all projects

::: code-group
```python [Python]
projects = gazu.project.all_projects()
```
```bash [cURL]

```
:::

## List all active projects

::: code-group
```python [Python]
projects = gazu.project.all_open_projects()
```
```bash [cURL]

```
:::

## Next Steps

Once a production is structured and configured, you can [move on to people and permissions](/guides/team-management).
