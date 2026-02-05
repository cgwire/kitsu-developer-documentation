# Access Control & Authorization

## Default roles

The default roles are "user" and "admin".

## Create a new role

You can just define a new role when creating or editing persons:

```py
person = gazu.person.new_person(
    first_name="hello",
    last_name="world",
    email="test@cg-wire.com",
    phone="",
    role="NEW_ROLE"
)

person['role'] = 'NEW_NEW_ROLE'

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
