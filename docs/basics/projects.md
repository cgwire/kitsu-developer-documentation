# Projects

work in progress...

* Projects
    * name
    * code
    * project\_status\_id
    * team: List of person working on the project
    * description
    * file\_tree: templates to use to build file paths
    * has\_avatar: True if project has an avatar
    * data: Free JSON field to add metadata
    * fps
    * ratio
    * resolution
    * production\_type: short, featurefilm or tvshow
    * shotgun\_id: Used for synchronization with a Shotgun instance

## Deal with Projects 

Retrieve all projects listed in the database:

```python
projects = gazu.project.all_projects()
```

Retrieve all open projects (open means still running on):

```python
projects = gazu.project.all_open_projects()
```

Retrieve the given project:

```python
project = gazu.project.get_project(project_id)
project = gazu.project.get_project_by_name("Agent 327")
```

Create a new project (with *open* status by default):

```python
project = gazu.project.new_project("Agent 327")
```
