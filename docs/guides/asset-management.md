# Managing Assets and Shots

## 1. Core Concepts

Before diving into workflows, it’s important to understand how Kitsu represents production data.

* **Assets** – reusable production elements (characters, props, environments, etc.)
* **Shots** – time-based units of work within a sequence
* **Asset Typess** – classification and categorization
* **Tasks** – units of work attached to assets or shots
* **Files** – published media or work files linked to entities
* **Versions** – iterations of published work

* How assets relate to shots
* How tasks, files, and versions attach to assets and shots
* Project and production scoping

## 2. Creating Assets and Shots

Programmatically create assets and shots when setting up a new project, sequence, or pipeline stage.

* Creating assets with a specific asset type
* Creating shots within a sequence
* Setting initial metadata at creation time
* Assigning assets or shots to a project

```py
create asset
```

## 3. Updating Assets

Modify existing entities as production evolves.

```py
update asset
```

## 4. Managing Descriptions, Tags, and Custom Fields

Store production-specific or studio-specific data directly on assets and shots.

* Text descriptions
* Tagging assets and shots for organization
* Using custom fields for pipeline data (e.g. LOD, render complexity, department notes)

```py
setting custom metadata on an asset
```

## 5. Linking Assets to Shots

Define which assets are used in which shots to enable tracking, dependency analysis, or automation.

* Creating relationships between assets and shots
* Updating asset–shot links
* Querying linked entities

```py
link assets to shots
```

## 6. Managing Files and Versions

Track published work, iterations, and approvals.

* Attaching files to assets or shots
* Creating new versions
* Managing version metadata (comments, status, author)

```py
One code example: creating a preview
```

## 7. Archiving or Deleting Assets and Shots

Clean up or retire entities without losing production history.

```py
One code example: deleting an asset
```

## 8. Querying and Filtering Large Datasets

Efficiently retrieve and process large amounts of production data.

* Filtering by type, status, tags, or custom fields
* Pagination and batching
* Sorting and searching

```py
One code example: searching an asset by type and task status
```
