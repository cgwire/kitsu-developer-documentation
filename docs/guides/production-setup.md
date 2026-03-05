# Creating and Structuring a Production

This section describes how a developer can use the Kitsu API to create, structure, and configure a production, from initial project setup to defining assets, shots, tasks, and metadata that support pipeline tracking and automation.

## 1. Production Setup

### Creating a Project

The project is the root container for all assets, shots, tasks, and metadata.

::: code-group
```python [Python]
project = gazu.project.new_project(name="Agent 327", production_type="short", production_style="2d")
```
:::


### Adding People to the Project Team

After creating your project, you can add people (users) to the project team by assigning them to the project.

::: code-group
```python [Python]
person = gazu.person.get_person_by_email("jane.doe@example.com")
project = gazu.project.get_project_by_name("Agent 327")

gazu.project.add_person_to_team(project, person)
```
:::

This operation ensures the user has access to project data according to their assigned permissions and responsibilities.



## 2. Defining the Production Entities

The next step is defining what is being produced and how work is organized.

### Defining Shot Structure

A production / project is organized hierarchically into episodes (optional, for episodic productions), sequences (series of shots), and shots.

Create episodes and sequences:

::: code-group
```python [Python]
gazu.shot.new_episode(project, name)

gazu.shot.new_sequence(project, name, episode=None)
```
:::

Adding a shot to a sequence:

::: code-group
```python [Python]
gazu.shot.new_shot(
    project="",
    sequence="",
    name="",
    nb_frames=50,
    frame_in=0,
    frame_out=50,
    description="",
    data={}
)
```
:::

Query or update shots:

::: code-group
```python [Python]
shot = gazu.shot.get_shot(shot_id)

gazu.shot.update_shot(shot)
```
:::

This hierarchy is critical for scheduling, task assignment, and reporting, so make sure to get it right from the start.

### Defining Asset Types

Assets represent reusable production elements. Kitsu supports both standard and custom asset types like characters, props, sets / environments, vehicles, FX elements... or any studio-specific category.

Asset types define how assets are grouped, which tasks and statuses apply to them, and how they fit in the pipeline.

To create or configure asset types:

::: code-group
```python [Python]
gazu.asset.new_asset_type(name)

gazu.asset.update_asset_type(asset_type)
```
:::

### Creating Assets

Once asset types are defined, you can begin creating assets for your production. Assets can be any kind of production element you want to track, organize, or assign work to (e.g. characters, props, locations, FX elements).

To create a new asset, specify the project, asset type, and a name. You can also provide a description and any additional metadata if needed.

::: code-group
```python [Python]
gazu.asset.new_asset(project, asset_type, name, description="", data={})
```
:::

To update an existing asset's information (such as description or metadata):

::: code-group
```python [Python]
asset = gazu.asset.get_asset(asset_id)
asset["description"] = "Updated description"
gazu.asset.update_asset(asset)
```
:::


### Defining Task Types and Statuses

Tasks represent units of work (modeling, rigging, animation, etc.), while statuses represent progress (to do, in progress, review, approved, etc.).

Define task types:

::: code-group
```python [Python]
task_type = gazu.task.get_task_type_by_name('Animation')
gazu.project.add_task_type(project, task_type)
```
:::

Define task statuses:

::: code-group
```python [Python]
status = gazu.task.get_task_status_by_name("Approved")
gazu.project.add_task_status(project, status)
```
:::


Create tasks:

::: code-group
```python [Python]
task_type_names = ["Modeling", "Rigging", "Animation"]
task_types = [gazu.task.get_task_type_by_name(name) for name in task_type_names]

gazu.task.create_asset_tasks(asset, task_types)
gazu.task.create_shot_tasks(shot, task_types)
```
:::

Assign tasks:

### Retrieve and Assign a Task

::: code-group
```python [Python]
modeling = gazu.task.get_task_type_by_name('Modeling')
main_char = gazu.asset.get_asset_by_name(project, 'Main character')
task = gazu.task.get_task_by_entity(main_char, modeling)
gazu.task.assign_task(task, person)
```
:::



## 3. Managing Metadata

Most studios need to track data that goes beyond built-in fields. Kitsu supports this through metadata descriptors: extra fields listed in the data attribute of entities.

### Defining Metadata Descriptors

::: code-group
```python [Python]
gazu.project.add_metadata_descriptor(
    project,
    name,
    entity_type="asset",
    data_type='string',
    choices=[],
    for_client=False,
    departments=[]
)
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
    project,
    asset_type,
    name,
    description=None,
    extra_data={},
    episode=None,
    is_shared=False
)
```
:::

## 4. Managing your production list

### Get a project

::: code-group
```python [Python]
project = gazu.project.get_project(project_id)
project = gazu.project.get_project_by_name(name="Agent 327")
```
:::

### List all projects

::: code-group
```python [Python]
projects = gazu.project.all_projects()
```
:::

### List all active projects

::: code-group
```python [Python]
projects = gazu.project.all_open_projects()
```
:::

## Next Steps

Once a production is structured and configured, you can [move on to people and permissions](/guides/team-management).
