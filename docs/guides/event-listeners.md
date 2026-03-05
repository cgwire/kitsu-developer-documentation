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

### Generic events

For each model listed in the *Available data section*, there are three events 
available: `new`, `update` and `delete`. Each event follows this naming convention: 

```py
model_name.lower().replace(' ', '-') + ':' + action
```

Examples:

* person:new
* person:update
* person:delete
* notifications:new
* project:update
* metadata-descriptor:new
* metadata-descriptor:update
* metadata-descriptor:delete
* asset-type:new
* asset:new
* asset:update
* asset:delete
* asset:new-link
* asset:remove-link
* asset:delete
* casting:update
* asset_instance:new
* asset_instance:add-to-shot
* asset_instance:remove-from-shot
* shot:new
* shot:update
* shot:delete
* scene:new
* scene:delete
* sequence:new
* episode:new
* task:new
* task:update
* task:delete
* task_type:new
* task:unassign
* task:assign
* task:start
* task:to-review
* task_status:new
* task_status:update
* comment:new
* comment:delete
* preview:add
* preview-file:set-main
* working_file:new
* output_file:new
* preview_file:delete

All generic events provide an ID.

### Special events

Some actions generate special events:

* asset-instance:add-to-shot
* asset-instance:remove-from-shot
* organisation:set-thumbnail
* person:set-thumbnail
* project:set-thumbnail
* preview-file:add-file
* preview-file:set-main
* shot:casting-update
* task:unassign
* task:assign
* task:status-changed

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
