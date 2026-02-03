## Key-value store

To run Redis, we recommend using Docker again:

```bash
sudo docker pull redis
sudo docker run \
    --name redis \
    -p 6379:6379 \
    -d redis
```
