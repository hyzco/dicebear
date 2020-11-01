module.exports = {
  title: 'DiceBear Avatars',
  tagline: 'The tagline of my site',
  url: 'https://your-docusaurus-test-site.com',
  baseUrl: '/',
  onBrokenLinks: 'throw',
  favicon: 'img/favicon.ico',
  organizationName: 'facebook', // Usually your GitHub org/user name.
  projectName: 'docusaurus', // Usually your repo name.
  themeConfig: {
    navbar: {
      title: 'DiceBear Avatars',
      logo: {
        alt: 'My Site Logo',
        src: 'img/logo.svg',
      },
      items: [
        {
          to: 'docs/',
          activeBasePath: 'docs',
          label: 'Docs',
          position: 'left',
        },
        {
          href: 'https://github.com/facebook/docusaurus',
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
              label: 'Style Guide',
              to: 'docs/',
            },
            {
              label: 'Second Doc',
              to: 'docs/doc2/',
            },
          ],
        },
        {
          title: 'Community',
          items: [
            {
              label: 'GitHub',
              href: 'https://github.com/DiceBear/avatars',
            },
            {
              label: 'Discord',
              href: 'https://discord.gg/JKk7THPRh8',
            },
            {
              label: 'Twitter',
              href: 'https://twitter.com/dicebearstatus',
            },
          ],
        },
        {
          title: 'More',
          items: [
            {
              label: 'Privacy Policy / Datenschutz',
              href: '/legal/privacy-policy/',
            },
            {
              label: 'Site Notice / Impressum',
              href: '/legal/site-notice/',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Florian Körner`,
    },
  },
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          // Please change this to your repo.
          editUrl: 'https://github.com/facebook/docusaurus/edit/master/website/',
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      },
    ],
  ],
};
