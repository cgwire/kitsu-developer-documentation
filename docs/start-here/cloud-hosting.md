# Cloud Hosting

Kitsu is a web application that requires a server to run. You can either host
it yourself or let CGWire handle it for you. Cloud hosting is the fastest way
to get Kitsu up and running: CGWire handles upgrades, backups, security
patches, and scaling so your team can focus on production.

## Why cloud?

| | Cloud | Self-hosted |
|---|---|---|
| Setup time | Minutes | Hours to days |
| Maintenance | Managed by CGWire | Your team |
| Upgrades | Automatic, zero downtime | Manual |
| Backups | Daily, automated | Your responsibility |
| Support | Direct from CGWire | Community |

## Get started

1. **[Sign up for a free trial](https://account.cg-wire.com/signup)** --
   your instance is ready in minutes.
2. **Connect your tools** -- use the API URL provided in your dashboard with
   the [Python SDK](/start-here/dev-quickstart) or
   [REST API](https://api-docs.kitsu.cloud/) to start building right away.
   No server setup, no configuration.

```python
import gazu

gazu.set_host("https://my-studio.kitsu.cloud/api")
gazu.log_in("me@studio.com", "password")

projects = gazu.project.all_open_projects()
```

## What's included

- **Automatic updates** -- always on the latest Kitsu version
- **Daily backups** with point-in-time recovery
- **SSL/TLS encryption** on all connections
- **Preview storage** -- images, videos, and 3D files served from a CDN
- **Priority support** from the CGWire team

## Next steps

* [Developer quickstart](/start-here/dev-quickstart) -- connect to the API in
  5 minutes
* [Authentication](/guides/authentication) -- API keys, tokens, and SSO
* [Setting up a production](/guides/production-setup) -- create your first
  project

::: info
Want to run Kitsu on your own infrastructure instead? See the
[self-hosting guide](/self-hosting/vs-cloud-hosting).
:::
