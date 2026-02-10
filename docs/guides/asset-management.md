# Managing Assets and Shots

Asset management is about organizing characters, props, sets, and other production elements in a consistent, queryable structure.

## Core Concepts

- **Assets** - reusable production elements (characters, props, environments, etc.)
- **Asset Typess** - classification and categorization
- **Shots** - time-based units of work within a sequence
- **Files** - published media, previews, or work files linked to entities
- **Versions** - iterations of published work

## Creating Assets and Shots

### Managing assets

::: code-group
```python [Python]
asset = gazu.asset.new_asset(
    project, 
    asset_type, 
    name="My new asset",
    description="My asset description"
)

gazu.asset.update_asset(modified_asset)

gazu.asset.remove_asset(asset)
```
```bash [cURL]

```
:::

### Managing asset types

::: code-group
```python [Python]
asset_type = gazu.asset.new_asset_type("my new asset_type")

asset_type = gazu.asset.update_asset_type(asset_type)

gazu.asset.remove_asset_type(asset_type)
```
```bash [cURL]

```
:::

### Creating shots, sequences, and episodes

::: code-group
```python [Python]
shot = gazu.shot.new_shot(
    project_dict, 
    sequence_dict, 
    "SH01", 
    frame_in=10, 
    frame_out=20, 
    data={"extra_data": "value"}
)
sequence = gazu.shot.new_sequence(project_dict, episode, name)
episode = gazu.shot.new_episode(project_dict, "SH01")
```
```bash [cURL]

```
:::

### Update shots

::: code-group
```python [Python]
shot = gazu.shot.update_shot(shot, data={})
```
```bash [cURL]

```
:::

## Read assets

### Find an asset

::: code-group
```python [Python]
asset = gazu.asset.get_asset(asset_id)
asset = gazu.asset.get_asset_by_name(project_dict, asset_name)
```
```bash [cURL]

```
:::

### List all assets

::: code-group
```python [Python]
assets = gazu.asset.all_assets_for_project(project_dict)
assets = gazu.asset.all_assets_for_shot(shot_dict)
assets = gazu.asset.all_assets_for_project_and_type(project_dict, asset_type_dict)
```
```bash [cURL]

```
:::

### Find an asset type

::: code-group
```python [Python]
asset_type = gazu.asset.get_asset_type(asset_type_id)
asset_type = gazu.asset.get_asset_type_by_name(asset_type_name)
```
```bash [cURL]

```
:::

### List all asset types

::: code-group
```python [Python]
asset_types = gazu.asset.all_asset_types()
asset_types = gazu.asset.all_asset_types_for_project(project_dict) 
asset_types = gazu.asset.all_asset_types_for_shot(shot_dict) # casted in given shot
```
```bash [cURL]

```
:::

## List Asset Instances

The asset is the definition (e.g dragon character) and an instance is an occurence of that asset in a shot ("Dragon #1 in Shot 010").

::: code-group
```python [Python]
asset_instance = get_asset_instance(asset_instance_id)
asset_instances = all_asset_instances_for_asset(asset_dict)
asset_instances = all_asset_instances_for_shot(shot_dict)
```
```bash [cURL]

```
:::

## Managing Descriptions, Tags, and Custom Fields

You can store production- or studio-specific data directly in assets and shots as metadata. This is useful for tagging or for use in pipeline tools.

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

## Linking Assets to Shots

Define which assets are used in which shots to support tracking, dependency analysis, or automation.

Example linking an asset and a shot:

::: code-group
```python [Python]
asset_instance = gazu.shot.new_shot_asset_instance(shot_dict, asset_dict)

asset_instances = gazu.shot.all_asset_instances_for_shot(shot_dict)
```
```bash [cURL]

```
:::

## Finding Shots, Sequences, and Episodes

### List all shots in a project or sequence

::: code-group
```python [Python]
shots = gazu.shot.all_shots_for_project(project_dict)
shots = gazu.shot.all_shots_for_sequence(sequence_dict)
```
```bash [cURL]

```
:::

### List all sequences in a project or episode

