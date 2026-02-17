# Permissions and roles (Authorization)

## Available roles

Only a given subset of roles is available in Kitsu. Each of them has a fixed
naming in the database but may be displayed in different ways in the Kitsu UI.
You will find below the list of all the roles you can set on Kitsu users.

`user`, **Artist** - Artists can only access the productions they are part of. They can comment on tasks, upload media, and change statuses only on tasks that have been assigned to them. Their access is limited to a predefined set of statuses as determined by the Studio Manager.

::: details Artist Permissions
**They can:**
* Create personal filters on the global page and Task Type page.
* Edit their own comments.
* Check the checklist on their assigned tasks.
* Create playlists-on-the-fly for shots or assets, but won't be able to save these playlists.

**They cannot:**
* See client comments.
* Access anything inside of projects that they haven't been assigned to.
:::
___

`supervisor`, **Supervisor** - Department supervisors inherit Artist permissions. Department supervisors have read and write access to their department(s) they work on: assets, shots, tasks, assignments, statistics, breakdown, and playlists.

::: details Supervisor Permissions
**They can:**
* Assign tasks to their team artists (same department).
* Post comments on all tasks or their department(s).
* Check a checklist in their own department.
* Pin a comment.
* Edit their own comments.
* Add/edit a playlist for the studio or the client.
* See client comments and validations.
* See comments from other departments.
* View the timesheets of their team department(s).

**They cannot:**
* Access the studio team, the main timesheets, and the production list
* Define task types, task statuses, and asset types.
* Comment on other departments than theirs; they can't assign artists from other departments.
:::

___

`manager`, **Production Manager** - Production managers inherit Department supervisor permissions. Production managers have read and write access to the productions they are assigned to, including assets, shots, tasks, assignments, statistics, breakdowns, and playlists.

::: details Production Manager Permissions
**They can:**

* Create assets and shots, either manually or through a CSV batch import.
* Post comments on any tasks within the production.
* Edit any comment within the production.
* Check any checklist within the production.
* Pin any comment within the production.
* Add a task column.
* Delete or add a task.
* Add/edit a playlist for the studio or the client.
* See client comments and validations.

**They cannot:**

* Access the studio page, the main timesheets, and the production list.
* Define task types, task statuses, and asset types.
:::

___

`admin`, **Studio Manager** - A Studio Manager acts in the same way as an Administrator, having read and write access to all productions and settings within Kitsu.

::: details Studio Manager / Administrator Permissions

**They can:**

- Create and edit a production
- Manage the studio
- Define the permission role of each user.
* Customize global aspects of Kitsu like adding and modifying task types, task statuses, and asset types.
* Set permission roles
* Customize high-level studio information like customizing the studio name adding the company logo, and defining the number of hours per day of work etc.
* Choose to use the original filename for downloading media.
* They have full access to all productions on your Kitsu site.
* They have the same permissions as the supervisor.
* They can add / delete a task column.
* They are allowed to create custom metadata columns.
:::

___

`vendor`, **Vendor** - Vendors have similar permissions to artists, except they can only see and edit tasks they are specifically assigned to.

___

`client`, **Client** - Clients can only see the productions they are part of.


::: details Clients Permissions
**They can:**

* Access the global page of the assets/shots.
* Access the stats pages.
* Access Client playlists with limited access to task status when they post a comment

**Note**
* Only Supervisors and the Studio Manager can see the Client retake or validation status.


**They cannot:**

* See task assignments
* See comments that they didn't write
:::

## Change a role

It's currently not possible to define a new role when creating or editing persons.

You can only assign one of `user`, `admin`, `manager`, `supervisor`, `vendor`, or `client`.

::: code-group
```python [Python]
person = gazu.person.new_person(
    first_name="hello",
    last_name="world",
    email="test@cg-wire.com",
    phone="",
    role="user"
)

person['role'] = 'manager'

gazu.person.update_person(person)
```
```bash [cURL]
curl -X POST "http://api.example.com/data/persons" \
  -H "Authorization: Bearer YOUR_API_TOKEN" \
  -H "Accept: application/json" \
  -H "Content-Type: application/json" \
  -d '{
    "first_name": "John",
    "last_name": "Doe",
    "email": "john.doe@example.com",
    "password": "securepassword123",
    "role": "user",
    "active": true,
    "contract_type": "permanent",
    "two_factor_authentication": "none",
    "expiration_date": "2025-12-31",
    "is_bot": false
  }'

curl -X PUT "http://api.example.com/data/persons/a24a6ea4-ce75-4665-a070-57453082c25" \
  -H "Authorization: Bearer YOUR_API_TOKEN" \
  -H "Accept: application/json" \
  -H "Content-Type: application/json" \
  -d '{
    "first_name": "Jane",
    "last_name": "Smith",
    "email": "jane.smith@example.com",
    "password": "newsecurepassword123",
    "role": "manager",
    "active": true,
    "contract_type": "freelance",
    "two_factor_authentication": "totp",
    "expiration_date": "2025-12-31"
  }'
```
:::

## Check a person's role

::: code-group
```python [Python]
person = gazu.person.get_person(id=user['user']['id'], relations=True)

role = person['role']

if role == "admin":
    ...
```
```bash [cURL]
curl "http://api.example.com/data/persons/a24a6ea4-ce75-4665-a070-57453082c25?relations=true" \
  -H "Authorization: Bearer YOUR_API_TOKEN"
```
:::

## Check a user belongs to a studio

One person can only belong to a single studio.

::: code-group
```python [Python]
person = gazu.person.get_person(id=user['user']['id'], relations=True)

studio = gazu.studio.get_studio_by_name('Sydney')

if studio['id'] == person['studio_id']:
    ...
```
:::

## Check a person belongs to a department

One person can belong to many departments.

::: code-group
```python [Python]
person = gazu.person.get_person(id=user['user']['id'], relations=True)

department = gazu.person.get_department_by_name('Animation')
departments = person['departments']

if department['id'] in departments:
    ...
```
:::
