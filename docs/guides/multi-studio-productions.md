### Multi client

Gazu acts a singleton. If you want several instances of the Kitsu client, 
you can create them and pass them as parameter when you need it:

```python
source_client = gazu.client.create_client("https://mysource.kitsu")
target_client = gazu.client.create_client("https://mytarget.kitsu")
gazu.client.log_in("user-source@mail.com", "default", client=source_client)
gazu.client.log_in("user-target@mail.com", "default", client=target_client)
gazu.client.get("/", client=source_client)
gazu.client.get("/", client=source_client)
gazu.project.all_open_projects(client=target_client)
gazu.project.all_open_projects(client=target_client)
```
