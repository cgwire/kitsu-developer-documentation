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

## Loading a whole list in one call

With gazu, one call is enough. It sends as many requests as the list needs,
1000 entries each, and returns the whole list once the last one is in:

```python
tasks = gazu.task.all_tasks_for_project(project)
tasks = gazu.client.fetch_all("tasks", {"project_id": project["id"]})
```

There is nothing to set up: `fetch_all` and the gazu functions that return a
list read it by cursor, the mode described below. Pass `limit` to `fetch_all`
to change the size of the requests, or `by_cursor=False` to get the list in a
single request. A request that already holds a page, a limit or a cursor is
sent as it is.

## By page

Send `page` (the first page is 1) and optionally `limit`, the number of
entries per page. The default is the `NB_RECORDS_PER_PAGE` setting of the
server, 100 entries unless your instance changed it.

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

gazu runs this loop for you, as shown
[above](#loading-a-whole-list-in-one-call). The same loop written by hand:

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
* `cursor_id` alone, without `limit`, returns the default number of entries.
* A `cursor_id` that is not a valid id, or that matches no entry, is refused
  with a 400 error. It happens when the entry used as cursor is deleted before
  the next request. gazu then reads the list again in a single request. In
  your own loop, start the walk again.

The async client does the same:

```python
tasks = await gazu.aio.fetch_all("tasks", client=client)
```

## What it changes for your gazu scripts

The gazu functions that return a list, such as
`gazu.task.all_tasks_for_project` or `gazu.asset.all_assets_for_project`, go
through `fetch_all`. Your scripts do not need to change:

* The lists that came sorted, by name or last modified first, still do.
* The lists read from the model routes without a sort of their own, such as
  `gazu.entity.all_entities` or `gazu.task.all_tasks_for_task_type`, come
  newest created first.
* On a route without cursor, or against a Kitsu API that does not know the
  cursor yet, gazu gets the whole list in one request, as before.

## Routes that support it

Both modes work on:

* The model list routes: `data/tasks`, `data/comments`, `data/persons`,
  `data/preview-files` and the others listed in
  [the OpenAPI specifications](https://api-docs.kitsu.cloud/).
* The lists of a production: `data/projects/<project_id>/` followed by
  `tasks`, `comments`, `notifications`, `preview-files`, `time-spents`,
  `assets`, `shots`, `sequences`, `episodes`, `scenes`, `edits` or `concepts`.
* The entity lists: `data/assets`, `data/shots`, `data/sequences`,
  `data/episodes`, `data/edits`, `data/concepts`, and `data/assets/all`,
  `data/shots/all`, `data/scenes/all`, `data/edits/all`.
* The assets of a type,
  `data/projects/<project_id>/asset-types/<asset_type_id>/assets`, and the
  shared assets used by a production,
  `data/projects/<project_id>/assets/shared-used`.

The other routes have their own paging, or none.

## Next Steps

* Learn about [advanced search](/guides/search)
* Learn about [caching](/guides/caching)
* Learn about [the async client](/guides/async)
