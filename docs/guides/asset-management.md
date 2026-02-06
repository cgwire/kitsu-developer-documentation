# Managing Assets and Shots

## Core Concepts

Before diving into workflows, it’s important to understand how Kitsu represents production data.

* **Assets** – reusable production elements (characters, props, environments, etc.)
* **Shots** – time-based units of work within a sequence
* **Asset Typess** – classification and categorization
* **Tasks** – units of work attached to assets or shots
* **Files** – published media or work files linked to entities
* **Versions** – iterations of published work

* How assets relate to shots
* How tasks, files, and versions attach to assets and shots
* Project and production scoping

## Creating Assets and Shots

Programmatically create assets and shots when setting up a new project, sequence, or pipeline stage.

* Creating assets with a specific asset type
* Creating shots within a sequence
* Setting initial metadata at creation time
* Assigning assets or shots to a project

Create/update/delete an asset:

```python
asset = gazu.asset.new_asset(
    project_dict, 
    asset_type_dict, 
    "My new asset",
    "My asset description"
)

asset = gazu.asset.update_asset(new_values_dict)
gazu.asset.remove_asset(asset)
```

Create/update/delete an asset type:

```python
asset_type = gazu.asset.new_asset_type("my new asset_type")
asset_type = gazu.asset.update_asset_type(new_values_dict)
gazu.asset.remove_asset_type(asset)
```

Create shot, sequence, and episode:

```python
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

Update shots:

```python
shot = gazu.shot.update_shot(shot, data={})
```

## Retrieve assets

Get a given asset:

```python
asset = gazu.asset.get_asset(asset_id)
asset = gazu.asset.get_asset_by_name(project_dict, asset_name)
```

Find all assets:

```python
assets = gazu.asset.all_assets_for_project(project_dict)
assets = gazu.asset.all_assets_for_shot(shot_dict)
assets = gazu.asset.all_assets_for_project_and_type(project_dict, asset_type_dict)
```

## Retrieve asset types

Get a given asset type:

```python
asset_type = gazu.asset.get_asset_type(asset_type_id)
asset_type = gazu.asset.get_asset_type_by_name(asset_type_name)
```

Find all asset types:

```python
asset_types = gazu.asset.all_asset_types()
asset_types = gazu.asset.all_asset_types_for_project(project_dict) 
asset_types = gazu.asset.all_asset_types_for_shot(shot_dict) # casted in given shot
```

## Updating Assets

Modify existing entities as production evolves.

```py
update asset
```

## Asset instance helpers

```python
asset_instance = get_asset_instance(asset_instance_id)
asset_instances = all_asset_instances_for_asset(asset_dict)
asset_instances = all_asset_instances_for_shot(shot_dict)
```

## Managing Descriptions, Tags, and Custom Fields

Store production-specific or studio-specific data directly on assets and shots.

* Text descriptions
* Tagging assets and shots for organization
* Using custom fields for pipeline data (e.g. LOD, render complexity, department notes)

```py
setting custom metadata on an asset
```

## Linking Assets to Shots

Define which assets are used in which shots to enable tracking, dependency analysis, or automation.

* Creating relationships between assets and shots
* Updating asset–shot links
* Querying linked entities

```python
asset_instance = gazu.shot.new_shot_asset_instance(shot_dict, asset_dict)
asset_instances = gazu.shot.all_asset_instances_for_shot(shot_dict)
```

## Finding Shots, Sequences, and Episodes

Retrieve all shots for a given project or sequence:

```python
shots = gazu.shot.all_shots_for_project(project_dict)
shots = gazu.shot.all_shots_for_sequence(sequence_dict)
```

Retrieve all sequences for a given project or episode.

```python
sequences = gazu.shot.all_sequences_for_project(project_id)
sequences = gazu.shot.all_sequences_for_episode(episode_dict)
```

Retrieve all episodes for a given project:

```python
episodes = gazu.shot.all_episodes_for_project(project_dict)
```

Retrieve given shot:

```python
shot = gazu.shot.get_shot(shot_id)
shot = gazu.shot.get_shot_by_name(sequence_dict, "SH01")
```

Retrieve the given sequence:

```python
sequence = gazu.shot.get_sequence(shot_id)
sequence = gazu.shot.get_sequence_by_name(project_dict, "SE01", episode=episode_dict)
```

Retrieve given episode:

```python
episode = gazu.shot.get_episode(shot_id)
episode = gazu.shot.get_episode_by_name(project_dict, "SE01")
```

## Managing Files and Versions

Track published work, iterations, and approvals.

* Attaching files to assets or shots
* Creating new versions
* Managing version metadata (comments, status, author)

Change file tree template for given project:

```python
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

