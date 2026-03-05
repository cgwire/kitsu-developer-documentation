# Bots

Bots in Kitsu are non-physical users that can perform automated tasks, allowing you to run scripts and interact with Kitsu's API without logging in as a real user. 

::: tip
Bots do not count as active users, so you can create as many as you need regardless of your subscription plan.
:::

## Why Use a Bot

The primary use of bots is for scripting with Gazu or other applications that can use the Kitsu API.

**Key Benefits:**

- Limit access scopes to increase system security
- Automate tasks
- Interact with Kitsu's API

## How to Create a Bot

1. **Navigate to the Bots Page:** On the Main Menu, under the Admin section, go to the Bots page.
2. **Add a New Bot:** Click on the `New Bots` button. A pop-up window will appear where you can fill in the bot's details.
    - **Name:** Give your bot a name.
    - **Expiration Date:** Set an expiration date if needed.
    - **Departments:** Link the bot to a specific department.
    - **Role:** Define the role of the bot.
    - **Active:** Choose whether the bot is active or inactive.
3. **Create the Bot:** Fill in the details and click **Create user**.

 A new pop-up will display the bot's **API token**.

::: warning
This token is crucial for connecting to the API, so make sure to keep it safe.

[Read about secret management in the Authentication guide](/guides/authentication#secret-management).
:::

## Managing Bots

On the Bots page, you can manage your bots just like any user:

- Assign roles
- Set an expiration date
- Change the bot's status to active or inactive

## Code Example

Here is an example script to retrieve the entire project **MyProduction** using a bot:

```python
import gazu
  
gazu.set_host("yourkitsu.cg-wire.com/api/")
gazu.set_token("my_jwt_token")

p = gazu.project.get_project_by_name("MyProduction")
```

We use a bot to interact with the Kitsu API without using a real user's login credentials. 

You can give bots different permissions for different needs. For example, if you have a bot that publishes comments, you can give your bot the same rights as a physical user.

## Next Steps

* Learn about [event listeners](/guides/event-listeners)
* Learn about [custom actions](/guides/custom-actions)
