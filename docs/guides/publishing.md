# Review Engine

Kitsu's review engine connects published work, previews, and statuses for reviews and approvals.

The API enables teams to manage review playlists, track versions, and facilitate feedback through previews and comments.

## Core Concepts

- **Comments** are used to leave feedback and communicate task changes.
- **Preview versions** represent iterations of work submitted for review.
- **Playlists** group versions together for review sessions.

## Integrating Review and Feedback Loops

### Creating Comments on Tasks

Notes can be attached to tasks to provide targeted feedback.

```python
gazu.task.add_comment(
    task,
    task_status,
    comment='',
    person=None,
    checklist=[],
    attachments=[],
    created_at=None,
    links=[]
)
```

Attachments can be set at this stage by adding file paths as a list in the
`attachments` argument.


### Setting revisions linked to comments (publishing)

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

It creates a new preview entry that is linked to the comment posted (therefore
to the related task and entity).

Another alternative is to use the `publish` shortcut to post a comment and link a preview file to it:

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

### Fetching Version / Discussion History

Retrieve all comments associated with an entity to display review history.

```python
gazu.task.all_comments_for_project(project)

gazu.task.all_comments_for_task(task)
```


### Download a preview

```python
gazu.files.download_preview_file(preview_file, "./target.mp4")

gazu.files.download_preview_file_thumbnail(preview_file, "./target.png")
```


## Managing Playlists

### Creating a playlist

Create a new playlist for organizing previews and versions for review:

```python
project = gazu.project.get_project_by_name("Caminandes")

playlist = gazu.playlist.new_playlist(
    project,
    name="Daily Review - Animation",
    for_client=False,
    for_entity="shot"
)
```

### Adding assets and shots to playlists

```python
gazu.playlist.add_entity_to_playlist(
    playlist,
    entity,
    preview_file=None,
    persist=True
)
```
