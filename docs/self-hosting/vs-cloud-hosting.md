# Self-hosting vs Cloud Hosting

Choosing how to host Kitsu has a direct impact on setup time, operational overhead, scalability, and long-term flexibility. This page outlines the key differences between cloud-hosted Kitsu and self-hosted Kitsu to help animation studios decide which approach best fits their needs.

Both options provide the same core features, but differ significantly in how much control, responsibility, and operational effort they require.

* **Cloud hosting** prioritizes ease of use, fast onboarding, and reduced operational burden.
* **Self-hosting** prioritizes hardware customization.

## Deployment & Setup

### Cloud Hosting

Cloud-hosted Kitsu is designed for rapid deployment. The environment is preconfigured and ready to use with minimal setup required.

| Pros                           | Cons                                        |
| ------------------------------ | ------------------------------------------- |
| Fast onboarding                | Limited control over hardware configuration |
| No infrastructure provisioning |                                             |
| Minimal configuration          |                                             |

### Self-Hosting

Self-hosting requires manual installation and configuration of Kitsu and its dependencies.

| Pros                                                | Cons                                              |
| --------------------------------------------------- | ------------------------------------------------- |
| Full control over deployment architecture           | Higher initial setup effort                       |
| Freedom to tailor the environment to specific needs | Requires infrastructure planning and provisioning |

## Infrastructure & Operations

### Cloud Hosting

The cloud provider manages servers, databases, backups, monitoring, and uptime.

| Pros                                   | Cons                                                             |
| -------------------------------------- | ---------------------------------------------------------------- |
| Reduced operational responsibility     | Dependency on the hosting provider’s infrastructure and policies |
| No need for dedicated DevOps resources |                                                                  |
| Full priority support                  |                                                                  |

### Self-Hosting

All infrastructure and operational responsibilities fall on your team.

| Pros                                  | Cons                                             |
| ------------------------------------- | ------------------------------------------------ |
| Full ownership of infrastructure      | Ongoing operational workload                     |
| Ability to define custom OS processes | Responsibility for uptime, backups, and recovery |

## Scalability & Performance

### Cloud Hosting

Cloud-hosted Kitsu typically includes built-in scaling and performance optimizations.

| Pros                                             | Cons                                 |
| ------------------------------------------------ | ------------------------------------ |
| Automatic or managed scaling                     | Limited low-level performance tuning |
| Handles traffic spikes with minimal intervention |                                      |

### Self-Hosting

Performance and scalability depend on how the infrastructure is designed and managed.

| Pros                                  | Cons                                      |
| ------------------------------------- | ----------------------------------------- |
| Fine-grained performance optimization | Manual scaling                            |
| Custom scaling strategies             | Requires capacity planning and monitoring |

## Maintenance & Updates

### Cloud Hosting

Updates and patches are handled automatically by the provider.

| Pros                               | Cons |
| ---------------------------------- | ---- |
| Always running a supported version | —    |
| Reduced maintenance effort         |      |

### Self-Hosting

Updates must be planned and executed manually.

| Pros                                      | Cons                               |
| ----------------------------------------- | ---------------------------------- |
| Full control over upgrade schedules       | Ongoing maintenance responsibility |
| Ability to test updates before deployment |                                    |

## Customization & Extensibility

### Cloud Hosting

Customization options are typically constrained to supported configurations and APIs.

| Pros                             | Cons                                                                                                       |
| -------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| Stable, well-defined environment | Limited ability to modify core behavior or source code (API access still allows full pipeline integration) |

### Self-Hosting

Self-hosted deployments allow deeper customization.

| Pros                                        | Cons                                           |
| ------------------------------------------- | ---------------------------------------------- |
| Full access to source code                  | Customizations increase maintenance complexity |
| Custom plugins, integrations, and workflows | No support provided if conflicts occur         |

## Security & Compliance

### Cloud Hosting

Security practices are shared between the provider and the user.

| Pros                                          | Cons                                               |
| --------------------------------------------- | -------------------------------------------------- |
| Provider-managed security measures            | Less control over underlying security architecture |
| Reduced security configuration effort         |                                                    |
| Meets strict internal compliance requirements |                                                    |

### Self-Hosting

Security is fully managed by your team.

