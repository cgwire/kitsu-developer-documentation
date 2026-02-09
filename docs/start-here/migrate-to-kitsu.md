# Migrate To Kitsu

This guide provides a high-level overview for developers migrating an existing production tracking system to **Kitsu**, CGWire's open-source production management platform for animation, VFX, and games.

Most tool migrations involve mapping an existing data schema (spreadsheets, in-house tools, or third-party trackers) to Kitsu's data model and importing data using the API or dashboard.

For studio-specific assistance, [CGWire provides professional support for setup and migration: don't hesitate to reach out]((https://www.cg-wire.com/contact)).

## 1. Core Concepts

Before migrating, you need to get familiar with Kitsu's data model:

* **Projects** - Top-level containers representing productions.
* **Assets and Shots** - Primary production entities tracked within a project.
* **Tasks** - Units of work associated with assets or shots.
* **Task Types and Statuses** - Customizable workflow definitions controlling production states.
* **People and Departments** - Users, roles, and permissions.
* **Comments and Time Logs** - Communication and production tracking history.

[The API manual](https://api-docs.kitsu.cloud/) includes all the references you'll need regarding API capabilities and data schema specifications.

## 2. Data Preparation

Prior to importing data into Kitsu:

1. Audit your existing production data.
2. Map entities to migrate (projects, assets, shots, tasks, users, etc.).
3. Normalize naming conventions.
4. Decide whether historical data should be migrated or archived.
5. Export data in a structured format (e.g., JSON or CSV).

::: warning
You'll need to migrate structural data (project settings, departments, task types, statuses, etc.) before importing production content.
:::

## 3. Kitsu Setup

Kitsu can be deployed via Cloud setup or self-hosted, depending on your requirements.

Initial setup typically includes:

* Database configuration
* Authentication setup
* Project and department settings
* Task types and status workflows

It is strongly recommended to create a test project via [the developer-friendly Docker install](/start-here/docker) and validate the configuration before migrating production data.

## 4. Migrating Data Using the API

Kitsu provides a REST API for programmatic access to all core data models.

Migration scripts for Kitsu are commonly written in Python and follow this pattern:

1. Export source data
2. Transform data to match Kitsu's schema
3. Create or update entities using the API
4. Load data in controlled batches

This is how we can test migrations prior to final production rollout in a consistent way.

## 5. Validation and Testing

After importing data we can use the dashboard or automated tests to validate the migration.

Multiple dry runs are recommended to ensure reliability before the final migration.

## 6. Production Cutover

When ready to go live:

1. Freeze updates in the legacy system
2. Perform the final migration
3. Transition active productions to Kitsu
4. Archive the previous system

## Professional Migration Support

Every studio pipeline is unique. CGWire provides professional services to assist with:

* Kitsu installation and configuration
* Workflow and data model design
* Migration planning and scripting
* Integration with existing pipeline tools
* Minimizing production downtime during transition

[Contact the CGWire team for setup and migration assistance!](https://www.cg-wire.com/contact)
