## Mattermost Integration

### Enable Incoming Webhooks, Custom Username, and Profile Picture for Webhooks

1. Ensure you are logged in as a system admin account on your Mattermost server.
2. Check if your Mattermost installation can receive incoming webhooks and set a custom username and profile picture for webhooks. 
   1. Go to "System Console" --> "Integrations" --> "Integration Management".
   
   ![Integration management](../img/mattermost/integration-management.png)
   
   2. Ensure the parameters "Enable incoming Webhooks", "Enable integrations to override usernames", and "Enable integrations to override profile picture icons" are set to true.

   ![Enable incoming webhooks](../img/mattermost/enable-incoming-webhooks.png)

### Set a Webhook in Mattermost

1. Ensure you are logged in as a system admin account on your Mattermost server.
2. Go to "Integrations" --> "Incoming Webhooks" --> "Add incoming Webhook".

   ![Add incoming webhook](../img/mattermost/add-incoming-webhook.png)

3. Create the incoming webhook:

   ![Create incoming webhook](../img/mattermost/create-incoming-webhook.png)

* **Title**: Kitsu
* **Description**: Kitsu
* **Channel**: You can create a new channel or use an existing one because the message will be sent to a user.
* **Lock to this channel**: Set to False.
* **Username**: Kitsu (this will be overridden by Kitsu).
* **Profile Picture**: Not important; it will be overridden by Kitsu.

4. After clicking "Save", Mattermost will generate a new URL. Copy this URL.

5. Paste the URL in the "Settings" of Kitsu under the text field "Mattermost Webhooks (optional)" and click "Save settings".

   ![Add mattermost webhook settings](../img/mattermost/add_mattermost_webhook_settings.png)

> **_Note:_** Users who want notifications enabled must be on the same Mattermost server used in these steps.

### Enable Mattermost Notifications

Each user can set notifications to be pushed to Mattermost in their profile. They need to switch "Mattermost notifications enabled" to "Yes" and enter their "Mattermost username".

![Add Mattermost username in profile](../img/mattermost/add_mattermost_username_profile.png)

You're done!
