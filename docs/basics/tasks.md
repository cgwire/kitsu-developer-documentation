* Tasks
    * shotgun\_id: Used for synchronization with a Shotgun instance

* Task status
    * name
    * short\_name
    * color
    * is\_done
    * is\_artist\_allowed
    * is\_retake
    * shotgun\_id: Used for synchronization with a Shotgun instance
 
* Task types
    * name
    * short\_name
    * color
    * priority
    * allow\_timelog
    * for\_shots
    * for\_entity
    * shotgun\_id: Used for synchronization with a Shotgun instance

## Deal with Tasks

Retrieve all tasks related to a given asset, shot, or sequence:

```python
tasks = gazu.task.all_tasks_for_asset(asset_dict)
tasks = gazu.task.all_tasks_for_shot(shot_dict)
tasks = gazu.task.all_tasks_for_scene(scene_dict)
tasks = gazu.task.all_tasks_for_sequence(sequence_dict)
tasks = gazu.task.all_tasks_for_entity_and_task_type(entity_dict, task_type)
tasks = gazu.task.all_tasks_for_task_status(
    project_dict, 
    task_type_dict,
    task_status_dict
)
```

Retrieve all task types or task types for shot or sequence:

```python
task_types = gazu.task.all_task_types()
task_types = gazu.task.all_task_types_for_shot(asset)
task_types = gazu.task.all_task_types_for_shot(shot)
task_types = gazu.task.all_task_types_for_scene(scene)
task_types = gazu.task.all_task_types_for_sequence(sequence)
```

Retrieve a given task:

```python
task = gazu.task.get_task_by_name(asset, task_type, "main")
```

Create a new task for a given asset: 

```python
task = gazu.task.new_task(asset, task_type)
task = gazu.task.new_task(asset, task_type, task_status=wip)
task = gazu.task.new_task(asset, task_type, assignees=[person_dict])
```

Retrieve a given task type:

```python
task_type = gazu.task.get_task_type(task_status_id)
task_type = gazu.task.get_task_type_by_name(task_type_name)
```

Retrieve a given task status:

```python
task_status = gazu.task.get_task_status(task_status_id)
task_status = gazu.task.get_task_status_by_name(task_status_name)
```

Set a given task status as work in progress:

```python
gazu.task.start_task(task_dict)
```

Add and get time spent:

```python
time_spent = gazu.task.get_time_spent(task_dict, "2018-03-18")
time_spent = gazu.task.set_time_spent(task_dict, person_dict, "2018-03-18", 8 * 3600)
time_spent = gazu.task.add_time_spent(task_dict, person_dict, "2018-03-18", 3600)
```
