// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const {themes} = require('prism-react-renderer');

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Brebaje',
  tagline: 'Zero-Knowledge Proof Ceremony Management Platform',
  favicon: 'img/favicon.ico',

  // Set the production url of your site here
  url: 'https://brebaje.readthedocs.io',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployments, it is often '/<projectName>/'
  baseUrl: '/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'brebaje', // Usually your GitHub org/user name.
  projectName: 'brebaje', // Usually your repo name.

  onBrokenLinks: 'warn',
  onBrokenMarkdownLinks: 'warn',

  // Even if you don't use internalization, you can use this field to set useful
  // metadata like html lang. For example, if your site is in Chinese, you will
  // want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          path: '../docs',
          sidebarPath: require.resolve('./sidebars.js'),
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl: 'https://github.com/brebaje/brebaje/tree/main/',
          // KaTeX plugins - temporarily disabled to fix build
          // remarkPlugins: [require('remark-math')],
          // rehypePlugins: [require('rehype-katex')],
          routeBasePath: '/docs',
        },
        blog: {
          showReadingTime: true,
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl: 'https://github.com/brebaje/brebaje/tree/main/',
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      // Replace with your project's social card
      image: 'img/docusaurus-social-card.jpg',
      navbar: {
        title: 'Brebaje',
        logo: {
          alt: 'Brebaje Logo',
          src: 'img/logo.svg',
        },
        items: [
          {
            type: 'docSidebar',
            sidebarId: 'tutorialSidebar',
            position: 'left',
            label: 'Documentation',
          },
          {
            href: 'https://github.com/brebaje/brebaje',
            label: 'GitHub',
            position: 'right',
          },
        ],
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: 'Docs',
            items: [
              {
                label: 'Get Started',
                to: '/docs/get-started',
              },
              {
                label: 'API Reference',
                to: '/docs/api',
              },
            ],
          },
          {
            title: 'Community',
            items: [
              {
                label: 'GitHub',
                href: 'https://github.com/brebaje/brebaje',
              },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} Brebaje. Built with Docusaurus.`,
      },
      prism: {
        theme: themes.github,
        darkTheme: themes.dracula,
        additionalLanguages: ['typescript', 'bash', 'json'],
      },
    }),

  // KaTeX configuration for mathematical notation
  stylesheets: [
    {
      href: 'https://cdn.jsdelivr.net/npm/katex@0.16.27/dist/katex.min.css',
      type: 'text/css',
      integrity:
        'sha384-JuoljFpK7cwqz+qkqowm4/ot87To32Yyea8D6LKp3n+g+O8H7lLliiMvo4g+PGwZ',
      crossorigin: 'anonymous',
    },
  ],
};

module.exports = config;
