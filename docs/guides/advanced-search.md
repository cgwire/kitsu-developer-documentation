# Advanced Search

work in progress

- Advanced Search
    - Raw request functions
    - get by path
    - filtering
    - full-text search

* Search filters
    * list\_type
    * entity\_type
    * name
    * search\_query
    * person\_id
    * project\_id

### Model functions

These functions assume you know what type of model you want to work on. Models
are listed in the available data section. Replace spaces by dashes and put
everything in lowercase (ex: Task type -> task-types). 

Retrieve all data for a given data type:

```python
gazu.client.fetch_all("projects")
gazu.client.fetch_all("tasks?page=2") # Paginate by using 100 entries per page.
```

Retrieve one entry for a given data type:

```python
gazu.client.fecth_one("projects", "project-id")
```

Get first entry of a given list:

```python
gazu.client.fecth_first("projects")
```

Create an entry for a given data type:

```python
gazu.client.create("projects", {"name": "Cosmos Landromat"})
```
