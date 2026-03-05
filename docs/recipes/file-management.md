# File management

To generate file paths, Zou relies on JSON-based configuration files called
file trees. Each project has its own file tree that defines how paths are
constructed for working files and output files.

## Contexts

`working` and `output` are required in all file trees. You can also add custom
contexts to define additional output locations (e.g. a delivery folder):

```json
{
  "working": {...},
  "output": {...},
  "delivery": {...}
}
```

The `mode` parameter in path-building functions selects which context to
resolve against. This lets you generate different paths for the same file
depending on its destination.

## Context details

Each context is composed of 4 fields:

* Mounting point
* Root folder
* Folder path template
* File name template

```json
"working": {
  "mountpoint": "/working_files",
  "root": "productions",
  "folder_path": {...},
  "file_name": {...}
}
```

## Folder path

The folder path section requires a template for each entity type and a style
setting:

* Path for tasks related to assets.
* Path for tasks related to shots.
* Path for tasks related to sequences.
* Style (`lowercase` or `uppercase`)

```json
"folder_path": {
  "shot": "<Project>/shots/<Sequence>/<Shot>/<TaskType>",
  "asset": "<Project>/assets/<AssetType>/<Asset>/<TaskType>",
  "sequence": "<Project>/sequences/<Sequence>/<TaskType>",
  "style": "lowercase"
}
```

Tags (words between `<>`) are replaced by the name of the corresponding
entity attached to the task.

Available tags: `<Project>`, `<Sequence>`, `<Episode>`, `<Shot>`, `<AssetType>`,
`<Asset>`, `<TaskType>`, `<OutputType>`, `<Software>`, `<Scene>`.

## File name

File name templates work the same way as folder templates.

```json
"file_name": {
  "shot": "<Project>_<Sequence>_<Shot>_<TaskType>",
  "asset": "<Project>_<AssetType>_<Asset>_<TaskType>",
  "sequence": "<Project>_<Sequence>_<TaskType>",
  "style": "lowercase"
}
```

## Setting up a file tree

Before building paths, you need to set the file tree on your project:

```python
import gazu

gazu.set_host("http://localhost/api")
gazu.log_in("admin@example.com", "mysecretpassword")

project = gazu.project.get_project_by_name("My Project")

gazu.files.update_project_file_tree(project, {
    "working": {
        "mountpoint": "/prod",
        "root": "work",
        "folder_path": {
            "shot": "<Project>/shots/<Sequence>/<Shot>/<TaskType>",
            "asset": "<Project>/assets/<AssetType>/<Asset>/<TaskType>",
            "sequence": "<Project>/sequences/<Sequence>/<TaskType>",
            "style": "lowercase"
        },
        "file_name": {
            "shot": "<Project>_<Sequence>_<Shot>_<TaskType>_v<Revision>",
            "asset": "<Project>_<AssetType>_<Asset>_<TaskType>_v<Revision>",
            "sequence": "<Project>_<Sequence>_<TaskType>_v<Revision>",
            "style": "lowercase"
        }
    },
    "output": {
        "mountpoint": "/prod",
        "root": "output",
        "folder_path": {
            "shot": "<Project>/shots/<Sequence>/<Shot>/<TaskType>/<OutputType>",
            "asset": "<Project>/assets/<AssetType>/<Asset>/<TaskType>/<OutputType>",
            "sequence": "<Project>/sequences/<Sequence>/<TaskType>/<OutputType>",
            "style": "lowercase"
        },
        "file_name": {
            "shot": "<Project>_<Sequence>_<Shot>_<OutputType>_v<Revision>",
            "asset": "<Project>_<AssetType>_<Asset>_<OutputType>_v<Revision>",
            "sequence": "<Project>_<Sequence>_<OutputType>_v<Revision>",
            "style": "lowercase"
        }
    },
    "delivery": {
        "mountpoint": "/delivery",
        "root": "final",
        "folder_path": {
            "shot": "<Project>/<Sequence>/<Shot>",
            "asset": "<Project>/<AssetType>/<Asset>",
            "sequence": "<Project>/<Sequence>",
            "style": "lowercase"
        },
        "file_name": {
            "shot": "<Project>_<Sequence>_<Shot>_v<Revision>",
            "asset": "<Project>_<AssetType>_<Asset>_v<Revision>",
            "sequence": "<Project>_<Sequence>_v<Revision>",
            "style": "lowercase"
        }
    }
})
```

## Building file names

Path-building functions return the full path (folder + file name). If you only
need the file name, use the dedicated name-building functions.

### Working file name

```python
project = gazu.project.get_project_by_name("My Project")
asset = gazu.asset.get_asset_by_name(project, "Main Character")
task_type = gazu.task.get_task_type_by_name("Modeling")
task = gazu.task.get_task_by_entity(asset, task_type)
software = gazu.files.get_software_by_name("Blender")

name = gazu.files.build_working_file_name(
    task,
    name="main",
    mode="working",
    software=software,
    revision=1,
)
# => my_project_character_main_character_modeling_v001
```

### Output file name

```python
output_type = gazu.files.get_output_type_by_name("Geometry")

name = gazu.files.build_entity_output_file_name(
    asset,
    output_type,
    task_type,
    name="main",
    mode="output",
    revision=2,
)
# => my_project_character_main_character_geometry_v002
```

