const remarkMath = require("remark-math");
const rehypeKatex = require("rehype-katex");

const remarkMathPlugin = remarkMath.default ?? remarkMath;
const rehypeKatexPlugin = rehypeKatex.default ?? rehypeKatex;

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: "Brebaje",
  tagline: "Zero-knowledge ceremony manager",
  url: "https://example.com",
  baseUrl: "/",
  onBrokenLinks: "throw",
  markdown: {
    format: "detect",
    hooks: {
      onBrokenMarkdownLinks: "throw",
    },
  },
  organizationName: "brebaje",
  projectName: "brebaje",
  presets: [
    [
      "classic",
      {
        docs: {
          path: "docs",
          routeBasePath: "/",
          sidebarPath: require.resolve("./sidebars.js"),
          remarkPlugins: [remarkMathPlugin],
          rehypePlugins: [rehypeKatexPlugin],
        },
        blog: false,
      },
    ],
  ],
  stylesheets: [
    {
      href: "https://cdn.jsdelivr.net/npm/katex@0.16.22/dist/katex.min.css",
      type: "text/css",
    },
  ],
};

module.exports = config;