::: code-group
```python [Python]
sequences = gazu.shot.all_sequences_for_project(project_id)
sequences = gazu.shot.all_sequences_for_episode(episode_dict)
```
```bash [cURL]

```
:::

### List all episodes in a project

::: code-group
```python [Python]
episodes = gazu.shot.all_episodes_for_project(project_dict)
```
```bash [cURL]

```
:::

### Find a shot by id or name

::: code-group
```python [Python]
shot = gazu.shot.get_shot(shot_id)
shot = gazu.shot.get_shot_by_name(sequence_dict, "SH01")
```
```bash [cURL]

```
:::

### Find a sequence

::: code-group
```python [Python]
sequence = gazu.shot.get_sequence(shot_id)
sequence = gazu.shot.get_sequence_by_name(project_dict, "SE01", episode=episode_dict)
```
```bash [cURL]

```
:::

### Find an episode

::: code-group
```python [Python]
episode = gazu.shot.get_episode(shot_id)
episode = gazu.shot.get_episode_by_name(project_dict, "SE01")
```
```bash [cURL]

```
:::

## Managing Files and Versions

Three are 3 types of files in Kitsu: previews, working files, and output files.

- A **preview** is a temporary file used for reviews.
- A **working file** is the artist’s editable source file.
- An **output file** is what you export or render from the working file. 

### Increment an asset's version

You can increment an asset's version by attaching a new preview to a linked task.

::: code-group
```python [Python]
(comment, preview_file) = gazu.task.publish_preview(
    task,
    wip,
    comment="Change status to work in progress",
    preview_file_path="/path/to/my/file.mp4"
)

```
```bash [cURL]

```
:::

### Download a preview

::: code-group
```python [Python]
gazu.files.download_preview_file(preview_file, "./target.mp4")

gazu.files.download_preview_file_thumbnail(preview_file, "./target.png")
```
```bash [cURL]

```
:::

### Get all output file types

::: code-group
```python [Python]
output_types = gazu.files.all_output_types()
```
```bash [cURL]

```
:::

### Retrieve given output type

::: code-group
```python [Python]
output_type = gazu.files.get_output_type(output_type_id)
output_type = gazu.files.get_output_type_by_name("Cache")
output_types = gazu.files.all_output_types_for_entity(asset_dict)
output_types = gazu.files.all_output_types_for_entity(shot_dict)
output_types = gazu.files.all_output_types_for_asset_instance(asset_dict)
```
```bash [cURL]

```
:::

### Create a new output file

::: code-group
```python [Python]
output_type = gazu.files.new_output_type("Geometry", "geo")
```
```bash [cURL]

```
:::

### List all software extensions

Files can be organized by DCC software. For example, Maya or Blender files.

::: code-group
```python [Python]
softwares = gazu.files.all_softwares()
```
```bash [cURL]

```
:::

### Find a software extension

::: code-group
```python [Python]
software = gazu.files.get_software(software_id)
software = gazu.files.get_software_by_name("Maya")
```
```bash [cURL]

```
:::

### Retrieve an output file

::: code-group
```python [Python]
output_file = gazu.files.get_output_file(output_file_id)
output_file = gazu.files.get_output_file_by_path(path)
```
```bash [cURL]

```
:::

### List output files related to a given entity

::: code-group
```python [Python]
output_files = gazu.files.all_output_files_for_entity(
    asset_dict, output_type_dict, representation="abc")
output_files = gazu.files.all_output_files_for_asset_instance(
    asset_dict, output_type_dict, representation="abc")
output_files_dict = gazu.files.get_last_output_files_for_entity(asset_dict)
output_files_dict = gazu.files.get_last_output_files_for_entity(shot_dict)
output_files_dict = gazu.files.get_last_output_files_for_asset_instance(
    asset_instance_dict)
```
```bash [cURL]

```
:::

### Manage output file revisions

::: code-group
```python [Python]
next_revision = gazu.files.get_next_entity_ouput_revision(task, output_type)
last_revision = gazu.files.get_last_entity_ouput_revision(task, output_type)
next_revision = gazu.files.get_next_asset_instance_ouput_revision(
    task, output_type)
last_revision = gazu.files.get_last_asset_instance_ouput_revision(
    task, output_type)
```
```bash [cURL]

```
:::

