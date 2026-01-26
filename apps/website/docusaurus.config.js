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
  onBrokenMarkdownLinks: "warn",

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
        entryPoints: [
          "../backend/src/auth/**/*.ts",
          "../backend/src/ceremonies/**/*.ts",
          "../backend/src/circuits/**/*.ts",
          "../backend/src/contributions/**/*.ts",
          "../backend/src/health/**/*.ts",
          "../backend/src/participants/**/*.ts",
          "../backend/src/projects/**/*.ts",
          "../backend/src/storage/**/*.ts",
          "../backend/src/users/**/*.ts",
          "../backend/src/vm/**/*.ts",
          "../backend/src/types/**/*.ts",
          "../backend/src/utils/**/*.ts",
        ],

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

        // Output configuration
        out: "docs/api",

        // Documentation structure
        outputFileStrategy: "members",
        hideBreadcrumbs: true,
        flattenOutputFiles: false,
        disableSources: false,
        categoryOrder: ["Modules", "Classes", "Interfaces", "Enums", "*"],
        indexFormat: "table", // Use table format for index

        // Sidebar configuration
        sidebar: {
          autoConfiguration: true,
          pretty: true,
        },

        // Visibility settings
        excludePrivate: true,
        excludeProtected: false,

        // Validation
        validation: {
          invalidLink: true,
          notDocumented: false,
        },

        // Documentation content
        readme: "none",

        // Watch mode for development
        watch: process.env.NODE_ENV !== "production",

        // Sidebar configuration
        sidebar: {
          autoConfiguration: true,
          pretty: true,
        },
      },
    ],
  ],
};

module.exports = config;
