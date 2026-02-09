# Access Control & Authorization

## Default roles

- `user`, **Artist** - Artists can only access the productions they are part of. They can comment on tasks, upload media, and change statuses only on tasks that have been assigned to them. Their access is limited to a predefined set of statuses as determined by the Studio Manager.

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

- `supervisor`, **Supervisor** - Department supervisors inherit Artist permissions. Department supervisors have read and write access to their department(s) they work on: assets, shots, tasks, assignments, statistics, breakdown, and playlists.

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

- `manager`, **Production Manager** - Production managers inherit Department supervisor permissions. Production managers have read and write access to the productions they are assigned to, including assets, shots, tasks, assignments, statistics, breakdowns, and playlists.

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

- `admin`, **Studio Manager** - A Studio Manager acts in the same way as an Administrator, having read and write access to all productions and settings within Kitsu.

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

- `vendor`, **Vendor** - Vendors have similar permissions to artists, except they can only see and edit tasks they are specifically assigned to.

- `client`, **Client** - Clients can only see the productions they are part of.

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

## Create a new role

It's currently not possible to define a new role when creating or editing persons.

You can only assign one of `user`, `admin`, `manager`, `supervisor`, `vendor`, or `client`.

```py
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

## Check a person's role

```py
person = gazu.person.get_person(id=user['user']['id'], relations=True)

role = person['role']

if role == "admin":
    ...
```

## Check a user belongs to a studio

One person can only belong to a single studio.

```py
person = gazu.person.get_person(id=user['user']['id'], relations=True)

studio = person['studio_id'] 

if STUDIO_ID == studio:
    ...
```

## Check a person belongs to a department

One person can belong to many departments.

```py
person = gazu.person.get_person(id=user['user']['id'], relations=True)

departments = person['departments'] 

if DEPARTMENT_ID in departments:
    ...
```
