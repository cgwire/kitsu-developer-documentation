# Task Tracking

Entity tracking covers tasks, changes, and progress for assets and shots as they move through the pipeline.

The API allows developers to read, edit, and automate production schedules using structured production data (episodes, sequences, shots, assets, tasks, and time spents).

## Automating Production Tracking

### Creating Task Types

Task types define the production steps (e.g. Animation, Lighting, Compositing).


```python
gazu.task.new_task_type("Modeling")
```

### Creating Task Statuses

Task statuses define the different states a task can be in (e.g. To Do, WIP, Done).

```python
# Create a new task status
wip = gazu.task.new_task_status("WIP", color="blue")
done = gazu.task.new_task_status("Done", color="green")
```


### Creating Tasks for Assets and Shots

Tasks can be generated automatically when new assets or shots are created.

Create a new task for a given asset:

```python
task = gazu.task.new_task(asset, task_type)
task = gazu.task.new_task(asset, task_type, task_status=wip)
task = gazu.task.new_task(asset, task_type, assignees=[person_dict])
```


### Finding tasks

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
task_types = gazu.task.all_task_types_for_asset(asset)
task_types = gazu.task.all_task_types_for_shot(shot)
task_types = gazu.task.all_task_types_for_scene(scene)
task_types = gazu.task.all_task_types_for_sequence(sequence)
```

Retrieve a given task:

```python
task = gazu.task.get_task_by_entity(asset, task_type)

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

### Assigning Tasks to Users or Teams

Tasks can be assigned to individuals or whole teams.

```python
gazu.task.assign_task(task, person)
```

### Updating Task Statuses

Task statuses reflect production progress and drive dashboards and reports.

```python
task = gazu.task.get_task(task_id)
gazu.task.add_comment(task, wip)

```

Set a given task status as work in progress (shortcut):

```python
gazu.task.start_task(task_dict)

```

## Reading User Workloads

### Getting the Todo List of the Logged-In User

Developers can retrieve the current user’s assigned tasks to build dashboards or personal tools.

```python
tasks = gazu.user.all_tasks_to_do()

```

## Tracking Time Spents

Time spents record actual production effort and can be used for reporting and schedule validation.

### Reading Time Spent Entries

Each time spent includes a duration, date, related task, and the person who logged the time.

Add and get time spent:

```python
time_spent = gazu.task.get_time_spent(task_dict, "2018-03-18")
time_spent = gazu.task.set_time_spent(task_dict, person_dict, "2018-03-18", 8 * 3600)
time_spent = gazu.task.add_time_spent(task_dict, person_dict, "2018-03-18", 3600)

```

### Tracking Task Progress and Completion

Progress can be inferred from task status, time spents, or both.

```python
completed_tasks = [
    task
    for task in gazu.task.all_tasks()
    if task["task_status"]["short_name"] == "done"
]

```

## Reading Schedules from Kitsu Data

### Setting Start and Due Dates on Tasks

Developers can define or adjust task schedules to reflect production planning changes.

```python
task = gazu.task.get_task(task_id)
task["start_date"] = "2024-03-01"
task["due_date"] = "2024-03-15"
gazu.task.update_task(task)

```

### Managing Task Estimates

Task estimates can be used to calculate workload, predict delivery dates, and compare planned vs. actual effort.

```python
task = gazu.task.get_task(task_id)
task["estimation"] = 5 * 8 * 3600  # 5 days in seconds
gazu.task.update_task(task)

time_spent = gazu.task.get_time_spent(task, "2024-03-18")

```

### Updating Task Priorities

Priorities help surface critical work in projects and can be adjusted dynamically as schedules shift.

```bash
curl -X POST "http://api.example.com/data/task-type-links" \
  -H "Authorization: Bearer YOUR_API_TOKEN" \
  -H "Accept: application/json" \
  -H "Content-Type: application/json" \
  -d '{
    "project_id": "a24a6ea4-ce75-4665-a070-57453082c25",
    "task_type_id": "b24a6ea4-ce75-4665-a070-57453082c25",
    "priority": 1
  }'
```

### Reading Production Timelines

Developers can aggregate task dates across assets, shots, sequences, or episodes to build timelines or Gantt charts.

```python
tasks = gazu.task.all_tasks_for_shot(shot_id)

timeline = [
    {
        "task": task["name"],
        "start": task["start_date"],
        "end": task["due_date"]
    }
    for task in tasks
]

```

### Detecting Schedule Risks Programmatically

Schedule risks can be detected by comparing due dates, estimates, and time spent.

```python
from datetime import datetime

tasks = gazu.task.all_tasks_for_project(project)

at_risk = []
for task in tasks:
    if task["due_date"] and task["task_status"]["short_name"] != "done":
        due = datetime.fromisoformat(task["due_date"])
        if due < datetime.now():
            at_risk.append(task)
```

Tasks expose the following schedule-related fields:

| Field | Type | Description |
|---|---|---|
| `priority` | integer | Priority of task (default: 0) |
| `duration` | float | Duration of task |
| `estimation` | float | Estimated duration of task |
| `completion_rate` | integer | Completion rate of task |
| `retake_count` | integer | Retake count of task |
| `start_date` | date-time | Planned start date |
| `due_date` | date-time | Planned due date |
| `real_start_date` | date-time | Actual start date |
| `end_date` | date-time | Actual end date |
| `last_comment_date` | date-time | Date of last comment |
