# Developer Quickstart

## 1. Kitsu API Server Installation

There are three options to install a Kitsu API server:

1. [Cloud hosting](/start-here/cloud-hosting) - if you want to let the CGWire team handle server and app management for you.
1. [Self-hosting](/self-hosting/vs-cloud-hosting) - if you have a sysops team to manage your servers.
1. [Docker](/start-here/docker) - to set up a local dev environment for testing.

## 2. Setting up the API client

If you're using a SDK, install it first:

```bash
pip install gazu
```

Then, create an API client to start sending requests:

::: code-group
```curl
curl \
 --request POST 'https://zou-server-url/api/auth/login' \
 --header "Content-Type: application/json" \
 --data '{"email":"admin@example.com","password":"mysecretpassword","totp":123456,"email_otp":123456,"fido_authentication_response":{},"recovery_code":"ABCD-EFGH-IJKL-MNOP"}'
```
```py
import gazu

gazu.set_host("https://zou-server-url/api")
gazu.log_in("user@yourdomain.com", "password")
```
:::

## Instancing Multiple Clients

You can instantiate multiple API clients to simulate multiple users or connect to different Kitsu servers.

For example, you might want to quickly switch between users to perform specific actions and keep the event history consistent. Or you could migrate data from one instance to another:

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

## Next Steps

* Learn about [alternative authentication strategies](/guides/authentication)
* Learn to [setup a new production](/guides/production-management)
