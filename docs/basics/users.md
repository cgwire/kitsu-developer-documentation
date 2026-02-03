* Persons
    * email: Serve as login
    * desktop\_login: Login used on the desktop
    * first\_name
    * last\_name 
    * phone
    * active: If the person is still in the studio or not
    * last\_presence: Last time the person worked for the studio
    * shotgun\_id: Used for synchronization with a Shotgun instance
    * timezone
    * locale
    * role
    * has\_avatar: True if user has an avatar
    * data: Free JSON field to add metadata

## Deal with Persons 

Retrieve all persons listed in the database:

```python
persons = gazu.person.all_persons()
```

Get a person by full name or login used on his desktop machine:

```python
person = gazu.person.get_person_by_full_name("John Doe")
person = gazu.person.get_person_by_desktop_login("john.doe")
```

## Deal with User

This route returns data related to the currently logged user (for which he has
assigned tasks linked to expected result):

Projects:

```python
projects = gazu.user.all_open_projects()
```

Assets and asset types:

```python
asset_types = gazu.user.all_asset_types_for_project(project_dict)
assets = gazu.user.all_assets_for_asset_type_project(
    project_dict,
    asset_type_dict
)
```

Sequences and shots:

```python
sequences = gazu.user.all_sequences_for_project(project_dict)
shots = gazu.user.all_shots_for_sequence(shot_dict)
scenes = gazu.user.all_scenes_for_sequence(shot_dict)
```

Tasks:

```python
tasks = gazu.user.all_tasks_for_shot(shot_dict)
tasks = gazu.user.all_tasks_for_asset(asset_dict)
task_types = gazu.user.all_task_types_for_asset(asset_dict)
task_types = gazu.user.all_task_types_for_shot(shot_dict)
```
