# Projects

work in progress...

A project represents a production.

## Project object


* name * code * project\_status\_id * team: List of person working on the project * description * file\_tree: templates to use to build file paths * has\_avatar: True if project has an avatar * data: Free JSON field to add metadata * fps * ratio * resolution * production\_type: short, featurefilm or tvshow * shotgun\_id: Used for synchronization with a Shotgun instance

**ENDPOINTS**
```
GET /
POST /
PUT /
DELETE /
```

### Attributes

```json
{
  "name": "string",
  "code": "string",
  "project_status_id": "integer",
  "team": [
    {
      "id": "string",
      "name": "string",
      "role": "string"
    }
  ],
  "description": "string",
  "file_tree": {
    "templates": [
      "string"
    ]
  },
  "has_avatar": "boolean",
  "data": {},
  "fps": "number",
  "ratio": "string",
  "resolution": {
    "width": "integer",
    "height": "integer"
  },
  "production_type": "short | featurefilm | tvshow",
  "shotgun_id": "integer"
}
```

## Create a project

Create a new project (with *open* status by default):

```python
project = gazu.project.new_project("Agent 327")
```

## Update a project

## Retrieve a project

Retrieve the given project:

```python
project = gazu.project.get_project(project_id)
project = gazu.project.get_project_by_name("Agent 327")
```

## List projects

Retrieve all projects listed in the database:

```python
projects = gazu.project.all_projects()
```

Retrieve all open projects (open means still running on):

```python
projects = gazu.project.all_open_projects()
```

## Delete a project
