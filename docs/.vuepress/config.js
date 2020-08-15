const { description } = require('../../package');

module.exports = {
  /**
   * Ref：https://v1.vuepress.vuejs.org/config/#title
   */
  title: 'Avatars',
  /**
   * Ref：https://v1.vuepress.vuejs.org/config/#description
   */
  description: description,

  /**
   * Extra tags to be injected to the page HTML `<head>`
   *
   * ref：https://v1.vuepress.vuejs.org/config/#head
   */
  head: [
    ['meta', { name: 'theme-color', content: '#3eaf7c' }],
    ['meta', { name: 'apple-mobile-web-app-capable', content: 'yes' }],
    ['meta', { name: 'apple-mobile-web-app-status-bar-style', content: 'black' }],
  ],

  /**
   * Theme configuration, here is the default theme configuration for VuePress.
   *
   * ref：https://v1.vuepress.vuejs.org/theme/default-theme-config.html
   */
  themeConfig: {
    repo: 'https://github.com/DiceBear/avatars',
    editLinks: true,
    docsDir: 'docs',
    editLinkText: '',
    lastUpdated: false,
    docsBranch: 'v5',
    nav: [
      {
        text: 'Developer Guide',
        link: '/developer-guide/',
      },
      {
        text: 'Designer Guide',
        link: '/designer-guide/',
      },
      {
        text: 'Styles',
        link: '/styles/',
      },
      {
        text: 'Changelog',
        link: 'https://github.com/DiceBear/avatars/blob/v5/CHANGELOG.md',
      },
    ],
    sidebar: {
      '/developer-guide/': [
        {
          title: 'Essentials',
          collapsable: false,
          children: ['', 'how-to-use', 'options', 'changelog', 'faq'],
        },
        {
          title: 'Extensions',
          collapsable: false,
          children: ['extensions/', 'extensions/ui', 'extensions/vue', 'extensions/react', 'extensions/serverless'],
        },
      ],
      '/designer-guide/': [
        {
          title: 'Essentials',
          collapsable: false,
          children: ['', 'how-to-use', 'options', 'changelog', 'faq'],
        },
        {
          title: 'Extensions',
          collapsable: false,
          children: ['extensions/', 'extensions/ui', 'extensions/vue', 'extensions/react', 'extensions/serverless'],
        },
      ],
      '/styles/': [
        {
          title: 'Styles',
          collapsable: false,
          children: [
            '',
            'avataaars',
            'bottts',
            'code',
            'gridy',
            'humaaans',
            'identicon',
            'initials',
            'jdenticon',
            'open-peeps',
            'personas',
            'pixel-art',
          ],
        },
      ],
    },
  },

  /**
   * Apply plugins，ref：https://v1.vuepress.vuejs.org/zh/plugin/
   */
  plugins: ['@vuepress/plugin-back-to-top', '@vuepress/plugin-medium-zoom', 'fulltext-search'],
};
