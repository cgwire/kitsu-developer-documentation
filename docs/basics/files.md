# Files

work in progress...

* File status
    * name
    * color

* Output files
    * name 
    * extension
    * revision
    * size
    * checksum
    * description
    * comment
    * representation: to tell what kind of output it is (abc, jpgs, pngs, etc.)
    * nb\_elements: For image sequence
    * source: created by a script, a webgui or a desktop gui.
    * path: File path on the production hard drive
    * data: Free JSON field to add metadata
    * file\_status\_id
    * entity\_id: Asset or Shot concerned by the output file
    * task\_type\_id: Task type relate to this output file (modeling, animation, etc.)
    * output\_type\_id: Type of output (geometry, cache, etc.)
    * person\_id = Author of the file
    * source\_file\_id = Working file that led to create this output file
    * temporal\_entity\_id = Shot, scene or sequence, needed for output files related to an asset instance.
	
* Output types
	* name 
	* short\_name

* Preview files
    * name
    * revision
    * extension: file extension
    * description
    * path: File path on the production hard drive
    * source: Webgui, desktop, script
    * annotations: Coordinates to display annotations in the preview player.
    * task\_id: task related to the preview file
    * person\_id: Autho of the preview
    * source\_file\_id: Working file that generated this preview
    * shotgun\_id: Used for synchronization with a Shotgun instance

* Working files
    * name
    * description
    * comment
    * revision
    * size
    * checksum
    * path: File path on the production hard drive
    * task\_id: Task for which the working file is made for
    * entity\_id: Entity for which the working is made for
    * person\_id: File author
    * software\_id: Sofware used to build this working file
    * outputs: List of output files generated from this working file
    * data: Free JSON field to add metadata

* Software
    * name
    * short\_name
    * file\_extension: Main extension used for this software files
    * secondary\_extensions: Other extensions used for this software files

## Post a preview

We assume you have already retrieved the related task and comment. To add a
preview, you need to specify what you want to upload as a new preview:

```python
preview_file = gazu.task.add_preview(
    task,
    comment,
    "/path/to/my/file.mp4"
)
gazu.task.set_main_preview(preview_file) #  Set preview as asset thumbnail
```

Another alternative is to use the `publish` shortcut to post a comment and 
link a preview file to it:

```python
(comment, preview_file) = gazu.task.publish_preview(
    task,
    wip,
    comment="Change status to work in progress",
    preview_file_path="/path/to/my/file.mp4"
)
```

## Deal with Files

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

### Files functions

Upload a given file to given path:

```python
gazu.client.upload("thumbnails/projects", "my_file.png")
````

Download a given file to given path:

```python
gazu.client.download("thumbnails/projects/project-id.png", "my_file.png")
````
