# Entity Tracking

Entity tracking covers tasks, changes, and progress for assets and shots as they move through the pipeline.

The API allows developers to read, edit, and automate production schedules using structured production data (episodes, sequences, shots, assets, tasks, and time spents).

## Automating Production Tracking

### Creating Task Types

Task types define the production steps (e.g. Animation, Lighting, Compositing).


::: code-group
```python [Python]
gazu.task.new_task_type()

```
```bash [cURL]

```
:::

### Creating Tasks for Assets and Shots

Tasks can be generated automatically when new assets or shots are created.

Create a new task for a given asset: 

::: code-group
```python [Python]
task = gazu.task.new_task(asset, task_type)
task = gazu.task.new_task(asset, task_type, task_status=wip)
task = gazu.task.new_task(asset, task_type, assignees=[person_dict])

```
```bash [cURL]

```
:::


### Finding tasks

Retrieve all tasks related to a given asset, shot, or sequence:

::: code-group
```python [Python]
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
```bash [cURL]

```
:::

Retrieve all task types or task types for shot or sequence:

::: code-group
```python [Python]
task_types = gazu.task.all_task_types()
task_types = gazu.task.all_task_types_for_shot(asset)
task_types = gazu.task.all_task_types_for_shot(shot)
task_types = gazu.task.all_task_types_for_scene(scene)
task_types = gazu.task.all_task_types_for_sequence(sequence)
```
```bash [cURL]

```
:::

Retrieve a given task:

::: code-group
```python [Python]
task = gazu.task.get_task_by_name(asset, task_type, "main")

```
```bash [cURL]

```
:::

Retrieve a given task type:

::: code-group
```python [Python]
task_type = gazu.task.get_task_type(task_status_id)
task_type = gazu.task.get_task_type_by_name(task_type_name)

```
```bash [cURL]

```
:::

Retrieve a given task status:

::: code-group
```python [Python]
task_status = gazu.task.get_task_status(task_status_id)
task_status = gazu.task.get_task_status_by_name(task_status_name)

```
```bash [cURL]

```
:::

### Assigning Tasks to Users or Teams

Tasks can be assigned to individuals or whole teams.

::: code-group
```python [Python]
gazu.task.assign_tasks_to_person()

```
```bash [cURL]

```
:::

### Updating Task Statuses

Task statuses reflect production progress and drive dashboards and reports.

::: code-group
```python [Python]
task = gazu.task.get_task(task_id)
gazu.task.update_task()

```
```bash [cURL]

```
:::

Set a given task status as work in progress:

::: code-group
```python [Python]
gazu.task.start_task(task_dict)

```
```bash [cURL]

```
:::

## Reading User Workloads

### Getting the Todo List of the Logged-In User

Developers can retrieve the current user’s assigned tasks to build dashboards or personal tools.

::: code-group
```python [Python]
tasks = gazu.user.all_tasks_to_do()

```
```bash [cURL]

```
:::

## Tracking Time Spents

Time spents record actual production effort and can be used for reporting and schedule validation.

### Reading Time Spent Entries

Each time spent includes a duration, date, related task, and the person who logged the time.

Add and get time spent:

::: code-group
```python [Python]
time_spent = gazu.task.get_time_spent(task_dict, "2018-03-18")
time_spent = gazu.task.set_time_spent(task_dict, person_dict, "2018-03-18", 8 * 3600)
time_spent = gazu.task.add_time_spent(task_dict, person_dict, "2018-03-18", 3600)

```
```bash [cURL]

```
:::

### Tracking Task Progress and Completion

Progress can be inferred from task status, time spents, or both.

::: code-group
```python [Python]
completed_tasks = [
    task
    for task in gazu.task.all_tasks()
    if task["task_status"]["short_name"] == "done"
]

```
```bash [cURL]

```
:::

## Reading Schedules from Kitsu Data

### Setting Start and Due Dates on Tasks

Developers can define or adjust task schedules to reflect production planning changes.

::: code-group
```python [Python]
task = gazu.task.get_task(task_id)
gazu.task.update_task(task)

```
```bash [cURL]

```
:::

### Managing Task Estimates

Task estimates can be used to calculate workload, predict delivery dates, and compare planned vs. actual effort.

::: code-group
```python [Python]
gazu.task.add_time_spent()
gazu.task.get_time_spent()

```
```bash [cURL]

```
:::

### Updating Task Priorities

Priorities help surface critical work in projects and can be adjusted dynamically as schedules shift.

::: code-group
```bash [cURL]
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
```python [Python]
```
:::

### Reading Production Timelines

Developers can aggregate task dates across assets, shots, sequences, or episodes to build timelines or Gantt charts.

::: code-group
```python [Python]
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
```bash [cURL]

```
:::

### Detecting Schedule Risks Programmatically

Schedule risks can be detected by comparing due dates, estimates, and time spent.

::: code-group
```python [Python]
Task {
  "type": "object",
  "properties": {
    "priority": {
      "type": "integer",
      "default": "0",
      "description": "Priority of task"
    },
    "duration": {
      "type": "float",
      "default": "0",
      "description": "Duration of task"
    },
    "estimation": {
      "type": "float",
      "default": "0",
      "description": "Estimation of duration of task"
    },
    "completion_rate": {
      "type": "integer",
      "default": "0",
      "description": "Completion rate of task"
    },
    "retake_count": {
      "type": "integer",
      "default": "0",
      "description": "Retake count of task"
    },
    "start_date": {
      "type": "string",
      "format": "date-time"
    },
    "due_date": {
      "type": "string",
      "format": "date-time"
    },
    "real_start_date": {
      "type": "string",
      "format": "date-time"
    },
    "end_date": {
      "type": "string",
      "format": "date-time"
    },
    "last_comment_date": {
      "type": "string",
      "format": "date-time"
    },
  }
}
```
```bash [cURL]

```
:::
