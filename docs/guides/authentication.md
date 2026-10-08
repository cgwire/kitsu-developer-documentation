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

## Browser login

Desktop apps, DCC plugins and scripts can log the user in through the Kitsu web page instead of asking for a password. Every login method Kitsu supports works this way (password, 2FA, SAML, OIDC), with no method-specific code in your integration. Use it whenever your users log in with SSO or 2FA.

```python
gazu.set_host("https://zou-server-url/api")
tokens = gazu.log_in_with_browser(app_name="My Tool", timeout=300)
```

gazu opens the browser on the Kitsu `/app-login` page. The user logs in if needed, then clicks **Authorize** on a consent page showing `app_name`. gazu receives a one-time code on a local port, trades it for a token pair, sets the tokens on the client and returns the same dict as `gazu.log_in()`.

```mermaid
sequenceDiagram
    participant G as gazu (script)
    participant B as Browser / Kitsu
    participant A as API

    G->>G: Listen on 127.0.0.1:PORT
    G->>B: Open /app-login?port&code_challenge&state&app_name
    B->>B: Log in if needed (any method)
    B->>B: User clicks "Authorize"
    B->>A: POST /auth/app-login/code {code_challenge}
    A-->>B: {code}
    B->>G: GET http://127.0.0.1:PORT/?code&state
    G->>A: POST /auth/app-login/token {code, code_verifier}
    A-->>G: {login, user, organisation, access_token, refresh_token}
```

Requirements and behavior:

- **Versions**: Zou 1.0.95, Kitsu 1.0.71 and gazu 1.3.2 or later. If no browser can be opened, gazu logs the login URL so you can open it by hand.
- **Same machine**: the browser must run on the machine that runs the script, since it redirects to `127.0.0.1`. Headless machines and remote sessions without a local browser cannot use it.
- **Blocking call**: it waits until the user answers or `timeout` seconds pass. In a GUI, run it in a worker thread.
- **Errors**: `gazu.exception.AuthFailedException` is raised when the user clicks **Cancel**, the timeout expires (the message includes the URL to open by hand) or the code exchange is rejected.
- **Independent session**: the returned tokens are a new pair, logging out of the browser does not log out the script, and vice versa.

To keep the user logged in across runs, see [Session Management](/guides/session-management).

### HTTP routes

For integrations not using gazu, implement the same flow (loopback redirect, one-time code and PKCE with `S256`):

1. Generate a `code_verifier` (43 to 128 characters from `A-Z a-z 0-9 - . _ ~`), its `code_challenge` (base64url SHA-256 without padding, 43 characters) and a random `state`.
2. Listen on `127.0.0.1` with a free port, then open `https://kitsu-url/app-login?port=PORT&code_challenge=CHALLENGE&state=STATE&app_name=My%20Tool` in the browser. The port must be between 1024 and 65535.
3. Wait for a request on the listener carrying your `state`. It has either `code` or `error=access_denied`. Ignore requests without the right `state`.
4. Trade the code within 60 seconds. A code can be used only once.

The Kitsu page mints the code with `POST /auth/app-login/code` (body `{"code_challenge": "..."}`, returns `201 {"code": "..."}`). It requires a logged-in user and rejects bot tokens. You only call the exchange route:

```bash [cURL]
curl \
 --request POST 'https://zou-server-url/api/auth/app-login/token' \
 --header "Content-Type: application/json" \
 --data '{"code":"CODE","code_verifier":"VERIFIER"}'
```

On success it returns `200` with the same body as `/auth/login`, and never sets cookies:

```json
{
  "login": true,
  "user": {"id": "a24a6ea4-...", "email": "user@yourdomain.com", ...},
  "organisation": {...},
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

Any failure (unknown, expired or already used code, wrong verifier, inactive user) returns `400 {"login": false, "message": "Wrong or expired code."}`, without telling which check failed.

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
