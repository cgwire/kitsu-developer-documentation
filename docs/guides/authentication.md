# Authentication

All API endpoints require a JSON Web Token for authentication.

You can either use regular email authentication to trade against a JSON Web Token or directly use a bot token.

## Email Authentication

Log in using a Kitsu user account:

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

## Bot Authentication

You can [create a bot token from your Kitsu dashboard](https://kitsu.cg-wire.com/bots/#how-to-create-a-bot) and use the returned API token directly:

```python
import gazu

gazu.set_token("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...")
```

## Use the token

Include the token in the `Authorization` header:

```bash
curl -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." https://zou-server-url/api/data/projects
```

## Get logged-in user info

To check the current user:

```python
gazu.client.get_current_user()
```

Multiple API routes return data related to the currently logged user (for which he has
assigned tasks linked to expected result):

Projects:

```python
projects = gazu.user.all_open_projects()
```

Assets and asset types:

```python
asset_types = gazu.user.all_asset_types_for_project(project_dict)
assets = gazu.user.all_assets_for_asset_type_project(
    project_dict,
    asset_type_dict
)
```

Sequences and shots:

```python
sequences = gazu.user.all_sequences_for_project(project_dict)
shots = gazu.user.all_shots_for_sequence(shot_dict)
scenes = gazu.user.all_scenes_for_sequence(shot_dict)
```

Tasks:

```python
tasks = gazu.user.all_tasks_for_shot(shot_dict)
tasks = gazu.user.all_tasks_for_asset(asset_dict)
task_types = gazu.user.all_task_types_for_asset(asset_dict)
task_types = gazu.user.all_task_types_for_shot(shot_dict)
```

## Logout

You can log out to delete session tokens from the server.

```python
gazu.client.log_out()
```

## Secret management

Secrets like passwords or JSON Web Tokens need to be protected at all times.

- Do not hardcode your secrets
- Never store JWTs. Even though JWTs have an expiration time, the vulnerability window is still non-negligeable.
- Use environment variables for emails and passwords

If your bot's token is compromised, regenerate a new token to automatically revoke the old one.

## Next Steps

Go to the next page to to learn about the other side of auth: authorization.
