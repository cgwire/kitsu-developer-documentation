export default {
  lang: "en-US",
  title: "Kitsu Developer",
  description: "Kitsu's unified developer documentation.",

  themeConfig: {
    logo: "/logo.png",
    sidebar: [
      {
        items: [
          {
            text: "Start Here",
            link: "/start-here",
            items: [
              { text: "Why Kitsu", link: "/start-here/why-kitsu" },
              { text: "Cloud Hosting", link: "/start-here/cloud-hosting" },
              { text: "Docker", link: "/start-here/docker" },
              {
                text: "Migrate to Kitsu",
                link: "/start-here/migrate-to-kitsu",
              },
            ],
          },
          {
            text: "Basics",
            link: "/basics",
            collapsed: true,
            items: [
              { text: "Projects", link: "/basics/projects" },
              { text: "Users", link: "/basics/users" },
              { text: "Episodes", link: "/basics/episodes" },
              { text: "Sequences", link: "/basics/sequences" },
              { text: "Shots", link: "/basics/shots" },
              { text: "Assets", link: "/basics/assets" },
              { text: "Tasks", link: "/basics/tasks" },
              { text: "Comments", link: "/basics/comments" },
              { text: "Files", link: "/basics/files" },
              { text: "Events", link: "/basics/events" },
              { text: "Notifications", link: "/basics/notifications" },
              { text: "Playlists", link: "/basics/playlists" },
            ],
          },
          {
            text: "Guides",
            link: "/guides",
            items: [
              { text: "Authentication", link: "/guides/authentication" },
              { text: "Access Control", link: "/guides/access-control" },
              {
                text: "Production Management",
                link: "/guides/production-management",
              },
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
                link: "/guides/multi-studio-production",
              },
              {
                text: "Self-hosting",
                link: "/guides/self-hosting",
                collapsed: true,
                items: [
                  {
                    text: "vs cloud hosting",
                    link: "/guides/self-hosting/vs-cloud-hosting",
                  },
                ],
              },
            ],
          },
          {
            text: "Recipes",
            link: "/recipes",
            items: [{ text: "CSV import", link: "/recipes/csv-import" }],
          },
          {
            text: "Integrations",
            link: "/integrations",
            items: [
              {
                text: "Kitsu plugins",
                link: "/integrations/kitsu-plugins",
                collapsed: true,
                items: [
                  {
                    text: "Installation",
                    link: "/integrations/kitsu-plugins/installation",
                  },
                  {
                    text: "Development",
                    link: "/integrations/kitsu-plugins/development",
                  },
                ],
              },
              {
                text: "DCC",
                link: "/integrations/dcc",
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
                link: "/integrations/ui",
                collapsed: true,
                items: [{ text: "Vue", link: "/integrations/ui/vue" }],
              },
              {
                text: "Messaging",
                link: "/integrations/messaging",
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
            link: "/open-source",
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
            link: "/references",
            items: [
              { text: "API", link: "https://api-docs.kitsu.cloud/" },
              {
                text: "Gazu Python SDK",
                link: "https://gazu.cg-wire.com/specs",
              },
              {
                text: "Javascript SDK",
                link: "https://github.com/cgwire/kitsu-client-js",
              },
              { text: "CLI", link: "https://zou.cg-wire.com/development/" },
            ],
          },
          {
            text: "Learn",
            link: "/learn",
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
