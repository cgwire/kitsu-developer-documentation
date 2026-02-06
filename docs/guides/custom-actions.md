# Custom Actions

Custom Actions provide a lightweight integration mechanism between Kitsu and external systems. A Custom Action triggers an HTTP request (typically `POST`, optionally `GET`) from the Kitsu web UI to an endpoint you control, passing contextual data about the current user, project, and selection.

Custom actions allow developers to extend Kitsu’s behavior without modifying Kitsu or Zou core code:

1. A user selects entities in the Kitsu UI
1. The user runs a Custom Action
1. Kitsu sends a request to your endpoint with structured JSON payload
1. Your service processes the request and performs whatever action you define

## Use Cases

Custom Actions are intentionally generic. Any workflow that can be triggered by an HTTP request is a valid use case, for example:

* Debug or inspection endpoints that display all available metadata for selected entities
* Launching renders via external schedulers (e.g. CGRU, Flamenco)
* Generating production or APM statistics
* Creating playlists or collections based on task selections
* Triggering local or custom protocols to launch DCCs or video players
* Integrating with external asset managers (e.g. opening Kabaret at a specific context)

As long as your service can receive and handle an HTTP request (for example via Flask, FastAPI, Tornado, etc.), it can be integrated as a Custom Action.

For more advanced use cases requiring complex UI, [refer to the Kitsu plugin system]().

## Permissions

Only **Studio Managers** can create or manage Custom Actions.

The Custom Actions configuration page is available in the **Admin** section of the Kitsu dashboard, in the right-hand panel.

## Creating a Custom Action

To create a new Custom Action, click the **Add** button in the Custom Actions page. Each action requires the following configuration:

* **Name** - Human-readable label shown in the Kitsu UI.

* **URL** - Target endpoint that will receive the request.
  Using the same domain as your Kitsu instance is strongly recommended to avoid CORS or authentication issues.

* **Entity Type** - Specifies which entity type the action applies to (e.g. assets, shots). The action will only be available when compatible entities are selected.

* **Use AJAX** - Determines whether the request is sent via AJAX (background request) or as a standard form submission.

Once created, the action appears in the **Run Custom Action** menu in the top action bar. Users can trigger it when they have a valid selection in asset or shot task lists.

## Request Format

The request body is sent as JSON with the following structure:

| Field           | Type          | Description                                   |
| --------------- | ------------- | --------------------------------------------- |
| `personid`      | string (UUID) | ID of the user triggering the action          |
| `personemail`   | string        | Email of the user triggering the action       |
| `projectid`     | string (UUID) | Project ID associated with the selection      |
| `currentpath`   | string        | Current URL path in the Kitsu web application |
| `currentserver` | string        | Hostname of the Kitsu instance                |
| `selection`     | string[]      | List of selected task IDs                     |
| `entitytype`    | string        | Entity type of the selected tasks             |

## Example Request Payload

```json
{
  "personid": "b01bae1e-f829-458a-a1eb-131bb66628cc",
  "personemail": "admin@example.com",
  "projectid": "fa4d7f04-b8e0-4518-8dbc-2f24997ca76e",
  "currentpath": "/productions/fa4d7f04-b8e0-4518-8dbc-2f24997ca76e/assets",
  "currentserver": "localhost",
  "selection": [
    "95c171e1-dfff-498f-93e3-548a739e3202"
  ],
  "entitytype": "asset"
}
```
