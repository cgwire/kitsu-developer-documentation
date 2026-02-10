# Team Management

Team management covers users, departments, and roles across one or more projects.

## Overview

Team management in Kitsu revolves around three core data models:

* **Studios** – For multi-studio productions.
* **Departments** – Organizational units that group users by role or function (e.g. Animation, Lighting, Production).
* **Users** – Individuals who collaborate on projects and tasks.

## Managing Multi-Studio Contributions

### Create a studio

::: code-group
```bash [cURL]
curl -X POST "http://api.example.com/data/studios"  -H "Authorization: Bearer YOUR_API_TOKEN"  -H "Accept: application/json" -H "Content-Type: application/json" -d '{\"name\": \"Studio Name\",\"hours_by_day\": 8}'
```
```python [Python]

```
:::

## Creating and Managing Departments

### Create a new department

::: code-group
```python [Python]
gazu.person.new_department(name: str, color: str = '', archived: bool = False)
```
```bash [cURL]

```
:::

### Retrieve existing departments

::: code-group
```python [Python]
gazu.person.all_departments()
```
```bash [cURL]

```
:::

### Update department details as the production evolves

::: code-group
```python [Python]
gazu.person.update_department(department: dict)
```
```bash [cURL]

```
:::

### Remove or archive departments that are no longer in use

::: code-group
```python [Python]
gazu.person.remove_department(department, force=False)
```
```bash [cURL]

```
:::

## Inviting and Managing Users

### Create a new user

::: code-group
```python [Python]
person = gazu.person.new_person(first_name: str, last_name: str, email: str, phone: str = '', role: str = 'user', desktop_login: str = '', departments: list[str | dict] = [], password: str | None = None, active: bool = True, contract_type: str = 'open-ended')
```
```bash [cURL]

```
:::

### Invite a user

::: code-group
```python [Python]
gazu.person.invite_person(person: str | dict)
```
```bash [cURL]

```
:::

###  Assign the user to one or more departments

::: code-group
```python [Python]
gazu.person.add_person_to_department(person: str | dict, department: str | dict)
```
```bash [cURL]

```
:::

### Assign the user to a studio

::: code-group
```python [Python]
TODO
```
```bash [cURL]

```
:::

### Retrieve all persons listed in the database

::: code-group
```python [Python]
persons = gazu.person.all_persons()
```
```bash [cURL]

```
:::

### Get a person by full name or login used on his desktop machine

::: code-group
```python [Python]
person = gazu.person.get_person_by_full_name("John Doe")
person = gazu.person.get_person_by_desktop_login("john.doe")
```
```bash [cURL]

```
:::

### Deactivate or remove users when they leave the project

::: code-group
```python [Python]
gazu.person.remove_person(person: str, department: str, force: bool)
```
```bash [cURL]

```
:::
