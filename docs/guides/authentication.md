# Authentication

All API endpoints require a JSON Web Token for authentication.

You can either use regular email authentication to trade against a JSON Web Token or directly use a bot token.

```mermaid
sequenceDiagram
    participant C as Client
    participant A as API
    participant D as Database
    participant R as Redis
    
    C->>A: POST /auth/login {email, password}
    A->>D: Find user by email
    D-->>A: User data
    A->>A: Verify password hash
    A->>A: Generate JWT tokens
    A->>R: Store session info
    A-->>C: Set-Cookie (access + refresh tokens)
    A-->>C: {user, access_token}
```

## User Authentication

Log in using a Kitsu user account via the email:

::: code-group
```py [Python]
gazu.set_host("https://zou-server-url/api")
gazu.log_in("user@yourdomain.com", "password")
```
```bash [cURL]
curl \
 --request POST 'https://zou-server-url/api/auth/login' \
 --header "Content-Type: application/json" \
 --data '{"email":"admin@example.com","password":"mysecretpassword"}'
```
:::

With this authentication scheme, the token is automatically set.

## Bot Authentication

You can [create a bot token from your Kitsu dashboard](https://kitsu.cg-wire.com/bots/#how-to-create-a-bot) and use the returned API token directly:

::: code-group
```python [Python]
gazu.set_token("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...")
```
```bash [cURL]
curl -H "Accept: application/json" -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."  "http://api.example.com/auth/authenticated"
```
:::

## Use the token

::: info
SDKs take care of this for you automatically.
:::

Include the token in the `Authorization` header:

```bash [cURL]
curl -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." https://zou-server-url/api/data/projects
```

## Get logged-in user info

To check the current user:

::: code-group
```python [Python]
gazu.client.get_current_user()
```
```bash [cURL]
curl "http://api.example.com/data/user/context" -H "Authorization: Bearer YOUR_API_TOKEN" -H "Accept: application/json"
```
:::

Multiple API routes return data scoped to the currently logged-in user:

Projects:

::: code-group
```python [Python]
projects = gazu.user.all_open_projects()
```
```bash [cURL]
curl "http://api.example.com/data/user/projects/open?name=My%20Project"  -H "Authorization: Bearer YOUR_API_TOKEN"  -H "Accept: application/json"
```
:::

Assets and asset types:

::: code-group
```python [Python]
asset_types = gazu.user.all_asset_types_for_project(project="a24a6ea4...")
assets = gazu.user.all_assets_for_asset_type_project(
    project="a24a6ea4...",
    asset_type="a24a6ea4..."
)
```
```bash [cURL]
curl "http://api.example.com/data/user/projects/a24a6ea4-ce75-4665-a070-57453082c25/asset-types" -H "Authorization: Bearer YOUR_API_TOKEN" -H "Accept: application/json"

curl "http://api.example.com/data/user/projects/a24a6ea4-ce75-4665-a070-57453082c25/asset-types/b35b7fb5-df86-5776-b181-68564193d36/assets" -H "Authorization: Bearer YOUR_API_TOKEN"  -H "Accept: application/json"
```
:::

Sequences and shots:

::: code-group
```python [Python]
sequences = gazu.user.all_sequences_for_project(project="a24a6ea4...")
shots = gazu.user.all_shots_for_sequence(sequence="a24a6ea4...")
scenes = gazu.user.all_scenes_for_sequence(sequence="a24a6ea4...")
```
```bash [cURL]
curl "http://api.example.com/data/user/projects/a24a6ea4-ce75-4665-a070-57453082c25/sequences" -H"Authorization: Bearer YOUR_API_TOKEN" -H "Accept: application/json"

curl "http://api.example.com/data/user/sequences/a24a6ea4-ce75-4665-a070-57453082c25/shots" -H "Authorization: Bearer YOUR_API_TOKEN" -H "Accept: application/json"

curl "http://api.example.com/data/user/sequences/a24a6ea4-ce75-4665-a070-57453082c25/scenes" -H "Authorization: Bearer YOUR_API_TOKEN" -H "Accept: application/json"
```
:::

Tasks:

::: code-group
```python [Python]
tasks = gazu.user.all_tasks_for_shot(shot="a24a6ea4...")
tasks = gazu.user.all_tasks_for_asset(asset="a24a6ea4...")
task_types = gazu.user.all_task_types_for_asset(asset="a24a6ea4...")
task_types = gazu.user.all_task_types_for_shot(shot="a24a6ea4...")
```
```bash [cURL]
curl "http://api.example.com/data/user/shots/a24a6ea4-ce75-4665-a070-57453082c25/tasks"  -H "Authorization: Bearer YOUR_API_TOKEN"  -H "Accept: application/json"

curl "http://api.example.com/data/user/assets/a24a6ea4-ce75-4665-a070-57453082c25/tasks"  -H "Authorization: Bearer YOUR_API_TOKEN"  -H "Accept: application/json"

curl "http://api.example.com/data/user/assets/a24a6ea4-ce75-4665-a070-57453082c25/task-types"  -H "Authorization: Bearer YOUR_API_TOKEN"  -H "Accept: application/json"

curl "http://api.example.com/data/user/shots/a24a6ea4-ce75-4665-a070-57453082c25/task-types"  -H "Authorization: Bearer YOUR_API_TOKEN"  -H "Accept: application/json"
```
:::

## Logout

You can log out to delete session tokens from the server.

::: code-group
```python [Python]
gazu.client.log_out()
```
```bash [cURL]
curl "http://api.example.com/auth/logout" -H "Authorization: Bearer YOUR_API_TOKEN"
```
:::

## Secret management

Secrets like passwords or JSON Web Tokens need to be protected at all times.

- Do not hardcode your secrets
- Never store JWTs. Even though JWTs have an expiration time, the vulnerability window is still non-negligeable.
- Use environment variables for emails and passwords

If your bot's token is compromised, regenerate a new token to automatically revoke the old one.

## Next Steps

Go to the next page to learn about the other side of auth: [authorization](./permissions-roles).