### Create a new output file

::: code-group
```python [Python]
output_file = gazu.files.new_entity_output_file(
    asset_dict, # or shot_dict
    output_type_dict,
    task_type_dict,
    source_working_file_dict,
    "comment",
    person=person_dict, # author
    revision=1,
    nb_elements=1, # change it only for image sequences
    representation="ob",
    sep="/"
)

output_file = gazu.files.new_asset_instance_output_file(
    asset_instance_dict,
    output_type_dict,
    task_type_dict,
    source_working_file_dict,
    "comment",
    person=person_dict, # author
    revision=1,
    nb_elements=1, # change it only for image sequences
    representation="ob",
    sep="/"
)
```
```bash [cURL]

```
:::

### List working files

::: code-group
```python [Python]
working_files = gazu.files.get_working_files_for_task(task)
working_files = gazu.files.get_last_working_files(task)
```
```bash [cURL]

```
:::

### Get a working file

::: code-group
```python [Python]
working_file = gazu.files.get_working_file(working_id)
```
```bash [cURL]

```
:::

### Get a working file's revision

::: code-group
```python [Python]
working_file = gazu.files.get_last_working_file_revision(
    task_dict, 
    name="main"
)
```
```bash [cURL]

```
:::

### Create a new working file

::: code-group
```python [Python]
working_file = gazu.files.new_working_file(
    task_dict,
    name="main",
    software=software_dict,
    comment="",
    person=person_dict, # Automatically set as current user if set to None
    scene=1,
    revision=0, # If revision == 0, it is set as latest revision + 1
    sep="/"
)
```
```bash [cURL]

```
:::

### Generate a working file path from a task

::: code-group
```python [Python]
file_path = gazu.files.build_working_file_path(
    task_dict, 
    name="main",
    mode="output", 
    software=software_dict,
    revision=1,
    sep="/"
)
```
```bash [cURL]

```
:::

### Generate an output file path from an entity

::: code-group
```python [Python]
file_path = gazu.files.build_entity_output_file_path(
    entity_dict,
    output_type_dict,
    task_type_dict,
    name="main",
    mode="output",
    revision=1
)
```
```bash [cURL]

```
:::

### Generate an output file path from an asset instance

::: code-group
```python [Python]
file_path = gazu.files.build_asset_instance_output_file_path(
    asset_instance_dict,
    temporal_entity_dict,
    output_type_dict,
    task_type_dict,
    name="main",
    mode="output",
    revision=1
)
```
```bash [cURL]

```
:::

### Change file tree template for given project

Files are stored in a file tree. You can customize your storage structure:

::: code-group
```python [Python]
gazu.files.set_project_file_tree(project_id, file_tree_template_name)

gazu.files.update_project_file_tree(project_id, {
  "working": {
    "mountpoint": "/working_files",
    "root": "productions",
    "folder_path": {
      "shot": "<Project>/shots/<Sequence>/<Shot>/<TaskType>",
      "asset": "<Project>/assets/<AssetType>/<Asset>/<TaskType>",
      "sequence": "<Project>/sequences/<Sequence>>/<TaskType>",
      "style": "lowercase"
    },
    "file_name": {
      "shot": "<Project>_<Sequence>_<Shot>_<TaskType>",
      "asset": "<Project>_<AssetType>_<Asset>_<TaskType>",
      "sequence": "<Project>_<Sequence>_<TaskType>",
      "style": "lowercase"
    }
  }
})
```
```bash [cURL]

```
:::

## Archiving or Deleting Assets and Shots

Clean up or retire entities without losing production history.

::: code-group
```python [Python]
gazu.asset.remove_asset(asset: str | dict, force: bool = False)
```
```bash [cURL]

```
:::

## Raw Files functions

### Upload a given file to given path

::: code-group
```python [Python]
gazu.client.upload("thumbnails/projects", "my_file.png")
```
```bash [cURL]

```
:::

### Download a given file to given path

::: code-group
```python [Python]
gazu.client.download("thumbnails/projects/project-id.png", "my_file.png")
```
```bash [cURL]

```
:::
