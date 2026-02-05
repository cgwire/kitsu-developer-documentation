# Team Management

This section describes common team management workflows that can be automated or integrated using the Kitsu API.

## Overview

Team management in Kitsu revolves around three core concepts:

* **Studios** – For multi-studio productions.
* **Departments** – Organizational units that group users by role or function (e.g. Animation, Lighting, Production).
* **Users** – Individuals who collaborate on projects and tasks.

The API allows developers to programmatically create and maintain these relationships to match their studio’s structure and production needs.

## Managing Multi-Studio Contributions

Create a studio:

```py

```

## Creating and Managing Departments

Create a new department

```py
```

Retrieve existing departments

```py
```

Update department details as the production evolves

```py
```

Remove or archive departments that are no longer in use

```py
```

## Inviting and Managing Users

**Typical API use cases**

* Bulk-inviting artists at the start of a project
* Integrating Kitsu with an external identity or HR system
* Managing freelancers or temporary contributors

Create a new user:

Invite a user using their email address:

```py
```

Assign the user to one or more departments:

```py
```

Assign the user to a studio:

```py
```

Deactivate or remove users when they leave the project:

```py
```
