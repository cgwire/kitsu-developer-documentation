# Environment Variables

Zou requires several configuration parameters. In the following, you will find
the list of all expected parameters.

## Database

* `DB_HOST` (default: localhost): The database server host.
* `DB_PORT` (default: 5432): The port on which the database is running.
* `DB_USERNAME` (default: postgres): The username used to access the database.
* `DB_PASSWORD` (default: mysecretpassword): The password used to access the
  database.
* `DB_DATABASE` (default: zoudb): The database name to use.
* `DB_POOL_SIZE` (default: 30): The number of connections opened simultaneously 
  to access the database.
* `DB_MAX_OVERFLOW` (default: 60): The number of additional connections available 
  once the pool is full. They are disconnected when the request is finished. They
  are not reused.
* `DB_DRIVER` (default: postgresql+psycopg): The SQLAlchemy driver used to
  connect to the database.
* `DB_POOL_PRE_PING` (default: "True"): Check each connection before using it,
  so a connection closed by the server is replaced instead of failing.
* `DB_POOL_RECYCLE` (default: 3600): Seconds after which a pooled connection is
  replaced.
* `DB_POOL_RESET_ON_RETURN` (default: commit): What to do with the transaction
  state of a connection returned to the pool ("commit", "rollback" or "none").

## Key-Value store

* `KV_HOST` (default: localhost): The Redis server host.
* `KV_PORT` (default: 6379): The Redis server port.
* `KV_PASSWORD` (default: none): The Redis server password.
* `CACHE_TYPE` (default: none): Cache backend. When unset, the cache is stored
  in Redis. Set it to "simple" for an in-memory cache (development only).

## Indexer

Kitsu uses the Meilisearch service for its indexation.

* `INDEXER_KEY` (default: masterkey): The key required by Meilisearch.
* `INDEXER_HOST` (default: localhost): The Meilisearch host.
* `INDEXER_PORT` (default: 7700): The Meilisearch port.
* `INDEXER_PROTOCOL` (default: http): The protocol used to reach Meilisearch.
* `INDEXER_TIMEOUT` (default: 5000): Timeout in milliseconds of Meilisearch
  requests.

## Authentication

* `AUTH_STRATEGY` (default: auth\_local\_classic): Allow to choose between
traditional auth and Active Directory auth (auth\_remote\_active\_directory).
* `SECRET_KEY` (default: mysecretkey) Complex key used for auth token encryption.
* `ENFORCE_2FA` (default: "False"): When True, users without two-factor
  authentication get restricted tokens at login and must set up 2FA before
  using Kitsu.
* `2FA_EXEMPT_USERS` (default: ""): Comma-separated list of user emails exempt
  from `ENFORCE_2FA`.
* `BCRYPT_LOG_ROUNDS` (default: 12): Cost factor of the password hashing.
* `CORS_ALLOWED_ORIGINS` (default: ""): Semicolon-separated list of origins
  allowed to call the API from a browser. Leave it empty when Kitsu and Zou
  are served from the same domain.

### SAML SSO

See [SAML SSO](/self-hosting/security-assertion-markup-language) for the full
setup guide.

* `SAML_ENABLED` (default: "False"): Set to True to enable SAML SSO.
* `SAML_IDP_NAME` (default: ""): Display name shown on the SAML login button.
* `SAML_METADATA_URL` (default: ""): Identity provider SAML metadata URL.
* `SAML_SKIP_2FA` (default: "False"): When True, SAML sessions skip Kitsu's 2FA
  setup gate. When False, `ENFORCE_2FA` applies as usual.
* `SAML_SUBJECT_ATTRIBUTE` (default: ""): Assertion attribute holding the
  provider's stable user id. When set, accounts are bound to it instead of
  being matched by email on every login.

### OIDC SSO

See [OIDC SSO](/self-hosting/openid-connect-sso) for the full setup guide.

* `OIDC_ENABLED` (default: "False"): Set to True to enable OIDC SSO.
* `OIDC_IDP_NAME` (default: ""): Display name shown on the OIDC login button.
* `OIDC_DISCOVERY_URL` (default: ""): Provider OpenID configuration URL (ends
  with `/.well-known/openid-configuration`).
* `OIDC_CLIENT_ID` (default: ""): OAuth client identifier registered with the
  provider.
