## Reporting

Reporting is about extracting structured data for schedules, progress reports, capacity planning, and analytics.

Kitsu’s API can be used to build custom reports, dashboards, and production metrics by querying events, tasks, estimates, and other production data. 

## Building Dashboards and Reports

Generate a Gantt chart for a shot:

::: code-group
```python [Python]
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

generateGanttChart(timeline)
```
```bash [cURL]

```
:::

## Exporting Data for External Tools

Exporting the user list to a CSV file:

::: code-group
```python [Python]
import csv

artists = gazu.person.all_persons()

with open("output.csv", "w", newline="") as f:
    writer = csv.DictWriter(f, fieldnames=["id", "email"])
    writer.writeheader()

    for artist in artists:
        writer.writerow({
            "id": artist.get("id"),
            "email": artist.get("email"),
        })
```
```bash [cURL]

```
:::
