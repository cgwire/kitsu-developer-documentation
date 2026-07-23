# Team Management

Team management covers users, departments, and roles across one or more projects.

## Overview

Team management in Kitsu revolves around three core data models:

* **Studios** – For multi-studio (or multi-site) productions.
* **Departments** – Organizational units that group users by role or function (e.g. Animation, Lighting, Production).
* **Users** – Individuals who collaborate on projects and tasks.

## Managing Multi-Studio Contributions

### Create a studio

::: code-group
```python [Python]
gazu.studio.new_studio("Paris", "#0000CC")
```
:::

## Creating and Managing Departments

### Create a new department

::: code-group
```python [Python]
gazu.person.new_department(name, color='', archived=False)
```
:::

### Retrieve existing departments

::: code-group
```python [Python]
gazu.person.all_departments()
```
:::

### Update department details as the production evolves

::: code-group
```python [Python]
gazu.person.update_department(department)
```
:::

### Remove or archive departments that are no longer in use

::: code-group
```python [Python]
gazu.person.remove_department(department, force=False)
```
:::

## Inviting and Managing Users

### Create a new user

::: code-group
```python [Python]
person = gazu.person.new_person(first_name, last_name, email, phone='', role='user', desktop_login='', departments=[], password=None, active=True, contract_type='open-ended')
```
:::

### Invite a user

::: code-group
```python [Python]
gazu.person.invite_person(person)
```
:::

###  Assign the user to one or more departments

::: code-group
```python [Python]
gazu.person.add_person_to_department(person, department)
```
:::

### Assign the user to a studio

::: code-group
```python [Python]
studio = gazu.studio.get_studio_by_name("Paris")
person["studio_id"] = studio["id"]
gazu.person.update_person(person)
```
:::

### Retrieve all persons listed in the database

::: code-group
```python [Python]
persons = gazu.person.all_persons()
```
:::

### Get a person by full name or login used on his desktop machine

::: code-group
```python [Python]
person = gazu.person.get_person_by_full_name("John Doe")
person = gazu.person.get_person_by_desktop_login("john.doe")
```
:::

## Managing Project Teams

### Get team for a project

Each member dict carries a `project_role` key: the role explicitly set for
this production, or `None` when the person's global role applies.

::: code-group
```python [Python]
team = gazu.project.get_team(project)
```
:::

### Add a person to the project team

The optional `role` argument gives the person a different role on this
production only (see [per-project roles](/guides/permissions-roles)).

::: code-group
```python [Python]
gazu.project.add_person_to_team(project, person)

gazu.project.add_person_to_team(project, person, role="supervisor")
```
:::

### Set the role of a team member

Pass `None` to restore inheritance of the person's global role.

::: code-group
```python [Python]
gazu.project.update_team_member_role(project, person, "manager")

gazu.project.update_team_member_role(project, person, None)
```
:::

### Remove a person from the project team

::: code-group
```python [Python]
gazu.project.remove_person_from_team(project, person)
```
:::

## Next Steps

* Learn about [task tracking](/guides/task-tracking)
* Learn about [publishing and reviews](/guides/publishing)