* `OIDC_CLIENT_SECRET` (default: ""): OAuth client secret.
* `OIDC_SCOPES` (default: "openid email profile"): Space-separated scopes to
  request.
* `OIDC_EMAIL_CLAIM` (default: "email"): Claim used as the account email.
* `OIDC_GIVEN_NAME_CLAIM` (default: "given_name"): Claim used for the first
  name.
* `OIDC_FAMILY_NAME_CLAIM` (default: "family_name"): Claim used for the last
  name.
* `OIDC_REQUIRE_EMAIL_VERIFIED` (default: "True"): When True, reject logins
  whose `email_verified` claim is absent or false.
* `OIDC_SKIP_2FA` (default: "False"): When True, OIDC sessions skip Kitsu's 2FA
  setup gate. When False, `ENFORCE_2FA` applies as usual.

## Previews

* `PREVIEW_FOLDER` (default: ./previews): The folder where
  thumbnails will be stored. The default value is set for development
  environments. We encourage you to set an absolute path when you use it in
  production.
* `REMOVE_FILES` (default: "False"): Delete files when deleting comments and revisions
* `PREVIEW_SAVE_SOURCE_FILE` (default: "False"): Keep the uploaded source file
  of movie previews next to the normalized version.
* `SKIP_NORMALIZATION_FULL` (default: "False"): Skip the movie normalization
  entirely: the uploaded movie is stored as is and serves as the preview.
* `SKIP_NORMALIZATION_HIGHDEF` (default: "False"): Skip only the high
  definition encoding: the low definition movie is the only one stored and
  the full quality route falls back on it.
* `SYNC_SOURCE_MOVIE_FILES` (default: "False"): Replicate the source movies
  when syncing from another instance. Required when that instance skips the
  normalization, since its previews are then the source movies.
* `CLIENT_CACHE_MAX_AGE` (default: 604800): Seconds browsers may cache
  thumbnails and preview files.
* `MEDIA_MAX_CONCURRENT_REQUESTS` (default: 0): Picture and movie downloads a
  worker process serves at once; the others wait for a slot, so a burst of
  thumbnails cannot starve the rest of the API. 0 disables the limit.
* `MEDIA_SLOT_WAIT_TIMEOUT` (default: 30): Seconds a media download waits for
  a slot before being answered with a 503 error. 0 waits without limit.
* `PREVIEW_MISSING_FILE_RECHECK_DELAY` (default: 3600): Seconds during which a
  preview file known as missing is answered 404 without asking the storage
  again.
* `LOG_FILE_NOT_FOUND` (default: "False"): Log the requests for preview files
  missing from the storage.
* `MAX_IMAGE_PIXELS` (default: "400000000"): Maximum number of pixels an
  uploaded image may decode to before Pillow rejects it. This guards against
  decompression bombs (a tiny file declaring huge dimensions) that would
  otherwise exhaust worker memory. The default (20000×20000) is kept high so
  legitimate large plates are accepted; lower it on memory-constrained
  deployments.
* `MAX_CONTENT_LENGTH` (default: "10737418240", 10 GiB): Maximum size in bytes
  of any request body, uploads included. Requests above the limit are rejected
  with a 413 error. The default is generous so multi-GB movie uploads keep
  working; set it to 0 to disable the limit entirely.
* `MOVIE_HIGHDEF_BITRATE` (default: "28") and `MOVIE_LOWDEF_BITRATE` (default:
  "6"): Bitrates in Mbit/s of the high and low definition movies encoded for
  previews, used when the project and its task type link do not set
  `hd_bitrate_compression` / `ld_bitrate_compression`. The high definition
  default is also the ceiling of every bitrate set on a project, a template
  or a task type link.
* `MOVIE_VBV_BUFSIZE_FACTOR` (default: "2"): The bitrate also caps the rate
  the encoder may reach over a buffer of that many times the bitrate, so a
  player receiving the bitrate never starves. Set it to 0 to keep a plain
  average bitrate target without cap.
* `MOVIE_ENCODING_PRESET` (default: "medium"): x264 preset used for the
  preview movies. Previews keep a keyframe every two frames, so slower
  presets bring no visible gain; use "slow" to get the encoding of releases
  before this setting existed.

## Users

