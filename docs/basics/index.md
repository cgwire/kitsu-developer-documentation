## Available data

### Model instances as dict

To make things simple and allow easy interoperability, all model instances are
returned as Python dicts. When you perform a query through the client you
retrieve either a list of dicts or a dict depending on the query.

### Date format


### Common fields

Each model instance provides at least the same three fields:

* id: a unique id made of letters, hyphens and numbers
* created\_at: the creation date
* updated\_at: the update date

They share another field that is dynamically generated:

* type: the model instance type

### Models

Here is the list of all available data tables (and related fields) you can
access through the Python client:
