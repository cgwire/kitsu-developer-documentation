# Open Source Setup

## Cloud Hosting

If your version of Kitsu is hosted and maintained by CGWire, you don't have anything to install. Simply connect to the URL provided to you to start using Kitsu!

## Self-Hosting

To run properly, Kitsu requires Zou, the database API. Information related to the installation of both modules is located in the Zou installation documentation.

* [Deploying Zou](https://zou.cg-wire.com/)
* [Deploying Kitsu](https://zou.cg-wire.com/#deploying-kitsu)

If you have technical skills, you can run Kitsu/Zou through Docker to try it out:

```shell
docker run -d -p 80:80 --name cgwire cgwire/cgwire
```

Then you can access Kitsu through [http://localhost](http://localhost).

## Development Environment

### Prerequisites

Prior to setting up the Kitsu development environment, make sure you have the following elements installed:

* [Node.js](https://nodejs.org) >= 20.18
* A [Zou development instance](https://zou.cg-wire.com/development/) up and running on port 5000
* A [Zou Events development instance](https://zou.cg-wire.com/development/) up and running on port 5001 (optional)

### Using Docker Image

You can use our [Docker image](https://hub.docker.com/r/cgwire/cgwire), but you will need to set two environment variables:

* `KITSU_API_TARGET` (default: http://localhost:5000): The URL where the API can be reached.
* `KITSU_EVENT_TARGET` (default: http://localhost:5001): The URL where the event stream can be reached.

In that case, run the development environment with the following command:

```shell
KITSU_API_TARGET=http://localhost/api KITSU_EVENT_TARGET=http://localhost npm run dev
```

The credentials for the Docker image are: admin@example.com / mysecretpassword

## Development

To start modifying Kitsu, clone the repository:

```shell
git clone https://github.com/cgwire/kitsu.git
```

Then download the dependencies:

```shell
cd kitsu
npm install
```

Finally, start the development environment and view the results at `http://localhost:8080`:

```shell
npm run dev
```

Any changes will automatically update the page.

## Build

To build your code, run this command:

```shell
npm run build
```

## Tests

Run tests with the following command:

```shell
npm run test:unit
```

## Source and dependencies

Then get Zou sources:

```bash
git clone git@github.com:cgwire/zou.git
```

Install `virtualenvwrapper`:

```bash
pip install virtualenvwrapper
```

Add configuration for `virtualenvwrapper` to your .bashrc:

```bash
export WORKON_HOME=directory_for_virtualenvs
VIRTUALENVWRAPPER_PYTHON=/usr/bin/python3
source ~/.local/bin/virtualenvwrapper.sh
```

Create a virtual environment with `mkvirtualenv`:

```bash
mkvirtualenv zou
workon zou
```

Install dependencies:

```bash
pip install -r requirements.txt
```

## Init data

Create a database in Postgres named `zoudb` with user `postgres` and password
`mysecretpassword`. Then init db:

```bash
python zou/cli.py clear-db
python zou/cli.py init-db
python zou/cli.py init-data
```

Create a first user:

```bash
python zou/cli.py create-admin super.user@mycgstudio.com --password=mysecretpassword
```

Run server:

```bash
PREVIEW_FOLDER=$PWD/previews DEBUG=1 MAIL_DEBUG=1 FLASK_DEBUG=1 FLASK_APP=zou.app INDEXER_KEY=meilimasterkey python zou/debug.py
```

You can now use the API by requesting `http://localhost:5000`.


## Update database
In case of adding/removing attributes of models, you must generate the DB update file:

```
python zou/cli.py migrate-db
```

### Event server

To run the Server Events server used to update the web GUI in realtime, use the
following command.

```bash
gunicorn --worker-class geventwebsocket.gunicorn.workers.GeventWebSocketWorker -b 127.0.0.1:5001 -w 1 zou.event_stream:app
```

## Tests

To run unit tests, we recommend using another database. 

## Add ffmpeg

To run all tests, `ffmpeg` and `ffprobe` are required.

### Init the search index

The search index can be initialized and reset with the following command:

```
INDEXER_KEY=meilimasterkey DB_DATABASE=zoutest zou reset-search index
```

### Create a testing database

In the CLI of the hosting, the PostgreSQL DB executes the following:
*If Docker, connect with: `docker exec -it postgres bash`*

```
sudo su -l postgres
psql -c 'create database zoutest;' -U postgres
```

### Run the tests

In your zou environment `workon zou`, execute the tests with the `DB_DATABASE` environment variable:

```
INDEXER_KEY=meilimasterkey DB_DATABASE=zoutest py.test
```

If you want to run a specific test (you can list several):

```
DB_DATABASE=zoutest py.test tests/models/test_entity_type.py
```

### Debug email sending

If you set properly the `MAIL_DEBUG=1` flag, the body of each sent email is
displayed in the console.


# Configuration

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

## Key-Value store

* `KV_HOST` (default: localhost): The Redis server host.
* `KV_PORT` (default: 6379): The Redis server port.

## Indexer

Kitsu uses the Meilisearch service for its indexation.

* `INDEXER_KEY` (default: masterkey): The key required by Meilisearch.
* `INDEXER_HOST` (default: localhost): The Meilisearch host.
* `INDEXER_PORT` (default: 7700): The Meilisearch port.

## Authentication

* `AUTH_STRATEGY` (default: auth\_local\_classic): Allow to choose between
traditional auth and Active Directory auth (auth\_remote\_active\_directory).
* `SECRET_KEY` (default: mysecretkey) Complex key used for auth token encryption.

## Previews

* `PREVIEW_FOLDER` (default: ./previews): The folder where
  thumbnails will be stored. The default value is set for development
  environments. We encourage you to set an absolute path when you use it in
  production.
* `REMOVE_FILES` (default: "False"): Delete files when deleting comments and revisions

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
* `MAIL_DEFAULT_SENDER` (default: "no-reply@cg-wire.com"): To set the sender
  email.
* `DOMAIN_NAME` (default: "localhost:8080"): To build URLs (for a password reset
  for instance).
* `DOMAIN_PROTOCOL` (default: "https"): To build URLs (for a password reset
  for instance).

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
* `FS_SWIFT_AUTH_URL`: Authentication URL of your swift backend.
* `FS_SWIFT_USER`: Your Swift login.
* `FS_SWIFT_TENANT_NAME`: The Swift tenant name.
* `FS_SWIFT_KEY`: Your Swift password.
* `FS_SWIFT_REGION_NAME`: Your Swift region name.

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


## Job queue

* `ENABLE_JOB_QUEUE` (default: "False"): Set to True if you want to send
  asynchronous tasks to the `zou-jobs` service.
* `JOB_QUEUE_TIMEOUT` (default: 3600): Set the timeout (in seconds) for preview and playlist encoding jobs sent to the `zou-jobs` service.
* `ENABLE_JOB_QUEUE_REMOTE` (default: "False"): Set to True if you want to send
  playlist builds to a Nomad cluster.


## Misc

* `TMP_DIR` (default: /tmp): The temporary directory used to handle uploads.
* `DEBUG` (default: False): Activate the debug mode for development purposes.
* `CRISP TOKEN` (default: ): Activate the Crisp support chatbox on the bottom right.
