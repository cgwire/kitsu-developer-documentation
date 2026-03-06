# Event Listeners

You can set up event listeners to react to production changes.

## Quickstart

It's possible to listen to events and trigger callbacks as they occur. 

Because listening to events blocks the current thread, we recommend that you
set it up in a different thread than the main one.

```python
gazu.set_host("https://kitsu.mystudio.com/api")
gazu.set_event_host("https://kitsu.mystudio.com")
gazu.log_in("email", "password")


def my_callback(data):
    print("Asset created %s" % data["asset_id"])

event_client = gazu.events.init()
gazu.events.add_listener(event_client, "asset:new", my_callback)
gazu.events.run_client(event_client)
```

## Available events

Each event name follows the pattern `entity:action`. Most entities emit three
generic CRUD events: `new`, `update`, and `delete`. The naming convention is:

```
model_name.lower().replace(' ', '-') + ':' + action
```

On top of these, some entities emit additional events for specific actions
(e.g. `task:assign`, `comment:reply`, `shot:casting-update`).

The callback data always includes the entity ID (e.g. `{"asset_id": "..."}`)
and, when relevant, a `project_id`.

### Asset

| Event | Data |
|---|---|
| `asset:new` | `asset_id` |
| `asset:update` | `asset_id` |
| `asset:delete` | `asset_id` |
| `asset:new-link` | `asset_id` |
| `asset:remove-link` | `asset_id` |
| `asset:casting-update` | `asset_id` |
| `asset-type:new` | `asset_type_id` |
| `asset-type:update` | `asset_type_id` |
| `asset-type:delete` | `asset_type_id` |
| `asset_instance:new` | `asset_instance_id` |
| `asset_instance:add-to-shot` | `asset_instance_id` |
| `asset_instance:remove-from-shot` | `asset_instance_id` |

### Shot and sequence

| Event | Data |
|---|---|
| `shot:new` | `shot_id` |
| `shot:update` | `shot_id` |
| `shot:delete` | `shot_id` |
| `shot:casting-update` | `shot_id` |
| `shot:add-to-scene` | `shot_id` |
| `shot:remove-from-scene` | `shot_id` |
| `sequence:new` | `sequence_id` |
| `sequence:delete` | `sequence_id` |
| `scene:new` | `scene_id` |
| `scene:delete` | `scene_id` |
| `episode:new` | `episode_id` |
| `episode:delete` | `episode_id` |
| `episode:casting-update` | `episode_id` |

### Task

| Event | Data |
|---|---|
| `task:new` | `task_id` |
| `task:update` | `task_id` |
| `task:delete` | `task_id` |
| `task:assign` | `task_id` |
| `task:unassign` | `task_id` |
| `task:status-changed` | `task_id` |
| `task:to-review` | `task_id` |
| `task:update-casting-stats` | `task_id` |
| `task-type:new` | `task_type_id` |
| `task-status:new` | `task_status_id` |
| `task-status:update` | `task_status_id` |

### Comment

| Event | Data |
|---|---|
| `comment:new` | `comment_id` |
| `comment:update` | `comment_id` |
| `comment:delete` | `comment_id` |
| `comment:reply` | `comment_id` |
| `comment:delete-reply` | `comment_id` |
| `comment:acknowledge` | `comment_id`, `person_id` |
| `comment:unacknowledge` | `comment_id`, `person_id` |

### Preview and file

| Event | Data |
|---|---|
| `preview-file:new` | `preview_file_id` |
| `preview-file:update` | `preview_file_id` |
| `preview-file:delete` | `preview_file_id` |
| `preview-file:add-file` | `preview_file_id` |
| `preview-file:set-main` | `preview_file_id` |
| `preview-file:annotation-update` | `preview_file_id` |
| `preview-background-file:add-file` | `preview_background_file_id` |
| `preview-background-file:update` | `preview_background_file_id` |
| `working-file:new` | `working_file_id` |
| `output-file:new` | `output_file_id` |
| `output-file:update` | `output_file_id` |
| `output-file:delete` | `output_file_id` |

### Person and organisation

| Event | Data |
|---|---|
| `person:new` | `person_id` |
| `person:update` | `person_id` |
| `person:delete` | `person_id` |
| `person:set-thumbnail` | `person_id` |
| `organisation:update` | `organisation_id` |
| `organisation:set-thumbnail` | `organisation_id` |
| `department:new` | `department_id` |

### Project

| Event | Data |
|---|---|
| `project:new` | `project_id` |
| `project:update` | `project_id` |
| `project:delete` | `project_id` |
| `project:set-thumbnail` | `project_id` |
| `metadata-descriptor:new` | `metadata_descriptor_id` |
| `metadata-descriptor:update` | `metadata_descriptor_id` |
| `metadata-descriptor:delete` | `metadata_descriptor_id` |

### Edit

| Event | Data |
|---|---|
| `edit:new` | `edit_id` |
| `edit:update` | `edit_id` |
| `edit:delete` | `edit_id` |

### Concept

| Event | Data |
|---|---|
| `concept:new` | `concept_id` |
| `concept:update` | `concept_id` |
| `concept:delete` | `concept_id` |

### Playlist

| Event | Data |
|---|---|
| `playlist:delete` | `playlist_id` |
| `playlist:add_entity` | `playlist_id` |

### Notification

| Event | Data |
|---|---|
| `notification:new` | `notification_id` |
| `notification:read` | `notification_id` |
| `notification:unread` | `notification_id` |
| `notification:all-read` | `person_id` |

### Chat

| Event | Data |
|---|---|
| `chat:new-message` | message data |
| `chat:deleted-message` | message data |
| `chat:joined` | chat data |
| `chat:left` | chat data |

### News

| Event | Data |
|---|---|
| `news:new` | `news_id` |
| `news:delete` | `news_id` |

### Budget

| Event | Data |
|---|---|
| `budget:create` | `budget_id` |
| `budget:update` | `budget_id` |
| `budget:delete` | `budget_id` |
| `budget-entry:create` | `budget_entry_id` |
| `budget-entry:update` | `budget_entry_id` |
| `budget-entry:delete` | `budget_entry_id` |

### Schedule

| Event | Data |
|---|---|
| `schedule-item:new` | `schedule_item_id` |
| `production_schedule_version:update` | `production_schedule_version_id` |

### Time spent

| Event | Data |
|---|---|
| `time-spent:new` | `time_spent_id` |
| `time-spent:update` | `time_spent_id` |
| `time-spent:delete` | `time_spent_id` |

### Entity link

| Event | Data |
|---|---|
| `entity-link:new` | link data |
| `entity-link:update` | link data |
| `entity-link:delete` | link data |

### Build job

| Event | Data |
|---|---|
| `build-job:new` | `build_job_id` |
| `build-job:update` | `build_job_id` |
| `build-job:delete` | `build_job_id` |

## Search Logs

You can access the latest events with raw functions: 

```py
events = gazu.client.get("data/events/last?page_size=100")
events = gazu.client.get("data/events/last?page_size=100&before=2019-02-01")
events = gazu.client.get("data/events/last?page_size=100&before=2019-02-01&after=2019-01-01")
events = gazu.client.get("data/events/last?page_size=100&only_files=true")
```

## Next Steps

* Learn about [bot automation](/guides/bot-automation)
* Learn about [custom actions](/guides/custom-actions)
