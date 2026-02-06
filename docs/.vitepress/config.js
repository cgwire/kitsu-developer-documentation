export default {
  lang: "en-US",
  title: "Kitsu Developer",
  description: "Kitsu's unified developer documentation.",
  ignoreDeadLinks: true,
  themeConfig: {
    logo: "/kitsu.png",
    sidebar: [
      {
        items: [
          {
            text: "Start Here",
            collapsed: false,
            items: [
              { text: "Why Kitsu", link: "/start-here/why-kitsu" },
              { text: "Cloud Hosting", link: "/start-here/cloud-hosting" },
              { text: "Docker", link: "/start-here/docker" },
              {
                text: "Developer Quickstart",
                link: "/start-here/dev-quickstart",
              },
              {
                text: "Migrate to Kitsu",
                link: "/start-here/migrate-to-kitsu",
              },
            ],
          },
          {
            text: "Core Resources Overview",
            link: "/core-resources/overview",
          },
          {
            text: "Guides",
            collapsed: false,
            items: [
              { text: "Authentication", link: "/guides/authentication" },
              { text: "Access Control", link: "/guides/access-control" },
              {
                text: "Production Management",
                link: "/guides/production-management",
              },
              { text: "Team Management", link: "/guides/team-management" },
              { text: "Asset Management", link: "/guides/asset-management" },
              { text: "Pipeline tracking", link: "/guides/pipeline-tracking" },
              { text: "Review engine", link: "/guides/review-engine" },
              { text: "Reporting", link: "/guides/reporting" },
              { text: "Custom Actions", link: "/guides/custom-actions" },
              { text: "Bot Automation", link: "/guides/bot-automation" },
              { text: "Webhooks", link: "/guides/webhooks" },
              { text: "Advanced Search", link: "/guides/advanced-search" },
              { text: "Developer Tools", link: "/guides/developer-tools" },
              {
                text: "Multi-studio Productions",
                link: "/guides/multi-studio-productions",
              },
              {
                text: "Self-hosting",
                collapsed: true,
                items: [
                  {
                    text: "vs cloud hosting",
                    link: "/guides/self-hosting/vs-cloud-hosting",
                  },
                  {
                    text: "Architecture",
                    link: "/guides/self-hosting/architecture",
                  },
                  {
                    text: "Hardware Requirements",
                    link: "/guides/self-hosting/hardware-requirements",
                  },
                  {
                    text: "Setup",
                    link: "/guides/self-hosting/setup",
                  },
                  {
                    text: "Environment Variables",
                    link: "/guides/self-hosting/environment-variables",
                  },
                  {
                    text: "File storage",
                    link: "/guides/self-hosting/file-storage",
                  },
                  {
                    text: "Full-text search",
                    link: "/guides/self-hosting/full-text-search",
                  },
                  {
                    text: "Job queue",
                    link: "/guides/self-hosting/job-queue",
                  },
                  {
                    text: "Lightweight Directory Access Protocol",
                    link: "/guides/self-hosting/lightweight-directory-access-protocol",
                  },
                  {
                    text: "Logging",
                    link: "/guides/self-hosting/logging",
                  },
                  {
                    text: "Backup",
                    link: "/guides/self-hosting/backup",
                  },
                  {
                    text: "Data Migration",
                    link: "/guides/self-hosting/data-migration",
                  },
                  {
                    text: "Caching",
                    link: "/guides/self-hosting/caching",
                  },
                  {
                    text: "Troubleshooting",
                    link: "/guides/self-hosting/troubleshooting",
                  },
                ],
              },
            ],
          },
          {
            text: "Recipes",
            collapsed: false,
            items: [{ text: "CSV import", link: "/recipes/csv-import" }],
          },
          {
            text: "Kitsu plugins",
            collapsed: false,
            items: [
              {
                text: "Installation",
                link: "/kitsu-plugins/installation",
              },
              {
                text: "Development",
                link: "/kitsu-plugins/development",
              },
            ],
          },
          {
            text: "Integrations",
            collapsed: false,
            items: [
              {
                text: "DCC",
                collapsed: true,
                items: [
                  { text: "DCC Utils", link: "/integrations/dcc/dcc-utils" },
                  { text: "Blender", link: "/integrations/dcc/blender" },
                  {
                    text: "Toon Boom Harmony",
                    link: "/integrations/dcc/toon-boom-harmony",
                  },
                  {
                    text: "Unreal Engine",
                    link: "/integrations/dcc/unreal-engine",
                  },
                  { text: "Maya", link: "/integrations/dcc/maya" },
                  {
                    text: "Adobe Photoshop",
                    link: "/integrations/dcc/adobe-photoshop",
                  },
                ],
              },
              {
                text: "UI Frameworks",
                collapsed: true,
                items: [{ text: "Vue", link: "/integrations/ui/vue" }],
              },
              {
                text: "Messaging",
                collapsed: true,
                items: [
                  { text: "Slack", link: "/integrations/messaging/slack" },
                  { text: "Discord", link: "/integrations/messaging/discord" },
                  {
                    text: "Mattermost",
                    link: "/integrations/messaging/mattermost",
                  },
                ],
              },
            ],
          },
          {
            text: "Open Source",
            collapsed: false,
            items: [
              { text: "Contributing", link: "/open-source/contributing" },
              {
                text: "Development environment quickstart",
                link: "/open-source/development-environment-quickstart",
              },
            ],
          },
          {
            text: "References",
            collapsed: false,
            items: [
              {
                text: "API (zou)",
                link: "https://api-docs.kitsu.cloud/",
              },
              {
                text: "Gazu Python SDK",
                link: "https://gazu.cg-wire.com/specs",
              },
              {
                text: "Javascript SDK",
                link: "https://github.com/cgwire/kitsu-client-js",
              },
              { text: "CLI", link: "/references/cli" },
            ],
          },
          {
            text: "Learn",
            collapsed: false,
            items: [
              { text: "Github", link: "https://github.com/cgwire" },
              { text: "Blog", link: "https://blog.cg-wire.com/" },
            ],
          },
        ],
      },
    ],
  },
};
