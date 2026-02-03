# Slack Integration

The Slack integration requires creating a dedicated application in your Slack space. The following steps will guide you through the process.

### Create a Kitsu Application in Slack

To start, connect to [https://api.slack.com/apps](https://api.slack.com/apps).

Click the "Create New App" button:

![Create new app](../img/slack/slack_create_app_01.png)

Enter "Kitsu" as the name and choose the workspace you want to link with your Kitsu instance:

![Choose workspace](../img/slack/slack_create_app_02.png)


### Set the Right Permissions

After creating the app, go to the app page by clicking on its name in the list. Go to the *Basic Information* section and click on the *Permissions* button at the bottom right:

![Permissions button](../img/slack/slack_create_app_03.png)

In the scopes section, add the required permission:

![Add scope](../img/slack/slack_create_app_04.png)

The required permission scope is `chat:write:bot`:

![Permission scope](../img/slack/slack_create_app_05.png)


### Install the App in Your Workspace

Proceed to the app installation in the workspace. Go to the *Install App* section and click on **Install App To Workspace** button to install:

![Install app](../img/slack/slack_create_app_06.png)

Confirm the installation:

![Confirm installation](../img/slack/slack_create_app_07.png)

Your Kitsu Slack App is now up and running! You just need to link your Kitsu to the notifications sent to your Slack workspace.

### Get the Token

Return to the *Install App* section. You should see the token needed to link your Kitsu instance to Slack:

![Get token](../img/slack/slack_create_app_08.png)

### Link Kitsu to Your New Slack Application

With your valid token, go to the settings page in Kitsu and enter the token:

![Add token in settings](../img/slack/slack_kitsu_settings.png)

### Enable Slack Notifications in Your Profile

Finally, go to your profile section to turn on Slack notifications. Enter the Member ID you use on Slack, which you can find in your Slack profile by clicking on "More":

![Find member ID](../img/slack/slack_display_name1.png)

![Member ID](../img/slack/slack_display_name2.png)

In your Kitsu profile, set the Slack notifications to "on" and enter your Slack nickname:

![Configure Slack notifications](../img/slack/slack_configuration.png)

You can now enjoy notifications directly in your Slack workspace!

![Slack notifications](../img/slack/slack_kitsu_notifications.png)
