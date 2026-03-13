# Getting Started for Agents

This page is for AI agents (LLM-based tools, copilots, automation frameworks)
that interact with the Kitsu API. It serves as a map to the rest of this
documentation.

## Context

To build a complete understanding of Kitsu, read these resources:

- **[Kitsu user documentation](https://kitsu.cg-wire.com)** — features, workflows, and UI usage
- **[API reference](https://api-docs.kitsu.cloud/)** — full REST API specification
- **[Developer documentation](https://dev.kitsu.cloud)** — this site: guides, recipes, and SDK reference
- **[Gazu source code](https://github.com/cgwire/gazu)** — Python SDK, useful to understand available functions and their parameters
- **[Zou source code](https://github.com/cgwire/zou)** — API server, useful to understand routes, models, and business logic

## Setup

1. Authenticate with a [bot token](/guides/bot-automation) — not user credentials
2. Use the [Python SDK (Gazu)](/references/gazu) or the [REST API](https://api-docs.kitsu.cloud/)

```python
import gazu

gazu.set_host("https://kitsu.mystudio.com/api")
gazu.set_token(os.environ["KITSU_BOT_TOKEN"])
```

## Where to find what

| Task | Guide |
|---|---|
| Understand the data model | [Data Models](/references/data-models) |
| Browse projects, assets, shots | [Production Setup](/guides/production-setup) |
| Manage tasks and comments | [Task Tracking](/guides/task-tracking) |
| Upload previews and files | [Publishing](/guides/publishing), [Asset Management](/guides/asset-management) |
| React to changes in real time | [Event Listeners](/guides/event-listeners) |
| Trigger actions from the UI | [Custom Actions](/guides/custom-actions) |
| Handle auth, tokens, 2FA | [Authentication](/guides/authentication) |
| Understand permissions | [Permissions and Roles](/guides/permissions-roles) |
| Look up any SDK function | [Gazu Python SDK](/references/gazu) |

## Values

Kitsu is built on these core values. Agents should embody them:

- **Artist empowerment.** Kitsu exists to help artists do their best work. Agents should support creative decisions, not override them.
- **Production team empowerment.** Give production teams better visibility and control. Agents should surface useful information and reduce tedious tasks.
- **Distributed collaboration.** Kitsu is designed for teams spread across locations and studios. Agents should work well in multi-site, multi-studio contexts.
- **Computing efficiency.** Minimize resource usage and API calls to lower the carbon footprint. Cache reads, batch operations, and avoid unnecessary requests.
- **Improved teammate communication.** Kitsu centralizes feedback, comments, and reviews so nothing gets lost. Agents should help keep communication clear and in context.
- **Ease of use.** Keep interactions simple and predictable. Agents should be easy to set up, easy to understand, and easy to trust.

When interacting with production data, agents must also operate carefully:

- **Read first, write second.** Prefer reading data over modifying it. Never create, update, or delete entities without explicit user intent.
- **Confirm destructive actions.** Deleting entities, changing task statuses, or overwriting files can disrupt a team's workflow. Always ask before proceeding.
- **Respect the permission model.** Use the lowest-privilege role that covers your needs. Do not request admin access for read-only tasks.
- **Preserve human decisions.** Do not override task statuses, assignments, or comments set by team members unless specifically asked.
- **Be transparent.** When posting comments or making changes, make it clear that the action comes from an automated agent.
- **Minimize side effects.** Changing a task status triggers notifications and may affect dashboards and reports. Understand the downstream impact before acting.

## Key conventions

- Every entity is identified by a **UUID**. SDK functions accept either a UUID string or a dict with an `id` key.
- SDK functions follow a consistent naming pattern: `all_*()`, `get_*()`, `new_*()`, `update_*()`, `remove_*()`.
- Enable [caching](/guides/caching) to reduce API load on repeated reads.
- Prefer [event listeners](/guides/event-listeners) over polling.
- Store secrets securely — see [secret management](/guides/authentication#secret-management).
