## Database

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
