# Development Environment Quickstart

## Prerequisites

Prior to setting up the Kitsu development environment, make sure you have the following elements installed:

* [Node.js](https://nodejs.org) >= 20.18
* A Zou development instance up and running on port 5000
* A Zou Events development instance up and running on port 5001 (optional)

## Using the Docker Image

You can use our [Docker image](/start-here/docker), but you will need to set two environment variables:

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

## Run the server

```bash
PREVIEW_FOLDER=$PWD/previews DEBUG=1 MAIL_DEBUG=1 FLASK_DEBUG=1 FLASK_APP=zou.app INDEXER_KEY=meilimasterkey python zou/debug.py
```

You can now use the API by requesting `http://localhost:5000`.

## Update database
In case of adding/removing attributes of models, you must generate the DB update file:

```
python zou/cli.py migrate-db
```

## Event server

To run the Server Events server used to update the web GUI in realtime, use the
following command.

```bash
gunicorn --worker-class geventwebsocket.gunicorn.workers.GeventWebSocketWorker -b 127.0.0.1:5001 -w 1 zou.event_stream:app
```

## Tests

To run unit tests, we recommend using another database. 

## Add ffmpeg

To run all tests, `ffmpeg` and `ffprobe` are required.

## Init the search index

The search index can be initialized and reset with the following command:

```
INDEXER_KEY=meilimasterkey DB_DATABASE=zoutest zou reset-search index
```

## Create a testing database

In the CLI of the hosting, the PostgreSQL DB executes the following:
*If Docker, connect with: `docker exec -it postgres bash`*

```
sudo su -l postgres
psql -c 'create database zoutest;' -U postgres
```

## Run the tests

In your zou environment `workon zou`, execute the tests with the `DB_DATABASE` environment variable:

```
INDEXER_KEY=meilimasterkey DB_DATABASE=zoutest py.test
```

If you want to run a specific test (you can list several):

```
DB_DATABASE=zoutest py.test tests/models/test_entity_type.py
```

## Debug email sending

If you set properly the `MAIL_DEBUG=1` flag, the body of each sent email is displayed in the console.

To simplify email testing, we include an email catch-all application in the Docker image to intercept all emails sent by Kitsu. These can be viewed in an included webmail.

## Packaging

Get the sources, and increment the version located in the `zou/__init__.py` file.
Tag the repository with the new version and run the following commands:

```bash
pip install wheel twine
python setup.py bdist_wheel
twine upload dist/<package>.whl
```