The `mode` parameter works the same way as for paths. It selects which
context's `file_name` template to use:

```python
# Name using the delivery template (flatter, no task type)
delivery_name = gazu.files.build_entity_output_file_name(
    asset,
    output_type,
    task_type,
    name="main",
    mode="delivery",
    revision=2,
)
# => my_project_character_main_character_v002
```

## Building working file paths

Once a file tree is configured, you can generate paths for working files.
The `mode` parameter selects which context (`working` or `output`) to use for
resolving the path:

```python
project = gazu.project.get_project_by_name("My Project")
asset = gazu.asset.get_asset_by_name(project, "Main Character")
task_type = gazu.task.get_task_type_by_name("Modeling")
task = gazu.task.get_task_by_entity(asset, task_type)
software = gazu.files.get_software_by_name("Blender")

# Build path using the "working" context
working_path = gazu.files.build_working_file_path(
    task,
    name="main",
    mode="working",
    software=software,
    revision=1,
    sep="/"
)
# => /prod/work/my_project/assets/character/main_character/modeling/
#    my_project_character_main_character_modeling_v001
```

The same function works for shots:

```python
sequence = gazu.shot.get_sequence_by_name(project, "SE01")
shot = gazu.shot.get_shot_by_name(sequence, "S001")
task_type = gazu.task.get_task_type_by_name("Animation")
task = gazu.task.get_task_by_entity(shot, task_type)
software = gazu.files.get_software_by_name("Maya")

working_path = gazu.files.build_working_file_path(
    task,
    name="main",
    mode="working",
    software=software,
    revision=3,
    sep="/"
)
# => /prod/work/my_project/shots/se01/s001/animation/
#    my_project_se01_s001_animation_v003
```

## Building output file paths

Output paths are generated from an entity (asset or shot), an output type, and
a task type. The `mode` parameter selects which file tree context is used to
resolve the mountpoint, root, folder path, and file name templates.

If your file tree defines `working`, `output`, and `delivery` contexts, you can
generate a different path for the same file depending on its destination:

```python
output_type = gazu.files.get_output_type_by_name("Geometry")
task_type = gazu.task.get_task_type_by_name("Modeling")

# Internal output (mode="output")
output_path = gazu.files.build_entity_output_file_path(
    asset,
    output_type,
    task_type,
    name="main",
    mode="output",
    revision=2,
    sep="/"
)
# => /prod/output/my_project/assets/character/main_character/modeling/geometry/
#    my_project_character_main_character_geometry_v002

# Client delivery (mode="delivery")
delivery_path = gazu.files.build_entity_output_file_path(
    asset,
    output_type,
    task_type,
    name="main",
    mode="delivery",
    revision=2,
    sep="/"
)
# => /delivery/final/my_project/character/main_character/
#    my_project_character_main_character_v002
```

This is useful when different stages of the pipeline write to different storage
locations. For example a local disk for daily work, a shared volume for
internal outputs, and a separate delivery folder for client packages.

The same applies to `build_working_file_path`. You can pass any custom context
name as `mode` to resolve paths against it.

For asset instances (an asset placed in a shot), use
`build_asset_instance_output_file_path`:

```python
asset_instance = gazu.asset.all_asset_instances_for_shot(shot)[0]

output_path = gazu.files.build_asset_instance_output_file_path(
    asset_instance,
    shot,  # temporal entity (shot or scene)
    output_type,
    task_type,
    name="main",
    mode="output",
    revision=1,
    sep="/"
)
```

## Full example: working file to output file

This example shows a complete workflow, registering a working file, then
producing an output file from it:

```python
import gazu

gazu.set_host("http://localhost/api")
gazu.log_in("admin@example.com", "mysecretpassword")

# Retrieve production entities
project = gazu.project.get_project_by_name("My Project")
asset = gazu.asset.get_asset_by_name(project, "Main Character")
task_type = gazu.task.get_task_type_by_name("Modeling")
task = gazu.task.get_task_by_entity(asset, task_type)
software = gazu.files.get_software_by_name("Blender")

# 1. Register a new working file
working_file = gazu.files.new_working_file(
    task,
    name="main",
    software=software,
    comment="Initial sculpt",
    revision=0,  # 0 = auto-increment to next revision
    sep="/"
)

# 2. Build the working file path (to know where to save on disk)
working_path = gazu.files.build_working_file_path(
    task,
    name="main",
    mode="working",
    software=software,
    revision=working_file["revision"],
    sep="/"
)
print(f"Save working file to: {working_path}")

# 3. Create an output from that working file
output_type = gazu.files.get_output_type_by_name("Geometry")

output_file = gazu.files.new_entity_output_file(
    asset,
    output_type,
    task_type,
    working_file,
    "Exported geometry for rigging",
    revision=0,  # 0 = auto-increment
    representation="abc",
    sep="/"
)

# 4. Build the output file path
output_path = gazu.files.build_entity_output_file_path(
    asset,
    output_type,
    task_type,
    name="main",
    mode="output",
    revision=output_file["revision"],
    sep="/"
)
print(f"Save output file to: {output_path}")
```