| Pros                                             | Cons                                                                   |
| ------------------------------------------------ | ---------------------------------------------------------------------- |
| Full control over data, access, and compliance   | Requires security expertise and ongoing vigilance for critical updates |
| Easier alignment with internal security policies |                                                                        |

## Cost & Pricing

### Cloud Hosting

Typically based on a subscription or usage-based pricing model.

| Pros                                 | Cons                   |
| ------------------------------------ | ---------------------- |
| Predictable costs                    | Minimal recurring fees |
| No upfront infrastructure investment |                        |

### Self-Hosting

Costs are tied to infrastructure and operational resources.

| Pros                        | Cons                                 |
| --------------------------- | ------------------------------------ |
| No vendor subscription fees | Variable costs                       |
|                             | Infrastructure and staffing expenses |

## Reliability & Availability

### Cloud Hosting

Designed with redundancy and high availability in mind.

| Pros                          | Cons |
| ----------------------------- | ---- |
| Built-in failover and backups | —    |
| Service-level guarantees      |      |
| Disaster recovery strategies  |      |

### Self-Hosting

Reliability depends entirely on your architecture.

| Pros                                    | Cons                                            |
| --------------------------------------- | ----------------------------------------------- |
| Custom redundancy and backup strategies | High effort to achieve cloud-level availability |

## Team Requirements

### Cloud Hosting

Best suited for teams that want to focus on development rather than infrastructure.

| Pros                              | Cons |
| --------------------------------- | ---- |
| Minimal DevOps expertise required | —    |

### Self-Hosting

Requires technical expertise beyond application development.

| Pros | Cons                                                    |
| ---- | ------------------------------------------------------- |
| —    | Requires DevOps, infrastructure, and security knowledge |

## Vendor Lock-In & Portability

### Cloud Hosting

| Pros                                       | Cons |
| ------------------------------------------ | ---- |
| Simplified management within the ecosystem | —    |
| Easy data migration                        |      |
| Always open-source                         |      |

### Self-Hosting

Provides maximum portability.

| Pros                                           | Cons |
| ---------------------------------------------- | ---- |
| No vendor lock-in                              | —    |
| Straightforward migration between environments |      |

## When to Choose Each Option

### Choose Cloud Hosting if:

* You want to get started quickly
* You prefer a managed solution
* Your team has limited DevOps resources

### Choose Self-Hosting if:

* You need deep hardware customization
* You want full control over your infrastructure

| Category                       | Cloud Hosting                                                    | Self-Hosting                                            |
| ------------------------------ | ---------------------------------------------------------------- | ------------------------------------------------------- |
| **Setup & Onboarding**         | Fast onboarding with minimal configuration                       | Manual installation and configuration required          |
| **Deployment Control**         | Limited control over hardware and environment                    | Full control over hardware and deployment architecture  |
| **Infrastructure Management**  | Fully managed (servers, databases, backups, monitoring)          | Fully managed by your team                              |
| **Operational Overhead**       | Low operational burden                                           | High operational responsibility                         |
| **DevOps Requirements**        | Minimal DevOps expertise required                                | Requires DevOps, infrastructure, and security expertise |
| **Scalability**                | Automatic or managed scaling                                     | Manual scaling and capacity planning                    |
| **Performance Tuning**         | Limited low-level tuning                                         | Fine-grained performance optimization                   |
| **Maintenance & Updates**      | Automatic updates and patches                                    | Manual updates                |
| **Customization**              | Limited core customization (API-based integrations & plugin system)    | Deep hardware customization             |
| **Security Management**        | Fully-managed security             | Full control over security and compliance               |
| **Compliance**                 | Meets strict internal compliance requirements                    | Easier alignment with custom internal policies          |
| **Reliability & Availability** | Built-in redundancy, failover, SLAs, and disaster recovery       | Reliability depends on your architecture                |
| **Cost Model**                 | Predictable subscription-based pricing                           | Variable infrastructure and staffing costs              |
| **Upfront Costs**              | No upfront infrastructure investment                             | Infrastructure investment required                      |
| **Portability**                | Simple migration within supported paths                          | Maximum portability across environments                 |
| **Support**                    | Priority support included                                        | No official support if conflicts occur                  |
