# CLI Command Reference

## General

| Command       | Description                |
| ------------- | -------------------------- |
| `zou version` | Show installed Zou version |

## Database Management

| Command                           | Description                                    |
| --------------------------------- | ---------------------------------------------- |
| `zou init-db`                     | Create database tables (DB must already exist) |
| `zou is-db-ready`                 | Check if database is initialized               |
| `zou migrate-db --message ""`     | Generate migration (dev only)                  |
| `zou downgrade-db --revision -1`  | Downgrade DB (dev only)                        |
| `zou upgrade-db [--no-telemetry]` | Upgrade DB schema                              |
| `zou stamp-db [--revision HASH]`  | Set DB schema revision                         |
| `zou clear-db`                    | Drop all tables                                |
| `zou reset-db`                    | Drop and recreate all tables                   |
| `zou reset-migrations`            | Reset migration state to base                  |

## User & Authentication

| Command                                       | Description                   |
| --------------------------------------------- | ----------------------------- |
| `zou create-admin EMAIL --password PASS`      | Create or upgrade admin user  |
| `zou change-password EMAIL --password PASS`   | Change user password          |
| `zou set-person-as-active EMAIL [--unactive]` | Activate/deactivate user      |
| `zou disable-two-factor-authentication EMAIL` | Disable 2FA                   |
| `zou clean-auth-tokens`                       | Remove revoked/expired tokens |
| `zou clear-all-auth-tokens`                   | Remove all auth tokens        |
| `zou sync-with-ldap-server`                   | Sync users from LDAP          |
| `zou create-bot --email --name [options]`     | Create bot account            |

## Data Initialization & Maintenance

| Command                                | Description                       |
| -------------------------------------- | --------------------------------- |
| `zou init-data`                        | Generate minimal required dataset |
| `zou remove-old-data --days 90`        | Remove old events/logs            |
| `zou clean-tasks-data --project-id ID` | Reset task stats                  |
| `zou reset-search-index`               | Reset search index                |
| `zou search-asset --query ""`          | Search for assets                 |

## Instance Synchronization

Requires `SYNC_LOGIN` and `SYNC_PASSWORD` environment variables.

| Command                            | Description                          |
| ---------------------------------- | ------------------------------------ |
| `zou sync-full [options]`          | Full data sync from another instance |
| `zou sync-full-files [options]`    | Full file sync                       |
| `zou sync-changes [options]`       | Run change sync daemon               |
| `zou sync-file-changes [options]`  | Run file sync daemon                 |
| `zou sync-last-events --minutes N` | Sync recent events                   |
| `zou sync-last-files --minutes N`  | Sync recent files                    |

## Storage & Backups

| Command                                      | Description                         |
| -------------------------------------------- | ----------------------------------- |
| `zou download-storage-files`                 | Download files from object storage  |
| `zou dump-database [--store]`                | Dump DB (optionally store remotely) |
| `zou upload-files-to-cloud-storage --days N` | Upload preview files                |

## Preview & Media Maintenance

| Command                                         | Description                          |
| ----------------------------------------------- | ------------------------------------ |
| `zou generate-preview-extra [options]`          | Generate tiles, thumbnails, metadata |
| `zou reset-movie-files-metadata`                | Fix movie preview metadata           |
| `zou reset-picture-files-metadata`              | Fix image preview metadata           |
| `zou renormalize-movie-preview-files [options]` | Renormalize preview files            |
| `zou reset-breakdown-data`                      | Reset project breakdown stats        |

## Cache

| Command                  | Description       |
| ------------------------ | ----------------- |
| `zou clear-memory-cache` | Clear Redis cache |

## Plugin Management

### `install_plugin`

Install a plugin from a local folder or `.zip` package.

```bash
zou install-plugin --path /path/to/plugin
```

**Options:**

* `--path`: Path to the plugin folder or `.zip` archive (required).
* `--force`: Overwrite if already installed (default: `False`).

**Note:** You need to restart the Zou server after installing a plugin.

### `uninstall_plugin`

Uninstall a previously installed plugin.

```bash
zou uninstall-plugin --id my_plugin
```

**Options:**

* `--id`: Plugin ID to uninstall (required).

**Note:** This removes plugin files and unregisters its migrations.
It will remove all your data

### `create_plugin_skeleton`

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

### `create_plugin_package`

Package a plugin folder into a zip file, ready for installation.

```bash
zou create-plugin-package --path ./plugins/my_plugin --output-path ./dist
```

**Options:**

* `--path`: Plugin source folder (required).
* `--output-path`: Destination folder for the `.zip` (required).
* `--force`: Overwrite existing archive if present (default: `False`).

### `list_plugins`

List all currently installed plugins.

```bash
zou list-plugins
```

**Options:**

* `--format`: `table` or `json` (default: `table`).
* `--verbose`: Show more metadata.
* `--filter-field`: Filter by a specific field (`plugin_id`, `name`, `maintainer`, `license`).
* `--filter-value`: Value to search in the selected field.

### `migrate_plugin_db`

Run database migrations for a plugin.

```bash
zou migrate-plugin-db --path ./plugins/my_plugin
```

**Options:**

* `--path`: Path to the plugin folder (required).
* `--message`: Optional migration message (default: `""`).

This generates and applies Alembic migration scripts for the plugin’s database schema.
