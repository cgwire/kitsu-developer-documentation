# Kitsu Docker

You can use the [Kitsu Docker container](https://github.com/cgwire/kitsu-docker) for local development and testing. 

::: warning
It is not recommended to use this image in production.
:::

## Docker install

```bash
docker build -t cgwire/cgwire . # or sudo docker pull cgwire/cgwire

docker run --init -ti --rm -p 80:80 -p 1080:1080 --name cgwire cgwire/cgwire
```

In order to enable data persistence, use a named volume for the database and thumbnails:

```bash
docker run --init -ti --rm -p 80:80 -p 1080:1080 --name cgwire -v zou-storage:/var/lib/postgresql -v zou-storage:/opt/zou/previews cgwire/cgwire
```

To run the image as a daemon, add the `-d` flag:

```bash
docker run --init -d --rm -p 80:80 -p 1080:1080 --name cgwire cgwire/cgwire
```

Default Kitsu credentials:

- login: admin@example.com
- password: mysecretpassword

Update the profile settings with a working email address to try all features.

Default URLs:

- Kitsu: [http://127.0.0.1:80/](http://127.0.0.1:80/)
- Internal webmail: [http://127.0.0.1:1080/](http://127.0.0.1:1080/)

### Updating the image

After updating the image, you have to update the database schema. For that run:

```bash
docker exec -ti cgwire sh -c "/opt/zou/env/bin/zou upgrade-db"
```

## Docker Compose install

`docker-compose.yml`
```yml
services:
  cgwire:
    image: cgwire/cgwire:latest
    container_name: kitsu
    init: true
    tty: true
    stdin_open: true
    ports:
      - 8012:80 # Change the port 8012 to your desired port.
      - 1080:1080
    volumes:
      - zou-storage:/var/lib/postgresql
      - zou-storage:/opt/zou/previews

volumes:
  zou-storage:
    driver: local
    driver_opts:
      type: 'none'
      o: 'bind'
      device: './zou-storage'
```
* Save this in a file and name it `docker-compose.yml`.
* Create the folder `zou-storage` in the same folder as the `docker-compose.yml`.
* Open the terminal in the same folder.
* Run `docker compose up -d`.

## Next Steps

* Learn about [authentication strategies](/guides/authentication)
* Learn to [setup a new production](/guides/production-setup)
