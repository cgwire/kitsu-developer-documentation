# Pipeline Tracking

Pipeline tracking in Kitsu allows developers to programmatically read, drive, and automate production schedules using structured production data (episodes, sequences, shots, assets, tasks, and time spents).

## Reading Schedules from Kitsu Data

### Setting Start and Due Dates on Tasks

Developers can define or adjust task schedules to reflect production planning changes.

```python
task = gazu.task.get_task(task_id)
gazu.task.update_task(task)
```

### Managing Task Estimates

Task estimates can be used to calculate workload, predict delivery dates, and compare planned vs. actual effort.

```python
gazu.task.add_time_spent
gazu.task.get_time_spent
```

### Updating Task Priorities

Priorities help surface critical work and can be adjusted dynamically as schedules shift.

```python

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

Schedule risks can be detected by comparing due dates, estimates, and remaining work.

```python

```

## Automating Production Tracking

### Creating Task Types

Task types define the production steps (e.g. Animation, Lighting, Compositing).

```python
gazu.task.new_task_type()
```

### Creating Tasks for Assets and Shots

Tasks can be generated automatically when new assets or shots are created.

```python
gazu.task.create_asset_tasks()
```

### Assigning Tasks to Users or Teams

Tasks can be assigned to individuals or whole teams.

```python
gazu.task.assign_tasks_to_person()
```

### Updating Task Statuses

Task statuses reflect production progress and drive dashboards and reports.

```python
task = gazu.task.get_task(task_id)
gazu.task.update_task()
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

```python

```

## Navigating the Production Hierarchy

Pipeline tracking data is structured around production entities:

* Episodes
* Sequences
* Shots
* Assets
* Tasks
* Thumbnails

Developers can traverse this hierarchy to build tools, reports, or automation pipelines.

```python
episodes = gazu.project.all_episodes(project_id)

for episode in episodes:
    sequences = gazu.shot.all_sequences_for_episode(episode["id"])
```