* `USER_LIMIT` (default: "100"): Max number of users
* `MIN_PASSWORD_LENGTH` (default: "8"): The minimum password length
* `DEFAULT_TIMEZONE` (default: "Europe/Paris"): The default timezone for new user accounts
* `DEFAULT_LOCALE` (default: "en_US"): The default language for new user accounts

## Emails

The email configuration is required for emails sent after a password reset and,
email notifications.

* `MAIL_SERVER` (default: "localhost"): The host of your email server
* `MAIL_PORT` (default: "25"): The port of your email server
* `MAIL_USERNAME` (default: ""): The username to access to your mail server
* `MAIL_PASSWORD` (default: ""): The password to access to your mail server
* `MAIL_DEBUG` (default: "0"): Set 1 if you are in a development environment
  (emails are printed in the console instead of being sent).
* `MAIL_USE_TLS` (default: "False"): To use TLS to communicate with the email
  server.
* `MAIL_USE_SSL` (default: "False"): To use SSL to communicate with the email
  server.
* `MAIL_DEFAULT_SENDER` (default: "no-reply@your-studio.com"): To set the
  sender email.
* `DOMAIN_NAME` (default: "localhost:8080"): To build URLs (for a password reset
  for instance).
* `DOMAIN_PROTOCOL` (default: "https"): To build URLs (for a password reset
  for instance).
* `MAIL_ENABLED` (default: "True"): Set to False to disable every email.
* `MAIL_DEBUG_BODY` (default: "False"): Log the body of every email sent.
* `MAIL_CHECK_DELIVERABILITY` (default: "True"): Check that the domain of an
  email address accepts mail before saving it.

You can find more information here:
https://flask-mail.readthedocs.io/en/latest/

## Indexes

* `INDEXES_FOLDER` (default: "./indexes"): The folder to store your indexes, we
  recommend to set a full path here.


## S3 Storage

If you want to store your previews in an S3 backend, add the following
variables (we assume that you created a programmatic user that can access
to S3).

* `FS_BACKEND`: Set this variable with "s3"
* `FS_BUCKET_PREFIX`: A prefix for your bucket names. It's mandatory to 
   set it to properly use S3.
* `FS_S3_REGION`: Example: *eu-west-3*
* `FS_S3_ENDPOINT`: The url of your region. 
   Example: *https://s3.eu-west-3.amazonaws.com*
* `FS_S3_ACCESS_KEY`: Your user access key.
* `FS_S3_SECRET_KEY`: Your user secret key.
* `FS_S3_CREATE_BUCKET` (default: "False"): Create the buckets when they do
  not exist.
* `FS_S3_AES256_ENCRYPTED` (default: "False"): Encrypt the stored files on the
  client side with AES-256.
* `FS_S3_AES256_KEY`: The AES-256 key used when encryption is enabled.

Then install the following package in your virtual environment:

```
cd /opt/zou
. zouenv/bin/activate
pip install boto3
```

When you restart Zou, it should use S3 to store and retrieve files.

## Swift Storage

If you want to store your previews in a Swift backend, add the following
variables (Only Auth 2.0 and 3.0 are supported).

* `FS_BACKEND`: Set this variable with "swift"
* `FS_BUCKET_PREFIX`: A prefix for your bucket/container names.
* `FS_SWIFT_AUTHURL`: Authentication URL of your swift backend.
* `FS_SWIFT_USER`: Your Swift login.
* `FS_SWIFT_TENANT_NAME`: The Swift tenant name.
* `FS_SWIFT_KEY`: Your Swift password.
* `FS_SWIFT_REGION_NAME`: Your Swift region name.
* `FS_SWIFT_AUTH_VERSION` (default: 3): The Keystone authentication version.
* `FS_SWIFT_CREATE_CONTAINER` (default: "False"): Create the containers when
  they do not exist.
* `FS_SWIFT_AES256_ENCRYPTED` (default: "False"): Encrypt the stored files on
  the client side with AES-256.
* `FS_SWIFT_AES256_KEY`: The AES-256 key used when encryption is enabled.
* `FS_SWIFT_POOL_SIZE` (default: 20): Number of connections kept open to Swift.
* `FS_SWIFT_TIMEOUT` (default: 60): Timeout in seconds of Swift requests.
* `FS_SWIFT_RETRIES` (default: 5): Number of retries of a failed Swift request.
* `FS_SWIFT_TOKEN_CACHE_TTL` (default: 3600): Seconds a Keystone token is
  shared through Redis between processes. 0 authenticates on every new
  connection. Keep it below the token lifetime set on the Keystone side.
