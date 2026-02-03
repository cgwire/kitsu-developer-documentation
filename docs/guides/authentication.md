## Authentication

Authenticate gazu with a Kitsu user via the following function call:

```python
gazu.log_in("user@mail.com", "userpassword")
```

## Bot Authentication

Authenticate gazu with a Bot token with the following function call:

```python
gazu.set_token("verylongtoken")
```

### Authentication

Make the client log in:

```python
gazu.client.log_in("user@mail.com", "default")
```

Make the client log out:

```python
gazu.client.log_out()
```

Get currently logged user:

```python
gazu.client.get_current_user()
```

## Authentication

Before you can use any of the endpoints outline below, you will have to get a JWT to authorize your requests.

You can get a authorization token using a (form-encoded) POST request to `/auth/login`. With
`curl` this would look something like `curl -X POST <server_address>/auth/login -d "email=<youremail>&password=<yourpassword>`.

The response is a JSON object, specifically you'll need to provide the `access_token` for your future requests. 
 
Here is a complete authentication process as an example (again using `curl`):

    $ curl -X POST <server_address>/api/auth/login -d "email=<youremail>&password=<yourpassword>
    {"login": true", "access_token": "eyJ0e...", ...}
    
    $ jwt=eyJ0e...  # Store the access token for easier use
    
    $ curl -H "Authorization: Bearer $jwt" <server_address>/api/data/projects
    [{...},
     {...}]
