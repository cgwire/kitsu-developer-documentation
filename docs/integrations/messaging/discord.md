# Chat Integration

## Discord Integration

### Create a Bot Account

1. Ensure you're logged on to the [Discord website](https://discord.com/).
2. Navigate to the [application page](https://discord.com/developers/applications).
3. Click on the "New Application" button.
4. Give the application a name (for example, "Kitsu") and click "Create".

![Create application](../img/discord/create_application.png)

5. Create a Bot User by navigating to the "Bot" tab and clicking "Add Bot".
    - Click "Yes, do it!" to continue.

![Create bot](../img/discord/create_bot_user.png)

6. You can add an icon for the bot by clicking the icon next to "Username". This icon will be used when the bot chats.

7. Ensure that "Public Bot" is ticked if you want others to invite your bot.

![Public Bot ticked](../img/discord/public_bot.png)

8. Ensure the "Server Members Intent" is ticked to allow the bot to see other members.

![Server Members Intent ticked](../img/discord/server_members_intent.png)

9. Copy the token using the "Copy" button. 

10. Paste the token in Kitsu's "Settings" under the text field "Discord token (optional)" and click "Save settings".

![Add discord token to settings](../img/discord/add_discord_token_settings.png)

### Inviting Your Bot

Now that you've created a Bot User, you need to add it to a server. Follow these steps:

1. Ensure you're logged on to the [Discord website](https://discord.com/).
2. Navigate to the [application page](https://discord.com/developers/applications).
3. Click on your bot’s page.
4. Go to the "OAuth2" tab and then to "URL Generator".
5. In "Scopes", tick "bot" only.

![URL Generator Scopes](../img/discord/url_generator_scopes.png)

6. In "Bot Permissions", tick "Send Messages" only.

![URL Generator Bot permissions](../img/discord/bot_permissions.png)

7. Use the resulting URL to add your bot to a server. Copy and paste the URL into your browser, choose a server to invite the bot to, and click "Authorize".

> **_Note:_** To add the bot, the person needs "Manage Server" permissions.

> **_Note:_** Users who want notifications enabled must be on the same server as the bot.

### Enable Discord Notifications

Each user can set notifications to be pushed to Discord in their profile. They need to switch "Discord notifications enabled" to "Yes" and enter their "Discord username" (formatted as username#number).

![Add discord username in profile](../img/discord/add_discord_username_profile.png)

You're done!