* `FS_SWIFT_ETAG_MISMATCH_POLICY` (default: log): What to do when the ETag
  returned by Swift does not match the uploaded content: "log", "raise" or
  "raise_and_delete".

## LDAP

These variables are active only if auth\_remote\_ldap strategy is selected.

* `LDAP_HOST` (default: "127.0.0.1"): The IP address of your LDAP server.
* `LDAP_PORT` (default: "389"): The listening port of your LDAP server.
* `LDAP_BASE_DN` (default: "CN=Users,DC=studio,DC=local"): The base domain of your
   LDAP configuration.
* `LDAP_DOMAIN` (default: "studio.local"): The domain used for your LDAP
  authentication (NTLM).
* `LDAP_FALLBACK` (default: "False"): Set to True if you want to allow admins
  to fallback on default auth strategy when the LDAP server is down.
* `LDAP_IS_AD` (default: "False"): Set to True if you use LDAP with an active directory.
* `LDAP_IS_AD_SIMPLE` (default: "False"): Set to True to authenticate against
  an Active Directory with a simple bind instead of NTLM.
* `LDAP_SSL` (default: "False"): Set to True to connect to the LDAP server over
  SSL.
* `LDAP_GROUP` (default: ""): Only synchronize the members of this group.


## Job queue

* `ENABLE_JOB_QUEUE` (default: "False"): Set to True if you want to send
  asynchronous tasks to the `zou-jobs` service.
* `JOB_QUEUE_TIMEOUT` (default: 3600): Set the timeout (in seconds) for preview and playlist encoding jobs sent to the `zou-jobs` service.
* `ENABLE_JOB_QUEUE_REMOTE` (default: "False"): Set to True if you want to send
  playlist builds to a Nomad cluster.
* `JOB_QUEUE_NOMAD_HOST` (default: zou-nomad-01.zou): The Nomad server host.
* `JOB_QUEUE_NOMAD_PLAYLIST_JOB` (default: zou-playlist): The Nomad job used to
  build playlists.
* `JOB_QUEUE_NOMAD_NORMALIZE_JOB` (default: ""): The Nomad job used to
  normalize movie previews.
* `JOB_QUEUE_NOMAD_TILE_JOB` (default: ""): The Nomad job used to generate
  movie tiles.

## Monitoring

* `SENTRY_ENABLED` (default: "False"): Send the API errors to Sentry.
* `SENTRY_DSN` (default: ""): The Sentry DSN of the API.
* `SENTRY_SR` (default: 1.0): Sample rate of the API performance traces.
* `SENTRY_DEBUG_URL` (default: none): Route that raises an error, to check the
  Sentry setup.
* `SENTRY_KITSU_ENABLED` (default: "False"): Send the Kitsu frontend errors to
  Sentry.
* `SENTRY_KITSU_DSN` (default: ""): The Sentry DSN of the Kitsu frontend.
* `SENTRY_KITSU_SR` (default: 0.1): Sample rate of the frontend traces.
* `PROMETHEUS_METRICS_ENABLED` (default: "False"): Expose Prometheus metrics
  (requires the `prometheus_flask_exporter` package).


## Misc

* `TMP_DIR` (default: /tmp): The temporary directory used to handle uploads.
* `DEBUG` (default: False): Activate the debug mode for development purposes.
* `CRISP_TOKEN` (default: ""): Activate the Crisp support chatbox on the bottom right.
* `DEBUG_HOST` (default: 127.0.0.1) and `DEBUG_PORT` (default: 5000): Address
  of the development server.
* `EVENT_STREAM_HOST` (default: localhost) and `EVENT_STREAM_PORT` (default:
  5001): Address of the event stream (websocket) server.
* `NB_RECORDS_PER_PAGE` (default: 100): Default page size of paginated
  routes.
* `PLUGIN_FOLDER` (default: ./plugins): The folder where plugins are installed.
* `DEFAULT_FILE_TREE` (default: default): File tree applied to projects
  imported from Shotgun.
* `ADMIN_TOKEN` (default: ""): When set, enables the `/admin/config/check`
  route, called with this token as Bearer.
* `LOGLEVEL` (default: INFO): Log level of the `zou sync-*` commands.
