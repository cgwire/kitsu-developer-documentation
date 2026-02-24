# Kitsu Plugins Development

The Kitsu API (Zou) plugin system allows you to create extensions of the API.
Each plugin includes a `manifest.toml` file to describe plugin and manage its
versioning. Each plugin can add routes to the API and add tables to the database.

## Quickstart

You can [find a full example on Github](https://github.com/cgwire/kitsu-tickets).

1. Create your plugin:

```bash
zou create-plugin-skeleton --path ./plugins --id my-plugin
```

3. Implement routes in the `resource.py` file.

3. Add routes to the `__init__.py` file.

4. Implement models (if needed) in the `models.py` file.

5. Add some informations about your plugin in the `manifest.toml` file.

6. Generate database migrations (if needed):

```bash
zou migrate-plugin-db --path ./plugins/my-plugin
```

7. Package it:

```bash
zou create-plugin-package --path ./plugins/my-plugin --output-path ./dist
```

8. Install it:

```bash
zou install-plugin --path ./dist/my-plugin.zip
```

9. List installed plugins:

```bash
zou list-plugins
```

10. Uninstall if needed:

```bash
zou uninstall-plugin --id my-plugin
```

## Plugin structure

Plugins are structured this way:

```
my_plugin/
├── __init__.py
├── manifest.toml
├── models.py
├── resources.py
├── logo.png
├── migrations/
│   ├── env.py
│   ├── versions/
│   ├── /
/
```

---

### `__init__.py`

List the routes you are adding via the plugin.

### `resources.py`

Describe resources tied to routes here.

### `models.py`

Add some new models in this python file. Generate related migration files:

```
zou migrate-plugin-db --path ./plugins/my-plugin
```

### `manifest.toml`

A manifest file is required to describe how to deploy your plugin and inform
other users about how it can be used.
It contains the plugin metadata:

```toml
id = "my_plugin"
name = "My Plugin"
version = "0.1.0"
description = "My plugin description."
maintainer = "Author <author@example.com>"
website = "mywebsite.com"
license = "GPL-3.0-only"
```

## Adding new views to the Kitsu dashboard

### Studio wide section

Add these options to your manifest :

```
frontend_studio_enabled = true
icon = "ticket-check"
```

It will add a section in the Kitsu left sidebar. The icon used will picked
from the [lucide-icon](https://lucide.dev/) list. Use the icon parameter to
select yours.

Once done add an html entry point in your plugin:

```
frontend/dist/index.html
```

Then install your application again and see how it runs into Kitsu.

NB: We recommend to build apps based on Vue or NuxtJS.

### Production wide section

```
frontend_project_enabled = true
icon = "ticket-check"
```

The `frontend_project_enabled` parameter will add a section in the project
menu located on the top of the Kitsu UI.

It will use the same entry point as the studio but will add two parameters
in the query loading your index.html file: `production_id` and `episode_id`.
It will allow you to know the context in which the plugin is loaded.


## Best practices

* Use alphanumeric characters and hyphens for the plugin name.
* Follow semantic versioning (`x.y.z`).
* Include at least one route or feature inside your plugin module.
* Write migrations if your plugin defines database models.
* For license use SPDX identifier (see [here](https://spdx.org/licenses/)).
