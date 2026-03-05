# Managing Assets and Shots

## Managing Files and Versions

Three are 3 types of files in Kitsu: previews, working files, and output files.

- A **working file** is the artist’s editable source file.
- An **output file** is what you export or render from the working file.
- A **preview file** is a file used for reviews, displayed in the Kitsu.

## File tree

To manage the file tree and generate path properly, Zou relies on a template
you set at the project level. You can create several templates by project but
in that case, you will have to specify which template to use when generating
your paths.


```python
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

## Software

### List all software

Files can be organized by DCC software. For example, Maya or Blender files.

```python
softwares = gazu.files.all_softwares()
```

### Find a software

```python
software = gazu.files.get_software(software_id)
software = gazu.files.get_software_by_name("Maya")
```


## Working files

### List working files

```python
working_files = gazu.files.get_working_files_for_task(task)
working_files = gazu.files.get_last_working_files(task)
```

### Get a working file

```python
working_file = gazu.files.get_working_file(working_id)
```

### Get a working file's revision

```python
working_file = gazu.files.get_last_working_file_revision(
    task_dict,
    name="main"
)
```

### Create a new working file

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

### Generate a working file path from a task

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

### Store a working file

```python
file_path = gazu.files.upload_working_file(working_file, "/path/to/file")
```
:::


## Output files

### Get all output file types

::: code-group
```python [Python]
output_types = gazu.files.all_output_types()
```

### Retrieve given output type

```python
output_type = gazu.files.get_output_type(output_type_id)
output_type = gazu.files.get_output_type_by_name("Cache")
output_types = gazu.files.all_output_types_for_entity(asset_dict)
output_types = gazu.files.all_output_types_for_entity(shot_dict)
output_types = gazu.files.all_output_types_for_asset_instance(asset_dict)
```

### Create a new output file

```python
output_type = gazu.files.new_output_type("Geometry", "geo")
```

### Retrieve an output file

```python
output_file = gazu.files.get_output_file(output_file_id)
output_file = gazu.files.get_output_file_by_path(path)
```

### List output files related to a given entity

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

### Manage output file revisions

```python
next_revision = gazu.files.get_next_entity_ouput_revision(task, output_type)
last_revision = gazu.files.get_last_entity_ouput_revision(task, output_type)
next_revision = gazu.files.get_next_asset_instance_ouput_revision(
    task, output_type)
last_revision = gazu.files.get_last_asset_instance_ouput_revision(
    task, output_type)
```

### Create a new output file

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


### Generate an output file path from an entity

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

## Raw Files functions

### Upload a given file to given path

```python
gazu.client.upload("thumbnails/projects", "my_file.png")
```

### Download a given file to given path

```python
gazu.client.download("thumbnails/projects/project-id.png", "my_file.png")
```

## Next Steps

* Learn about [publishing and reviews](/guides/publishing)
* Learn about [event listeners](/guides/event-listeners)