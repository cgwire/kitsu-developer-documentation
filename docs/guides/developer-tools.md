# Developer Tools Overview

Kitsu provides multiple ways to interact with internal features:

- **API** - All Postgres tables are accessible via REST HTTP APIs. [See specifications for an exhaustive list](https://api-docs.kitsu.cloud/). 
- **SDK** - [Python (gazu)](https://gazu.cg-wire.com/specs) and [Javascript](https://github.com/cgwire/kitsu-client-js)
- **CLI** - The [zou CLI](https://zou.cg-wire.com/development/) helps streamline common database operations to run a Kitsu instance.
- **Docker image** - [The Kitsu Docker container](/start-here/docker) makes it easy to test Kitsu features locally, including scripting.

## Raw queries

### Create entity

```python
gazu.client.post("data/projects", {"name": "My new Project"})
```

### Find and List entities

```python
gazu.client.get("data/projects")
```

### Update entity

```python
gazu.client.put(
  "data/projects/<project-id>", 
  {"name": "My new Project updated"}
)
```

### Delete entity

```python
gazu.client.delete("data/projects/<project-id>")
```