Get all output types:

```python
output_types = gazu.files.all_output_types()
```

Retrieve given output type:

```python
output_type = gazu.files.get_output_type(output_type_id)
output_type = gazu.files.get_output_type_by_name("Cache")
output_types = gazu.files.all_output_types_for_entity(asset_dict)
output_types = gazu.files.all_output_types_for_entity(shot_dict)
output_types = gazu.files.all_output_types_for_asset_instance(asset_dict)
```

Create a new output file:

```python
output_type = gazu.files.new_output_type("Geometry", "geo")
```

Get all software:

```python
softwares = gazu.files.all_softwares()
```

Retrieve given software:

```python
software = gazu.files.get_software(software_id)
software = gazu.files.get_software_by_name("Maya")
```

Retrieve the given output file:

```python
output_file = gazu.files.get_output_file(output_file_id)
output_file = gazu.files.get_output_file_by_path(path)
```

Retrieve output files related to given entity:

```python
output_files = gazu.files.all_output_files_for_entity(
    asset_dict, output_type_dict, representation="abc")
output_files = gazu.files.all_output_files_for_asset_instance(
    asset_dict, output_type_dict, representation="abc")
output_files_dict = gazu.files.get_last_output_files_for_entity(asset_dict)
output_files_dict = gazu.files.get_last_output_files_for_entity(shot_dict)
output_files_dict = gazu.files.get_last_output_files_for_asset_instance(
    asset_instance_dict)
```

Manage output file revisions:

```python
next_revision = gazu.files.get_next_entity_ouput_revision(task, output_type)
last_revision = gazu.files.get_last_entity_ouput_revision(task, output_type)
next_revision = gazu.files.get_next_asset_instance_ouput_revision(
    task, output_type)
last_revision = gazu.files.get_last_asset_instance_ouput_revision(
    task, output_type)
```

Create a new output file:

```python
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

Get working files:

```python
working_files = gazu.files.get_working_files_for_task(task)
working_files = gazu.files.get_last_working_files(task)
```

Get a given working file:

```python
working_file = gazu.files.get_working_file(working_id)
```

Get working files revision:

```python
working_file = gazu.files.get_last_working_file_revision(
    task_dict, 
    name="main"
)
```

Create a new working file:

```python
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

Generate working file path from a given task:

```python
file_path = gazu.files.build_working_file_path(
    task_dict, 
    name="main",
    mode="output", 
    software=software_dict,
    revision=1,
    sep="/"
)
```

Generate output file path from a given entity:

```python
file_path = gazu.files.build_entity_output_file_path(
    entity_dict,
    output_type_dict,
    task_type_dict,
    name="main",
    mode="output",
    revision=1
)
```

Generate output file path from a given asset instance:

```python
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

Download files related to a preview:

```python
gazu.files.download_preview_file(preview_file, "./target.mp4")
gazu.files.download_preview_file_thumbnail(preview_file, "./target.png")
```

## Archiving or Deleting Assets and Shots

Clean up or retire entities without losing production history.

```py
One code example: deleting an asset
```

## Querying and Filtering Large Datasets

Efficiently retrieve and process large amounts of production data.

* Filtering by type, status, tags, or custom fields
* Pagination and batching
* Sorting and searching

```py
One code example: searching an asset by type and task status
```

## Files functions

Upload a given file to given path:

```python
gazu.client.upload("thumbnails/projects", "my_file.png")
````

Download a given file to given path:

```python
gazu.client.download("thumbnails/projects/project-id.png", "my_file.png")
````
