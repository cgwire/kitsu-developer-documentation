# Open Source Setup

This guide breaks down how to self-host Kitsu in a production environment.

## Testing build

You can start running Kitsu through Docker to try it out. Please [refer to the dedicated guide to get started](/start-here/docker).

## I. Zou Installation

## Prerequisites

The installation requires:

* Ubuntu (version >= 22.04)
* Python (version >= 3.10)
* An up-and-running Postgres instance (version >= 9.2)
* An up-and-running Redis server instance (version >= 2.0)
* A Nginx instance
* For video operations, FFMPEG is required.

## 1. Installing dependencies

First, let's install third-party software:

```bash
sudo apt-get install postgresql postgresql-client postgresql-server-dev-all
sudo apt-get install build-essential
sudo apt-get install redis-server
sudo apt-get install nginx
sudo apt-get install xmlsec1
sudo apt-get install ffmpeg
```

*NB: We recommend installing Postgres on a separate machine.*

### Install Python 3.12

```
sudo apt-get install software-properties-common
sudo add-apt-repository ppa:deadsnakes/ppa -y
sudo apt-get update
sudo apt-get install python3.12 python3.12-venv python3.12-dev
```

### Download sources

Create a dedicated zou user:

```bash
sudo useradd --home /opt/zou zou 
sudo mkdir /opt/zou
sudo mkdir /opt/zou/backups
sudo chown zou: /opt/zou/backups
```

Install Zou and its dependencies:

```
sudo python3.12 -m venv /opt/zou/zouenv
sudo /opt/zou/zouenv/bin/python -m pip install --upgrade pip
sudo /opt/zou/zouenv/bin/python -m pip install zou
```

Create a folder to store the previews:

```
sudo mkdir /opt/zou/previews
sudo chown -R zou:www-data /opt/zou/previews
```

Create a folder to store the temp files:

```
sudo mkdir /opt/zou/tmp
sudo chown -R zou:www-data /opt/zou/tmp
```

## 2. Preparing the Postgres database

To run Postgres, we recommend using Docker (it's simpler, and it won't impact
your local system):

```bash
sudo docker pull postgres
sudo docker run \
    --name postgres \
    -p 5432:5432 \
    -e POSTGRES_PASSWORD=mysecretpassword \
    -d postgres
```

Create Zou database in Postgres:

```
sudo -u postgres psql -c 'create database zoudb;' -U postgres
```

Set a password for your postgres user. For that start the Postgres CLI:

```bash
sudo -u postgres psql
```

Then set the password (*mysecretpassword* if you want to do some tests).

```bash
psql (9.4.12)
Type "help" for help.

postgres=# \password postgres
Enter new password: 
Enter it again: 
```

Then, exit from the Postgres client console.

Alternatively, if you want to set the password to avoid interactive prompts, use: 
```bash
sudo -u postgres psql -U postgres -d postgres -c "alter user postgres with password 'mysecretpassword';"
```

`SECRET_KEY` must be generated randomly
(use `pwgen 16` command for that).

Create the environment variables file for the database:

*Path: /etc/zou/zou.env*
```bash
DB_PASSWORD=mysecretpassword
PREVIEW_FOLDER=/opt/zou/previews
TMP_DIR=/opt/zou/tmp
SECRET_KEY=yourrandomsecretkey

# If you add variables above, add the exports below
export DB_PASSWORD SECRET_KEY PREVIEW_FOLDER TMP_DIR SECRET_KEY
```

You need to have these variables in memory when you run a `zou` command.
The easiest way to do this is to run this command:

`. /etc/zou/zou.env`

This line is included with every command in the documentation so that you don't forget it. But you don't have to run it every time.

Finally, create database tables (it is required to leave the Postgres console
and to activate the Zou virtual environment):

```bash
# Run it in your bash console.
. /etc/zou/zou.env
/opt/zou/zouenv/bin/zou init-db
```

