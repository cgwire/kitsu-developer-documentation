# Advanced Search

## Raw functions

Data models you can query are listed in [the OpenAPI specifications](https://api-docs.kitsu.cloud/).

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
gazu.client.fetch_first("projects")
```

Create an entry for a given data type:

```python
gazu.client.create("projects", {"name": "Cosmos Landromat"})
```

## Search by path

You can retrieve resources using corresponding API paths:

```python
gazu.client.get("data/projects")
```

## Pagination & Filtering

Some API endpoints provide pagination and filter support out-of-the-box:

```py
events = gazu.client.get("data/events/last?page_size=100")
events = gazu.client.get("data/events/last?page_size=100&before=2019-02-01")
events = gazu.client.get("data/events/last?page_size=100&before=2019-02-01&after=2019-01-01")
events = gazu.client.get("data/events/last?page_size=100&only_files=true")
```

## Full-text search

You can use the `search` endpoint to perform full-text searches across indexed tables. By default, persons, assets and shots.

```bash
curl \
 --request POST 'http://api.example.com/data/search' \
 --header "Authorization: $API_KEY" \
 --header "Content-Type: application/json" \
 --data '{"query":"kitsu","project_id":"a24a6ea4-ce75-4665-a070-57453082c25","limit":3,"offset":0,"index_names":["assets"]}'
 ```

## Querying and Filtering Large Datasets

TODO
