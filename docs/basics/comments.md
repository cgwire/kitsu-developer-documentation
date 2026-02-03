# Comments

work in progress...

* Comments
    * object\_id: Unique ID of the commented model instance
    * object\_type: Model type of the comment model instance
    * text
    * task\_status\_id: Task status attached to comment
    * person\_id: The person who publishes the comment
    * previews: previews atached to the comment
    * data: Free JSON field to add metadata
    * shotgun\_id: Used for synchronization with a Shotgun instance

## Post a comment/change task status

To change the task status, you have to post a new comment with the desired status.
Comments without text are allowed, too:

```python
modeling = gazu.task.get_task_type_by_name("modeling")
wip = gazu.task.get_task_status_by_short_name("wip")

project = gazu.project.get_project_by_name("Caminandes")
asset = gazu.asset.get_asset_by_name(project, "Lama")

task = gazu.task.get_task_by_entity(asset, modeling)
comment = gazu.task.add_comment(task, wip, "Change status to work in progress")
```
