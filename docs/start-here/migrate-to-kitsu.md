# Migrate To Kitsu

This guide provides a high-level overview for developers migrating an existing production tracking system to **Kitsu**, CGWire's open-source production management platform for animation, VFX, and games.

It focuses on concepts, recommended migration steps, and technical entry points. For studio-specific assistance, [CGWire provides professional support for setup and migration: don't hesitate to reach out]((https://www.cg-wire.com/contact)).

## Overview

Kitsu is designed to integrate cleanly into existing studio pipelines. It offers:

* A structured production data model
* A REST API for automation and integration
* Flexible workflows for assets, shots, and tasks
* Compatibility with custom tools and DCC integrations

Most migrations involve mapping an existing data schema (spreadsheets, in-house tools, or third-party trackers) to Kitsu's core entities and importing data using the API or dashboard.

## 1. Core Concepts

Before migrating, you need to get familiar with Kitsu's data model:

* **Projects** - Top-level containers representing productions.
* **Assets and Shots** - Primary production entities tracked within a project.
* **Tasks** - Units of work associated with assets or shots.
* **Task Types and Statuses** - Customizable workflow definitions controlling production states.
* **People and Departments** - Users, roles, and permissions.
* **Comments and Time Logs** - Communication and production tracking history.

[The API manual](https://api-docs.kitsu.cloud/) includes all the references you'll need regarding API capabilities and data schema specifications.

Understanding how your existing system maps to these concepts is critical for a successful migration.

## 2. Data Preparation

Prior to importing data into Kitsu:

1. Audit your existing production data.
2. Identify entities to migrate (projects, assets, shots, tasks, users, etc.).
3. Normalize naming conventions and identifiers.
4. Decide whether historical data should be migrated or archived.
5. Export data in a structured format (e.g., JSON or CSV).

Recommendation: Migrate structural data (projects, task types, statuses) before importing production content.

## 3. Kitsu Setup

Kitsu can be deployed via Cloud setup or self-hosted, depending on your requirements.

Initial setup typically includes:

* Database configuration
* Authentication setup
* Project configuration
* Task types and status workflows
* User roles and permissions

It is strongly recommended to create a test project via [the development-friendly Docker install](/start-here/docker) and validate the configuration before migrating production data.

## 4. Migrating Data Using the API

Kitsu provides a REST API that enables programmatic access to all core entities.

Migration scripts for Kitsu are commonly written in Python and follow this pattern:

1. Export source data
2. Transform data to match Kitsu's schema
3. Create or update entities using the API
4. Load data in controlled batches

This approach allows repeatable test migrations prior to final production rollout.

## 5. Validation and Testing

After importing data:

* Verify assets, shots, and tasks
* Confirm task statuses and workflow behavior
* Validate user permissions and assignments
* Review data accuracy with production stakeholders

Multiple dry runs are recommended to ensure reliability before the final migration.

## 6. Production Cutover

When ready to go live:

1. Freeze updates in the legacy system
2. Perform the final migration
3. Transition active production to Kitsu
4. Archive or decommission the previous system

## Professional Migration Support

Every studio pipeline is unique. CGWire provides professional services to assist with:

* Kitsu installation and configuration
* Workflow and data model design
* Migration planning and scripting
* Integration with existing pipeline tools
* Minimizing production downtime during transition

[Contact the CGWire team for setup and migration assistance!](https://www.cg-wire.com/contact)