*NB: You can specify a custom username and database. See the [configuration section](https://zou.cg-wire.com/configuration/).*

## 3. Setting up the key-value store Redis

To run Redis, we recommend using Docker again:

```bash
sudo docker pull redis
sudo docker run \
    --name redis \
    -p 6379:6379 \
    -d redis
```

Currently, Redis requires no extra configuration. 

To remove warnings in Redis logs and improve background saving success rate,
you can add this to `/etc/sysctl.conf`:

```
vm.overcommit_memory = 1
```

If you want to do performance tuning, have a look at [this
article](https://www.techandme.se/performance-tips-for-redis-cache-server/).


## 4. (optional) Set up the Meilisearch indexer

To allow full-text search, Kitsu relies on an Indexing engine. It uses the
[Meilisearch](https://www.meilisearch.com/docs) technology.

The indexer is optional. Kitsu can run without it.

To run Meilisearch, we recommend using Docker again:

```bash
sudo docker pull getmeili/meilisearch:v1.8.3
sudo docker run -it --rm \
    --name meilisearch \
    -p 7700:7700 \
    -e MEILI_ENV='development' \
    -e MEILI_MASTER_KEY='meilimasterkey' \
    -v $(pwd)/meili_data:/meili_data \
    -d getmeili/meilisearch:v1.8.3
```

[Refer to the dedicated section of the documentation on full-text search for more information.](/self-hosting/full-text-search)

## 5. Configure Gunicorn

#### Configure the main API server

First, create a configuration folder:

```
sudo mkdir /etc/zou
```

We need to run the application through *gunicorn*, a WSGI server that will run zou as a daemon. Let's write the *gunicorn* configuration:

*Path: /etc/zou/gunicorn.py*

```
accesslog = "/opt/zou/logs/gunicorn_access.log"
errorlog = "/opt/zou/logs/gunicorn_error.log"
workers = 3
worker_class = "gevent"
```

Let's create the log folder:

```
sudo mkdir /opt/zou/logs
sudo chown zou: /opt/zou/logs
```

Then we daemonize the *gunicorn* process via Systemd. For that, we add a new
file that will add a new daemon to be managed by Systemd:

*Path: /etc/systemd/system/zou.service*

```
[Unit]
Description=Gunicorn instance to serve the Zou API
After=network.target

[Service]
User=zou
Group=www-data
WorkingDirectory=/opt/zou
# ffmpeg must be in PATH
Environment="PATH=/opt/zou/zouenv/bin:/usr/bin"
EnvironmentFile=/etc/zou/zou.env
ExecStart=/opt/zou/zouenv/bin/gunicorn  -c /etc/zou/gunicorn.py -b 127.0.0.1:5000 zou.app:app

[Install]
WantedBy=multi-user.target
```

#### Configure Events Stream API server


Let's write the *gunicorn* configuration:

*Path: /etc/zou/gunicorn-events.py*

```
accesslog = "/opt/zou/logs/gunicorn_events_access.log"
errorlog = "/opt/zou/logs/gunicorn_events_error.log"
workers = 1
worker_class = "geventwebsocket.gunicorn.workers.GeventWebSocketWorker"
```

Then we daemonize the *gunicorn* process via Systemd:

*Path: /etc/systemd/system/zou-events.service*

```
[Unit]
Description=Gunicorn instance to serve the Zou Events API
After=network.target

[Service]
User=zou
Group=www-data
WorkingDirectory=/opt/zou
Environment="PATH=/opt/zou/zouenv/bin"
EnvironmentFile=/etc/zou/zou.env
ExecStart=/opt/zou/zouenv/bin/gunicorn -c /etc/zou/gunicorn-events.py -b 127.0.0.1:5001 zou.event_stream:app

[Install]
WantedBy=multi-user.target
```

## 6. Configure the Nginx reverse proxy server

Finally, we serve the API through a Nginx server. For that, add this
configuration file to Nginx to redirect the traffic to the Gunicorn servers:

*Path: /etc/nginx/sites-available/zou*

```nginx
server {
    listen 80;
    server_name server_domain_or_IP;

    location /api {
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_pass http://localhost:5000/;
        client_max_body_size 500M;
        proxy_connect_timeout 600s;
        proxy_send_timeout 600s;
        proxy_read_timeout 600s;
        send_timeout 600s;
    }

    location /socket.io {
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "Upgrade";
        proxy_pass http://localhost:5001;
    }
}
```

*NB: We use the 80 port here to make this documentation simpler but the 443 port and https connection are highly recommended.*

Finally, make sure that the default configuration is removed: 

```bash
sudo rm /etc/nginx/sites-enabled/default
```


We enable that Nginx configuration with this command:

```bash
sudo ln -s /etc/nginx/sites-available/zou /etc/nginx/sites-enabled/zou
```

Finally, we can start our daemon and restart Nginx:

```bash
sudo systemctl enable zou zou-events
sudo systemctl start zou zou-events
sudo systemctl restart nginx
```

## Updating Zou

### Update package

First, you have to upgrade the zou package:

```bash
sudo /opt/zou/zouenv/bin/python -m pip install --upgrade zou
```


### Update database schema

Then, you need to upgrade the database schema:

```bash
DB_PASSWORD=mysecretpassword /opt/zou/zouenv/bin/zou upgrade-db
```


### Restart the Zou service

Finally, restart the Zou service:

```bash
sudo systemctl restart zou zou-events
```

That's it! Your Zou instance is now up to date. 

*NB: Make it sure by getting the API version number from `https://myzoudomain.com/api`.*

## II. Kitsu App Installation

[Kitsu](https://kitsu.cg-wire.com) is a javascript UI that allows to manage Zou
data from the browser.

Deploying Kitsu requires retrieving the built version. For that let's grab it
from Github: 

```
sudo mkdir -p /opt/kitsu/dist
curl -L -o /tmp/kitsu.tgz $(curl -v https://api.github.com/repos/cgwire/kitsu/releases/latest | grep 'browser_download_url.*kitsu-.*.tgz' | cut -d : -f 2,3 | tr -d \")
sudo tar xvzf /tmp/kitsu.tgz -C /opt/kitsu/dist/
rm /tmp/kitsu.tgz
```

Then we need to adapt the Nginx configuration to allow it to serve it properly:

```nginx
server {
    listen 80;
    server_name server_domain_or_IP;

    location /api {
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header Host $host;
        proxy_pass http://localhost:5000/;
        client_max_body_size 500M;
        proxy_connect_timeout 600s;
        proxy_send_timeout 600s;
        proxy_read_timeout 600s;
        send_timeout 600s;
    }

    location /socket.io {
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "Upgrade";
        proxy_pass http://localhost:5001;
    }

    location / {
        autoindex on;
        root  /opt/kitsu/dist;
        try_files $uri $uri/ /index.html;
    }
}
```

Restart your Nginx server:

```bash
sudo systemctl restart nginx
```

You can now connect directly to your server IP through your browser and enjoy
Kitsu!


### Update Kitsu 

To update Kitsu, update the files:

```
sudo rm -rf /opt/kitsu/dist
sudo mkdir /opt/kitsu/dist
curl -L -o /tmp/kitsu.tgz $(curl -v https://api.github.com/repos/cgwire/kitsu/releases/latest | grep 'browser_download_url.*kitsu-.*.tgz' | cut -d : -f 2,3 | tr -d \")
sudo tar xvzf /tmp/kitsu.tgz -C /opt/kitsu/dist/
rm /tmp/kitsu.tgz
```

## Seed data

Some basic data are required by Kitsu to work properly (like project status) :

```
. /etc/zou/zou.env
/opt/zou/zouenv/bin/zou init-data
```

If you have install the indexer, you can also index the data:

```
. /etc/zou/zou.env
/opt/zou/zouenv/bin/zou reset-search-index
```

## Admin users

To start with Zou you need to add an admin user. This user will be able to
log in and create other users. For that go into the terminal and run the
`zou` binary:

```
. /etc/zou/zou.env
/opt/zou/zouenv/bin/zou create-admin --password 1SecretPass adminemail@yourstudio.com
```

It expects the password as the first argument. Then your user will be created with
the email as login, `1SecretPass` as password, and "Super Admin" as first name and
last name.

## API configuration

Check if API is up:

```python
gazu.client.is_host_up()
```

Get currently configured API server hostname:

```python
gazu.client.get_host()
```

Set API server hostname:

```python
gazu.client.set_host("pipeline-api")
```

Get API version:

```python
gazu.client.get_api_version()
```
