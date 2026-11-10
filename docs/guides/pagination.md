# Pagination

A long production holds hundreds of thousands of tasks, comments and preview
files. Asking for all of them in a single request makes the server build one
huge response, which slows it down for everyone. The large lists can be read
in smaller requests instead, in two ways:

| Mode | Parameters | Response | Use it for |
|------|------------|----------|------------|
| By page | `page`, `limit` | An envelope with the entries and the totals | A paged table, a "page 3 of 12" display |
| By cursor | `limit`, `cursor_id` | A plain list, newest created first | Loading a whole list for a local process: export, sync, report |

Without any of these parameters, a route returns its whole list, as it always
did.

## By page

Send `page` (the first page is 1) and optionally `limit`, the number of
entries per page. The default is 100 entries.

::: code-group
```python [Python]
page = gazu.client.get(
    f"data/projects/{project['id']}/tasks",
    params={"page": 2, "limit": 50},
)
tasks = page["data"]
```
```bash [cURL]
curl "http://api.example.com/data/projects/$PROJECT_ID/tasks?page=2&limit=50" \
 --header "Authorization: Bearer $API_KEY"
```
:::

The response wraps the entries with what a pager needs:

```python
{
    "data": [...],    # The entries of the page
    "total": 1240,    # Number of entries in the whole list
    "nb_pages": 25,
    "limit": 50,
    "offset": 50,     # Position of the first entry of the page
    "page": 2,
}
```

To gather every page in one call:

```python
tasks = gazu.client.fetch_all("tasks", paginated=True, limit=500)
```

::: warning
Pages are positions in the list. When entries are created or deleted while you
read the pages one after the other, the positions shift: an entry can be
skipped or come twice. To load a whole list, read it by cursor.
:::

## By cursor

Send `limit` without `page`. The response is a plain list of at most `limit`
entries, from the newest created to the oldest. For the next request, send the
id of the last entry you received as `cursor_id`: the list resumes right after
it. A response shorter than `limit` is the last one.

Entries created or deleted during the walk do not shift anything, and the
server never counts the whole list.

gazu runs the loop for you:

```python
tasks = gazu.client.fetch_all(
    "tasks", {"project_id": project["id"]}, by_cursor=True
)
```

It asks for 1000 entries per request. Pass `limit` to change it.

The same loop written by hand:

::: code-group
```python [Python]
path = f"data/projects/{project['id']}/tasks"
params = {"limit": 500}
tasks = []
while True:
    entries = gazu.client.get(path, params=params)
    tasks.extend(entries)
    if len(entries) < 500:
        break
    params["cursor_id"] = entries[-1]["id"]
```
```bash [cURL]
# First request
curl "http://api.example.com/data/projects/$PROJECT_ID/tasks?limit=500" \
 --header "Authorization: Bearer $API_KEY"

# Next requests: cursor_id is the id of the last entry received
curl "http://api.example.com/data/projects/$PROJECT_ID/tasks?limit=500&cursor_id=$LAST_ID" \
 --header "Authorization: Bearer $API_KEY"
```
:::

Things to know:

* Repeat the same filters on every request of a walk.
* The entries come newest created first, which is not always the usual order
  of the route: several lists come last modified first. Sort them locally once
  the list is complete.
* `limit` alone is a quick way to get the latest entries created.
* `cursor_id` alone, without `limit`, returns 100 entries.
* A `cursor_id` that is not a valid id, or that matches no entry, is refused
  with a 400 error. It happens when the entry used as cursor is deleted before
  the next request: start the walk again.

The async client takes the same argument:

```python
tasks = await gazu.aio.fetch_all("tasks", by_cursor=True, client=client)
```

## gazu functions that load by cursor

These functions already read their list by cursor. Your scripts do not need to
change. The lists that came sorted by name or newest first still do.
`all_tasks_for_task_status`, `all_tasks_for_task_type` and `all_entities`
return their entries newest created first:

* `gazu.asset.all_assets_for_project`
* `gazu.asset.all_assets_for_episode`
* `gazu.shot.all_shots_for_project`
* `gazu.task.all_tasks_for_project`
* `gazu.task.all_tasks_for_task_status`
* `gazu.task.all_tasks_for_task_type`
* `gazu.task.all_comments_for_project`
* `gazu.task.all_notifications_for_project`
* `gazu.task.all_preview_files_for_project`
* `gazu.entity.all_entities`

Against a Kitsu API that does not know the cursor yet, they get the whole list
in one request, as before.

## Routes that support it

Both modes work on:

* The model list routes: `data/tasks`, `data/comments`, `data/persons`,
  `data/preview-files` and the others listed in
  [the OpenAPI specifications](https://api-docs.kitsu.cloud/).
* The lists of a production: `data/projects/<project_id>/` followed by
  `tasks`, `comments`, `notifications`, `preview-files`, `time-spents`,
  `shots` or `assets`.
* The asset lists: `data/assets` and `data/assets/all`.

The other routes ignore these parameters and return their whole list.

## Next Steps

* Learn about [advanced search](/guides/search)
* Learn about [caching](/guides/caching)
* Learn about [the async client](/guides/async)
