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
        text: 'Guide',
        link: '/guide/',
      },
    ],
    sidebar: {
      '/guide/': [
        {
          title: 'Essentials',
          collapsable: false,
          children: ['', 'installation', 'options'],
        },
        {
          title: 'Styles',
          collapsable: false,
          children: [
            'styles/',
            'styles/avataaars',
            'styles/bottts',
            'styles/code',
            'styles/gridy',
            'styles/humaaans',
            'styles/identicon',
            'styles/initials',
            'styles/jdenticon',
            'styles/open-peeps',
            'styles/personas',
            'styles/pixel-art',
          ],
        },
        {
          title: 'Extensions',
          collapsable: false,
          children: ['extensions/ui', 'extensions/cloud'],
        },
        {
          title: 'Wrapper',
          collapsable: false,
          children: ['wrapper/react', 'wrapper/vue'],
        },
      ],
    },
  },

  /**
   * Apply plugins，ref：https://v1.vuepress.vuejs.org/zh/plugin/
   */
  plugins: ['@vuepress/plugin-back-to-top', '@vuepress/plugin-medium-zoom', 'fulltext-search'],
};
