# Session Management

`KitsuClient` supports the context manager protocol for automatic cleanup.
When the `with` block exits, the client logs out and closes its HTTP session.

## Quick start

```python
import gazu

with gazu.create_session("https://kitsu.mystudio.com/api", "user@example.com", "password") as client:
    projects = gazu.project.all_open_projects(client=client)
    print(projects)
# automatic logout + session close
```

`gazu.create_session` creates a new client, logs in, and returns it. When the
block ends the session is cleaned up, even if an exception occurs.

## Manual client usage

You can also use an existing `KitsuClient` as a context manager:

```python
import gazu

client = gazu.client.create_client("https://kitsu.mystudio.com/api")
gazu.log_in("user@example.com", "password", client=client)

with client:
    assets = gazu.asset.all_assets(client=client)
# automatic logout + session close
```

## Multiple instances

Context managers work well when connecting to several Kitsu instances at once:

```python
import gazu

with gazu.create_session("https://studio-a.com/api", "user@a.com", "pass_a") as client_a:
    with gazu.create_session("https://studio-b.com/api", "user@b.com", "pass_b") as client_b:
        projects_a = gazu.project.all_open_projects(client=client_a)
        projects_b = gazu.project.all_open_projects(client=client_b)
```

## 2FA support

`create_session` forwards all authentication options:

```python
with gazu.create_session(
    "https://kitsu.mystudio.com/api",
    "user@example.com",
    "password",
    totp="123456",
) as client:
    projects = gazu.project.all_open_projects(client=client)
```
