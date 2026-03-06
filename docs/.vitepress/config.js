const spec = await fetch(
  "https://github.com/cgwire/gazu/releases/download/spec-latest/gazu-specs.json",
).then((res) => res.json());

function getModuleFromName(name) {
  const parts = name.split(".");

  // gazu.module.function → module
  if (parts.length === 3) {
    return parts[1];
  }

  // gazu.function → gazu root category
  return "gazu";
}

let modules = new Set();

Object.entries(spec).forEach(([name]) => {
  modules.add(getModuleFromName(name));
});

modules = [...modules].map((m) => ({
  text: m,
  link: `/references/gazu#${m}`,
}));

export default {
  lang: "en-US",
  title: "Kitsu Developer",
  head: [["link", { rel: "icon", href: "/kitsu.png" }]],
  description:
    "Kitsu provides a public API that gives developers programmatic access to our core features to build integrations, custom tools, or extend the UI with Kitsu plugins.",
  ignoreDeadLinks: true,
  // appearance: false,
  themeConfig: {
    logo: "/kitsu.png",
    outline: "deep",
    search: {
      provider: "local",
    },
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
            text: "Guides",
            collapsed: false,
            items: [
              { text: "Authentication", link: "/guides/authentication" },
              {
                text: "Permissions and roles",
                link: "/guides/permissions-roles",
              },
              { text: "Team Management", link: "/guides/team-management" },
              {
                text: "Setting up a Production",
                link: "/guides/production-setup",
              },
              { text: "Task tracking", link: "/guides/task-tracking" },
              { text: "Publishing", link: "/guides/publishing" },
              { text: "Asset Management", link: "/guides/asset-management" },
              { text: "Bot Automation", link: "/guides/bot-automation" },
              { text: "Event Listeners", link: "/guides/event-listeners" },
              { text: "Search", link: "/guides/search" },
              {
                text: "Caching",
                link: "/guides/caching",
              },
              { text: "Custom Actions", link: "/guides/custom-actions" },
              {
                text: "Session Management",
                link: "/guides/session-management",
              },
              { text: "Async Client", link: "/guides/async" },
              { text: "Logging", link: "/guides/logging" },
            ],
          },
          {
            text: "Recipes",
            collapsed: false,
            items: [
              {
                text: "Import Studio Team",
                link: "/recipes/import-studio-team",
              },
              {
                text: "Make your Plugin",
                link: "/recipes/make-your-plugin",
              },
              {
                text: "Progress Callbacks",
                link: "/recipes/progress-callbacks",
              },
              {
                text: "File Management",
                link: "/recipes/file-management",
              },
            ],
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
                  { text: "Blender", link: "/integrations/dcc/blender" },
                  {
                    text: "Toon Boom Harmony",
                    link: "/integrations/dcc/toon-boom-harmony",
                  },
                  {
                    text: "Unreal Engine",
                    link: "/integrations/dcc/unreal-engine",
                  },
                ],
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
            text: "Self-hosting",
            collapsed: true,
            items: [
              {
                text: "vs cloud hosting",
                link: "/self-hosting/vs-cloud-hosting",
              },
              {
                text: "Architecture",
                link: "/self-hosting/architecture",
              },
              {
                text: "Hardware Requirements",
                link: "/self-hosting/hardware-requirements",
              },
              {
                text: "Setup",
                link: "/self-hosting/setup",
              },
              {
                text: "Environment Variables",
                link: "/self-hosting/environment-variables",
              },
              {
                text: "Full-text search",
                link: "/self-hosting/full-text-search",
              },
              {
                text: "Preview Storage",
                link: "/self-hosting/preview-storage",
              },
              {
                text: "Job queue",
                link: "/self-hosting/job-queue",
              },
              {
                text: "LDAP",
                link: "/self-hosting/lightweight-directory-access-protocol",
              },
              {
                text: "Logging",
                link: "/self-hosting/logging",
              },
              {
                text: "Backup",
                link: "/self-hosting/backup",
              },
              {
                text: "Data Migration",
                link: "/self-hosting/data-migration",
              },
              {
                text: "Troubleshooting",
                link: "/self-hosting/troubleshooting",
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
                link: "/references/gazu",
                collapsed: true,
                items: modules,
              },
              {
                text: "Javascript SDK",
                link: "https://github.com/cgwire/kitsu-client-js",
              },
              { text: "CLI", link: "/references/cli" },
            ],
          },
          {
            text: "Resources",
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
