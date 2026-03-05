# CLI Command Reference

## General

### `version`

Show installed Zou version.

```bash
zou version
```

## Database Management

### `init-db`

Create database tables (database must already exist).

```bash
zou init-db
```

### `is-db-ready`

Check if database is initialized.

```bash
zou is-db-ready
```

### `migrate-db`

Generate migration files to describe a new revision of the database schema (development only).

```bash
zou migrate-db --message "add new column"
```

**Options:**

* `--message`: Migration description (default: `""`).

### `downgrade-db`

Downgrade database to a previous schema revision (development only).

```bash
zou downgrade-db --revision -1
```

**Options:**

* `--revision`: Target revision (default: `"-1"`).

### `upgrade-db`

Upgrade database schema.

```bash
zou upgrade-db
```

**Options:**

* `--no-telemetry`: Disable anonymized statistics (default: `False`).

### `stamp-db`

Set the database schema revision without running migrations.

```bash
zou stamp-db --revision abc123
```

**Options:**

* `--revision`: Target revision hash (default: current).

### `clear-db`

Drop all tables from the database.

```bash
zou clear-db
```

### `reset-db`

Drop all tables, then recreate them.

```bash
zou reset-db
```

### `reset-migrations`

Reset migration state to base revision.

```bash
zou reset-migrations
```

## User & Authentication

### `create-admin`

Create an admin user or upgrade an existing user to admin.

```bash
zou create-admin admin@example.com --password mysecretpassword
```

**Arguments:**

* `email`: User email address (required).

**Options:**

* `--password`: Admin password.

### `change-password`

Change the password of a given user.

```bash
zou change-password user@example.com --password newpassword
```

**Arguments:**

* `email`: User email address (required).

**Options:**

* `--password`: New password (required).

### `set-person-as-active`

Activate or deactivate a user account.

```bash
zou set-person-as-active user@example.com
zou set-person-as-active user@example.com --unactive
```

**Arguments:**

* `email`: User email address (required).

**Options:**

* `--unactive`: Deactivate instead of activate (default: `False`).

### `disable-two-factor-authentication`

Disable two-factor authentication for a given user.

```bash
zou disable-two-factor-authentication user@example.com
```

**Arguments:**

* `email-or-desktop-login`: User email or desktop login (required).

### `clean-auth-tokens`

Remove revoked and expired authentication tokens.

```bash
zou clean-auth-tokens
```

### `clear-all-auth-tokens`

Remove all authentication tokens.

```bash
zou clear-all-auth-tokens
```

### `sync-with-ldap-server`

For each user account in your LDAP server, create a corresponding Kitsu user.

```bash
zou sync-with-ldap-server
```

### `create-bot`

Create a bot account for API automation.

```bash
zou create-bot --email bot@example.com --name "Pipeline Bot" --role user
```

**Options:**

* `--email`: Bot email address (required).
* `--name`: Bot display name (required).
* `--expiration-date`: Token expiration date in `YYYY-MM-DD` format.
* `--role`: Bot role (default: `"user"`).

## Data Initialization & Maintenance

### `init-data`

Generate the minimal data set required to run Kitsu (task statuses, types, etc.).

```bash
zou init-data
```

### `remove-old-data`

Remove old events, notifications, and login logs.

```bash
zou remove-old-data --days 90
```

**Options:**

* `--days`: Remove data older than this many days (default: `90`).

### `clean-tasks-data`

Reset task model data (retake count, WIP start date, and end date).

```bash
zou clean-tasks-data --project-id a24a6ea4-ce75-4665-a070-57453082c25
```

**Options:**

* `--project-id`: Limit to a specific project. If omitted, applies to all projects.

### `reset-search-index`

Reset the full-text search index.

```bash
zou reset-search-index
```

### `search-asset`

Search for assets in the index.

```bash
zou search-asset --query "main character"
```

**Options:**

* `--query`: Search query string (default: `""`).

## Instance Synchronization

Requires `SYNC_LOGIN` and `SYNC_PASSWORD` environment variables.

### `sync-full`

Retrieve all data from a source instance.

```bash
zou sync-full --source https://source-kitsu.com/api --project "My Project"
```

**Options:**

* `--source`: Source instance API URL (default: `"http://localhost:5000"`).
* `--project`: Sync only a specific project by name.
* `--no-projects`: Skip project data (default: `False`).
* `--with-events`: Include event history (default: `False`).
* `--only-projects`: Sync project data only, skip everything else (default: `False`).

### `sync-full-files`

Retrieve all files from a source instance.

```bash
zou sync-full-files --source https://source-kitsu.com/api --multithreaded
```

**Options:**

* `--source`: Source instance API URL (default: `"http://localhost:5000"`).
* `--project`: Sync files for a specific project only.
* `--multithreaded`: Enable parallel downloads (default: `False`).
* `--number-workers`: Number of parallel workers (default: `30`).
* `--number-attemps`: Number of retry attempts per file (default: `3`).
* `--force-resync`: Re-download files that already exist locally (default: `False`).

### `sync-changes`

Run a daemon that imports data for any change happening on the source instance.

```bash
zou sync-changes --event-source https://source-kitsu.com --source https://source-kitsu.com/api
```

**Options:**

* `--event-source`: Source instance event stream URL (default: `"http://localhost:8080"`).
* `--source`: Source instance API URL (default: `"http://localhost:8080/api"`).
* `--logs-directory`: Directory for sync logs.

### `sync-file-changes`

Run a daemon that downloads files for any change happening on the source instance.

```bash
zou sync-file-changes --event-source https://source-kitsu.com --source https://source-kitsu.com/api
```

**Options:**

