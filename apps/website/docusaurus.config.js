// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: "Brebaje",
  tagline: "Zero-knowledge proof ceremony management platform",
  favicon: "img/favicon.ico",

  // Set the production url of your site here
  url: "https://p0tion-tools.github.io",
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: "/brebaje/",

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: "p0tion-tools", // Usually your GitHub org/user name.
  projectName: "brebaje", // Usually your repo name.

  onBrokenLinks: "throw",

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: "en",
    locales: ["en"],
  },

  presets: [
    [
      "@docusaurus/preset-classic",
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: "./sidebars.js",
          routeBasePath: "/",
          // Remove this to remove the "edit this page" links.
          editUrl: "https://github.com/p0tion-tools/brebaje/tree/main/apps/website/",
        },
        blog: false,
        theme: {
          customCss: "./src/css/custom.css",
        },
      }),
    ],
  ],

  markdown: {
    mermaid: true,
    format: "detect",
    hooks: {
      onBrokenMarkdownLinks: "warn",
    },
  },

  themes: ["@docusaurus/theme-mermaid"],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      // Replace with your project's social card
      image: "img/brebaje-social-card.jpg",
      navbar: {
        title: "Brebaje",
        logo: {
          alt: "Brebaje Logo",
          src: "img/logo.svg",
        },
        items: [
          {
            type: "docSidebar",
            sidebarId: "tutorialSidebar",
            position: "left",
            label: "Documentation",
          },
          {
            type: "doc",
            docId: "api/index",
            position: "left",
            label: "API Reference",
          },
          {
            href: "https://github.com/p0tion-tools/brebaje",
            position: "right",
            className: "header-github-link",
            "aria-label": "GitHub repository",
          },
        ],
      },
      footer: {
        style: "dark",
        links: [
          {
            title: "Docs",
            items: [
              {
                label: "Getting Started",
                to: "/intro",
              },
              {
                label: "API Reference",
                to: "/api",
              },
            ],
          },
          {
            title: "Community",
            items: [
              {
                label: "GitHub",
                href: "https://github.com/p0tion-tools/brebaje",
              },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} The Brebaje Community. Built with Docusaurus.`,
      },
      prism: {
        theme: require("prism-react-renderer").themes.github,
        darkTheme: require("prism-react-renderer").themes.dracula,
      },
      colorMode: {
        defaultMode: "dark",
        disableSwitch: false,
        respectPrefersColorScheme: true,
      },
    }),

  plugins: [
    [
      "docusaurus-plugin-typedoc",
      {
        // Entry points configuration - all backend modules
        // Use the entire src directory to ensure all files are discovered
        entryPoints: ["../backend/src"],
        entryPointStrategy: "expand", // Expand to discover all files in the directory

        // Exclusion patterns
        exclude: [
          "**/main.ts",
          "**/*.spec.ts",
          "**/*.test.ts",
          "**/node_modules/**",
          "**/dist/**",
          "**/build/**",
        ],

        // TypeScript configuration
        tsconfig: "../backend/tsconfig.json",

        // Project metadata - required for index page generation
        name: "Brebaje API",

        // Output configuration
        out: "docs/api",
        cleanOutputDir: false, // Don't clean output dir - we generate manually in prebuild

        // Documentation structure
        router: "member", // Use "member" router (individual files per member)
        entryFileName: "index",
        hideBreadcrumbs: true,
        categoryOrder: ["Modules", "Classes", "Interfaces", "Enums", "*"],
        indexFormat: "table", // Use table format for index

        // Sidebar configuration
        sidebar: {
          autoConfiguration: true,
        },

        // Visibility settings
        excludePrivate: true,

        // Watch mode for development
        watch: process.env.NODE_ENV !== "production",
      },
    ],
  ],
};

module.exports = config;
