# Review Engine

The Review Engine enables teams to manage review playlists, track versions, and facilitate feedback through previews and comments. 

## Core Concepts

Playlists group versions together for review sessions.

Preview versions represent iterations of work submitted for review.

Comments are used to leave feedback and communicate task changes.

## Integrating Review and Feedback Loops

### Creating Comments on Tasks and Shots

Notes can be attached to different entity types to provide targeted feedback.

```py
```

### Attaching Files To Comments

Files can be added to comments to create previews and attachments.

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

### Linking Comments to Statuses or Versions

Comments can result in a version change or task status update.

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

### Fetching Discussion History

Retrieve all comments associated with an entity to display review history.

```py

```

## Managing Playlists

### Adding assets and shots to playlists

```py

```