* `--event-source`: Source instance event stream URL (default: `"http://localhost:8080"`).
* `--source`: Source instance API URL (default: `"http://localhost:8080/api"`).
* `--logs-directory`: Directory for sync logs.

### `sync-last-events`

Retrieve recent events from a source instance and import related data.

```bash
zou sync-last-events --source https://source-kitsu.com/api --minutes 30
```

**Options:**

* `--source`: Source instance API URL (default: `"http://localhost:8080/api"`).
* `--minutes`: Sync events from the last N minutes (default: `0`).
* `--page-size`: Number of events per page (default: `300`).

### `sync-last-files`

Retrieve recent preview files and thumbnails from a source instance.

```bash
zou sync-last-files --source https://source-kitsu.com/api --minutes 60
```

**Options:**

* `--source`: Source instance API URL (default: `"http://localhost:8080/api"`).
* `--minutes`: Sync files from the last N minutes (default: `20`).
* `--page-size`: Number of files per page (default: `50`).

## Storage & Backups

### `download-storage-files`

Download all files from a Swift object storage and store them locally.

```bash
zou download-storage-files
```

### `dump-database`

Dump the database. Optionally upload the dump to configured object storage.

```bash
zou dump-database --store
```

**Options:**

* `--store`: Upload the dump to remote object storage (default: `False`).

### `upload-files-to-cloud-storage`

Upload preview files to configured object storage.

```bash
zou upload-files-to-cloud-storage --days 7
```

**Options:**

* `--days`: Only upload files from the last N days. If omitted, uploads all files.

## Preview & Media Maintenance

### `generate-preview-extra`

Generate tiles, thumbnails, and metadata for previews.

```bash
zou generate-preview-extra --project "My Project" --with-tiles --with-thumbnails
```

**Options:**

* `--project`: Limit to a specific project by name.
* `--entity-id`: Limit to a specific entity by UUID.
* `--episode`: Limit to specific episodes (can be repeated).
* `--only-shots`: Process only shot previews (default: `False`).
* `--only-assets`: Process only asset previews (default: `False`).
* `--with-tiles`: Generate tile images (default: `False`).
* `--with-metadata`: Generate metadata (default: `False`).
* `--with-thumbnails`: Generate thumbnails (default: `False`).
* `--force-regenerate-tiles`: Regenerate tiles even if they already exist (default: `False`).

### `reset-movie-files-metadata`

Store height and width metadata for all movie previews in the database.

```bash
zou reset-movie-files-metadata
```

### `reset-picture-files-metadata`

Store height and width metadata for all picture previews in the database.

```bash
zou reset-picture-files-metadata
```

### `renormalize-movie-preview-files`

Renormalize movie preview files.

```bash
zou renormalize-movie-preview-files --project-id a24a6ea4-ce75-4665-a070-57453082c25
```

**Options:**

* `--preview-file-id`: Renormalize a single preview file by UUID.
* `--project-id`: Limit to a specific project by UUID.
* `--all-broken`: Renormalize all broken preview files (default: `False`).
* `--all-processing`: Renormalize all files stuck in processing state (default: `False`).
* `--days`: Renormalize files from the last N days.
* `--hours`: Renormalize files from the last N hours.
* `--minutes`: Renormalize files from the last N minutes.

### `reset-breakdown-data`

Reset breakdown statistics for all open projects.

```bash
zou reset-breakdown-data
```

## Cache

### `clear-memory-cache`

Clear the Redis memory cache.

```bash
zou clear-memory-cache
```

## Plugin Management

### `install-plugin`

Install a plugin from a local folder, `.zip` archive, or git repository URL.

```bash
zou install-plugin --path /path/to/plugin
zou install-plugin --path ./dist/my-plugin.zip
zou install-plugin --path https://github.com/cgwire/kitsu-tickets.git
```

**Options:**

* `--path`: Path to the plugin folder, `.zip` archive, or git URL (required).
* `--force`: Overwrite if already installed (default: `False`).

**Note:** Restart the Zou server after installing a plugin.

### `uninstall-plugin`

Uninstall a previously installed plugin.

```bash
zou uninstall-plugin --id my_plugin
```

**Options:**

* `--id`: Plugin ID to uninstall (required).

::: warning
This removes plugin files and unregisters its migrations. Database tables created by the plugin are not dropped automatically — remove them manually if needed.
:::

### `create-plugin-skeleton`

Generate the basic structure of a new plugin.

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
* `--license`: License identifier (default: `"GPL-3.0-only"`).
* `--icon`: Lucide icon name.
* `--force`: Overwrite if directory exists (default: `False`).

### `create-plugin-package`

Package a plugin folder into a zip file, ready for installation.

```bash
zou create-plugin-package --path ./plugins/my_plugin --output-path ./dist
```

**Options:**

* `--path`: Plugin source folder (required).
* `--output-path`: Destination folder for the `.zip` (required).
* `--force`: Overwrite existing archive if present (default: `False`).

### `list-plugins`

List all currently installed plugins.

```bash
zou list-plugins
zou list-plugins --format json --verbose
```

**Options:**

* `--format`: Output format, `table` or `json` (default: `"table"`).
* `--verbose`: Show more metadata (default: `False`).
* `--filter-field`: Filter by a specific field (`plugin_id`, `name`, `maintainer`, `license`).
* `--filter-value`: Value to search in the selected field.

### `migrate-plugin-db`

Generate and apply database migrations for a plugin.

```bash
zou migrate-plugin-db --path ./plugins/my_plugin
```

**Options:**

* `--path`: Path to the plugin folder (required).
* `--message`: Optional migration message (default: `""`).
