# Logging

Gazu uses Python's built-in `logging` module. By default, logs are silent
unless you configure a handler.

## Enable debug logging

Set the `GAZU_DEBUG` environment variable to see all HTTP requests:

```bash
GAZU_DEBUG=true python my_script.py
```

This logs every request method and URL:

```
DEBUG:gazu:GET http://kitsu.mystudio.com/api/data/projects
DEBUG:gazu:POST http://kitsu.mystudio.com/api/data/tasks
```

POST and PUT bodies are logged too, except when they contain sensitive fields
like `password`, `token`, or `access_token`.

## Configure logging in code

You can attach handlers to the `gazu` logger for finer control:

```python
import logging

logger = logging.getLogger("gazu")
logger.setLevel(logging.DEBUG)

handler = logging.StreamHandler()
handler.setFormatter(logging.Formatter("%(levelname)s %(name)s %(message)s"))
logger.addHandler(handler)
```

## Log to a file

```python
import logging

logging.basicConfig(
    filename="gazu.log",
    level=logging.DEBUG,
    format="%(asctime)s %(levelname)s %(name)s %(message)s",
)
```

## Async module

The async module uses a separate logger named `gazu.aio`. You can configure
it independently:

```python
logging.getLogger("gazu.aio").setLevel(logging.WARNING)
```
