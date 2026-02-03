# Developer Tools Overview

work in progress

### Raw request functions

Performs a GET request on given path of the API:

```python
gazu.client.get("data/projects")
```

Performs a POST request on given path of the API:

```python
gazu.client.post("data/projects", {"name": "My new Project"})
```

Performs a PUT request on given path of the API:

```python
gazu.client.put(
  "data/projects/<project-id>", 
  {"name": "My new Project updated"}
)
```

Performs a DELETE request on given path of the API:

```python
gazu.client.delete("data/projects/<project-id>")
```
