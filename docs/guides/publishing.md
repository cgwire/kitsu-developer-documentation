# Review Engine

Kitsu's review engine connects published work, previews, and statuses for reviews and approvals.

The API enables teams to manage review playlists, track versions, and facilitate feedback through previews and comments. 

## Core Concepts

- **Playlists** group versions together for review sessions.
- **Preview versions** represent iterations of work submitted for review.
- **Comments** are used to leave feedback and communicate task changes.

## Integrating Review and Feedback Loops

### Creating Comments on Tasks

Notes can be attached to tasks to provide targeted feedback.

::: code-group
```python [Python]
gazu.task.add_comment(task: str | dict, task_status: str | dict, comment: str = '', person: str | dict | None = None, checklist: list[dict] = [], attachments: list[str] = [], created_at: str | None = None, links: list[str] = [])
```
```bash [cURL]

```
:::

### Attaching Files To Comments

Files can be added to comments to create previews and attachments.

We assume you have already retrieved the related task and comment. To add a
preview, you need to specify what you want to upload as a new preview:

::: code-group
```python [Python]
preview_file = gazu.task.add_preview(
    task,
    comment,
    "/path/to/my/file.mp4"
)
gazu.task.set_main_preview(preview_file) #  Set preview as asset thumbnail

```
```bash [cURL]

```
:::

Another alternative is to use the `publish` shortcut to post a comment and link a preview file to it:

::: code-group
```python [Python]
(comment, preview_file) = gazu.task.publish_preview(
    task,
    wip,
    comment="Change status to work in progress",
    preview_file_path="/path/to/my/file.mp4"
)

```
```bash [cURL]

```
:::

### Linking Comments to Statuses or Versions

Comments can result in a version change or task status update.

To change the task status, you have to post a new comment with the desired status.
Comments without text are allowed, too:

::: code-group
```python [Python]
modeling = gazu.task.get_task_type_by_name("modeling")
wip = gazu.task.get_task_status_by_short_name("wip")

project = gazu.project.get_project_by_name("Caminandes")
asset = gazu.asset.get_asset_by_name(project, "Lama")

task = gazu.task.get_task_by_entity(asset, modeling)
comment = gazu.task.add_comment(task, wip, "Change status to work in progress")

```
```bash [cURL]

```
:::

### Fetching Version / Discussion History

Retrieve all comments associated with an entity to display review history.

::: code-group
```python [Python]
gazu.task.all_comments_for_project(project: str | dict)

gazu.task.all_comments_for_task(task: str | dict)
```
```bash [cURL]
```
:::

## Managing Playlists

### Adding assets and shots to playlists

::: code-group
```python [Python]
gazu.playlist.add_entity_to_playlist(playlist: dict, entity: str | dict, preview_file: str | dict | None = None, persist: bool = True)
```
```bash [cURL]

```
:::
