# Creating and Structuring a Production

This section describes how a developer can use the Kitsu API to create, structure, and configure a production. It follows a typical studio workflow, from initial project setup to defining assets, shots, tasks, and metadata that support pipeline automation and reporting.

The goal is to help you understand which data models exist in Kitsu and how they fit together in a real production environment.

## Typical Studio Workflow Overview

Most studios use Kitsu as a central production database that multiple tools and teams interact with. From a developer’s perspective, Kitsu usually sits at the intersection of:

- **Team management** - Tracking users, departments, roles, and responsibilities across one or more projects.
- **Pipeline tracking** - Managing tasks, statuses, and progress for assets and shots as they move through the pipeline.
- **Asset management** - Organizing characters, props, sets, and other production elements in a consistent, queryable structure.
- **Review engine** - Connecting published work, previews, and statuses to reviews and approvals.
- **Reporting** - Extracting structured data for schedules, progress tracking, capacity planning, and analytics.

The API allows you to automate these workflows, synchronize external tools (DCCs, asset builders, render farms), and enforce studio-wide conventions.

## 1. Production Setup via the API

The first step in any workflow is creating a project and assigning the core entities that will work on it.

### Creating a Project

A project represents a single production. When creating a project via the API, you typically define:

* Project name and code
* Production type: short, feature film, tv show
* Production style: 2d, 3d, 2d3d, ar, vfx, stop-motion, motion-design, archviz, commercial, catalog, immersive, nft, video-game, vr
* Start and end dates
* Default configuration inherited from the studio

```py
```

This project becomes the root container for all assets, shots, tasks, and metadata.

### Assigning Studios, Departments, and Users

Once a project exists, it must be connected to the people and organizational structure that will use it:

- **Studios** define the top-level organization.
- **Departments** (modeling, rigging, animation, lighting, etc.) define how work is divided.
- **Users** are assigned to possibly multiple departments and projects, but only one studio, with specific roles and permissions.

Associate departments with the project:

```py
```

Add users to the project:

```py
```

Assign roles that control visibility and edit rights ([check the Access Control guide](/guides/access-control) for more info):

```py
```

## 2. Defining the Production Structure

Once the project exists, the next step is defining what is being produced and how work is organized.

### Defining Shot Structure

Work is usually organized hierarchically into episodes (optional, for episodic productions), sequences, and shots.

Create episodes and sequences:

```py

```

Create shots within sequences:

```py

```

Query or update shots:

```py

```

This hierarchy is critical for scheduling, task assignment, and reporting.

### Establishing Asset Types

Assets represent reusable production elements. Kitsu supports both standard and custom asset types like characters, props, sets / environments, vehicles, FX elements... or any studio-specific category.

Asset types define how assets are grouped, which tasks and statuses apply to them, and how they integrate with the pipeline.

Create or configure asset types:

```py
```

### Establishing Task Types and Statuses

Tasks represent units of work (modeling, rigging, animation, etc.), while statuses represent progress (to do, in progress, review, approved, etc.).

Define task types per department:

```py
```

Assign tasks to assets or shots:

```py
```

Control which statuses are available:

```py
```

You can also [update task status automatically based on pipeline events with webhooks](/guides/webhooks).

This structure enables consistent tracking across teams and tools.

## 3. Managing Metadata

Most studios need to track data that goes beyond built-in fields. Kitsu supports this through metadata descriptors: extra fields listed in the data attribute of entities.

### Defining Metadata Descriptors

```py
```

### Using Metadata Descriptors

Meta columns allow you to attach structured data to assets, shots, and tasks. Common use cases include:

* Technical specifications
* Pipeline flags
* External IDs
* Delivery requirements

You can then visualize the metadata in the Kitsu dashboard or by reading the metadata field of an entity.

### Reading and Writing Metadata via the API

Writing metadata to an asset:

```py
```

## Next Steps

Once a production is structured and configured, you can move on to people and permissions.
