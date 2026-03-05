# Async Client

Gazu provides an async HTTP module built on `aiohttp` for use in async
applications. Install it with the `async` extra:

```bash
pip install gazu[async]
```

## Why async?

The async client lets you run multiple API calls concurrently. This is
useful when you need to fetch or update many entities at once — instead of
waiting for each request to complete before starting the next, they all run
in parallel.

## Quick start

```python
import asyncio
import gazu.aio

async def main():
    async with gazu.aio.create_session(
        "https://kitsu.mystudio.com/api",
        "user@example.com",
        "password",
    ) as client:
        # Fetch projects, task types, and task statuses concurrently
        projects, task_types, task_statuses = await asyncio.gather(
            gazu.aio.fetch_all("projects/open", client=client),
            gazu.aio.fetch_all("task-types", client=client),
            gazu.aio.fetch_all("task-status", client=client),
        )
        print(f"{len(projects)} projects, {len(task_types)} task types")

asyncio.run(main())
```

## Making requests

The async module mirrors the sync client's HTTP helpers. Each call needs
to be `await`-ed:

```python
# GET
data = await gazu.aio.get("data/projects", client=client)

# POST
result = await gazu.aio.post("data/tasks/from-path", {
    "project_id": project["id"],
    "file_path": "/simple/SE01/S01/animation",
    "type": "shot",
}, client=client)

# PUT
await gazu.aio.put(f"data/tasks/{task_id}", {"priority": 1}, client=client)

# DELETE
await gazu.aio.delete(f"data/tasks/{task_id}", client=client)
```

Higher-level helpers are available too:

```python
# Fetch all entries for a model
assets = await gazu.aio.fetch_all("projects/{id}/assets", client=client)

# Fetch a single entry
asset = await gazu.aio.fetch_one("assets", asset_id, client=client)
```

## Running calls concurrently

The main benefit of async is running independent calls in parallel with
`asyncio.gather`:

### Fetching data for many entities at once

```python
async def get_all_shots_with_tasks(client):
    projects = await gazu.aio.fetch_all("projects/open", client=client)

    # Fetch all shots for every project concurrently
    shot_lists = await asyncio.gather(*[
        gazu.aio.fetch_all(
            f"projects/{project['id']}/shots", client=client
        )
        for project in projects
    ])

    all_shots = [shot for shots in shot_lists for shot in shots]

    # Fetch full task data for every shot concurrently
    task_lists = await asyncio.gather(*[
        gazu.aio.get(
            f"data/shots/{shot['id']}/tasks", client=client
        )
        for shot in all_shots
    ])

    for shot, tasks in zip(all_shots, task_lists):
        shot["tasks"] = tasks

    return all_shots
```

With the sync client this would be N+1 sequential HTTP calls. With async
they all run at the same time.

### Batch updates

Update many entities in parallel:

```python
async def set_all_shots_to_active(project, client):
    shots = await gazu.aio.fetch_all(
        f"projects/{project['id']}/shots", client=client
    )

    await asyncio.gather(*[
        gazu.aio.put(
            f"data/shots/{shot['id']}",
            {"status": "active"},
            client=client,
        )
        for shot in shots
    ])
```

### Concurrent file downloads

```python
async def download_all_previews(preview_files, client):
    await asyncio.gather(*[
        gazu.aio.download(
            f"movies/originals/preview-files/{pf['id']}.mp4",
            f"/tmp/{pf['id']}.mp4",
            client=client,
        )
        for pf in preview_files
    ])
```

## File uploads and downloads

Single file operations work the same way as the sync client:

```python
# Upload
await gazu.aio.upload(
    "pictures/thumbnails/projects/project-id",
    "/path/to/thumbnail.png",
    client=client,
)

# Download
await gazu.aio.download(
    "movies/originals/preview-files/preview-id.mp4",
    "/tmp/output.mp4",
    client=client,
)
```

## Authentication

Use `create_session` for automatic login and cleanup:

```python
async with gazu.aio.create_session(host, email, password) as client:
    # client is logged in and ready
    ...
# automatic logout + session close
```

Or manage the client manually:

```python
client = gazu.aio.AsyncKitsuClient("https://kitsu.mystudio.com/api")
tokens = await gazu.aio.log_in("user@example.com", "password", client=client)
# ... do work ...
await gazu.aio.log_out(client=client)
```

## Key differences from the sync client

- No global `default_client` — always pass `client=` explicitly
- Uses `aiohttp.ClientSession` instead of `requests.Session`
- Use `asyncio.gather` to run calls concurrently
- Use `async with` instead of `with` for context managers
