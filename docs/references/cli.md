# CLI Command Reference

## `install_plugin`

Install a plugin from a local folder or `.zip` package.

```bash
zou install-plugin --path /path/to/plugin
```

**Options:**

* `--path`: Path to the plugin folder or `.zip` archive (required).
* `--force`: Overwrite if already installed (default: `False`).

**Note:** You need to restart the Zou server after installing a plugin.

## `uninstall_plugin`

Uninstall a previously installed plugin.

```bash
zou uninstall-plugin --id my_plugin
```

**Options:**

* `--id`: Plugin ID to uninstall (required).

**Note:** This removes plugin files and unregisters its migrations.
It will remove all your data

## `create_plugin_skeleton`

Generate the basic structure of a plugin. It will allow to start quickly your
plugin development.

```bash
zou create-plugin-skeleton --path ./plugins --id my_plugin
```

**Options:**

* `--path`: Directory where the plugin will be created (required).
* `--id`: Unique plugin ID (required).
* `--name`: Human-readable plugin name (default: `"MyPlugin"`).
* `--description`: Short description (default: `"My plugin description."`).
* `--version`: Semantic version string (default: `"0.1.0"`).
* `--maintainer`: Contact info (default: `"Author <author@author.com>"`).
* `--website`: Plugin/project website (default: `"mywebsite.com"`).
* `--license`: License (default: `"GPL-3.0-only"`).
* `--force`: Overwrite if directory exists (default: `False`).

This command generates:

* `manifest.toml` with plugin metadata
* Initial folder structure for code, migrations, etc.

## `create_plugin_package`

Package a plugin folder into a zip file, ready for installation.

```bash
zou create-plugin-package --path ./plugins/my_plugin --output-path ./dist
```

**Options:**

* `--path`: Plugin source folder (required).
* `--output-path`: Destination folder for the `.zip` (required).
* `--force`: Overwrite existing archive if present (default: `False`).

## `list_plugins`

List all currently installed plugins.

```bash
zou list-plugins
```

**Options:**

* `--format`: `table` or `json` (default: `table`).
* `--verbose`: Show more metadata.
* `--filter-field`: Filter by a specific field (`plugin_id`, `name`, `maintainer`, `license`).
* `--filter-value`: Value to search in the selected field.

## `migrate_plugin_db`

Run database migrations for a plugin.

```bash
zou migrate-plugin-db --path ./plugins/my_plugin
```

**Options:**

* `--path`: Path to the plugin folder (required).
* `--message`: Optional migration message (default: `""`).

This generates and applies Alembic migration scripts for the plugin’s database schema.
