import { defineConfig, DefaultTheme } from 'vitepress'

const ogDescription = 'Yandhi\'s Notebooks'
const ogImage = 'https://vitejs.dev/og-image.png'
const ogTitle = 'Notebooks'
const ogUrl = ''

export default defineConfig({
  vite: {
    server: {
      host: 'localhost',
      port: 8888,
    }
  },
  base: '/blog',
  title: `Hello VitePress`,
  description: 'Just playing around.',
  head: [
    ['link', { rel: 'icon', type: 'image/svg+xml', href: '/logo.svg' }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:title', content: ogTitle }],
    ['meta', { property: 'og:image', content: ogImage }],
    ['meta', { property: 'og:url', content: ogUrl }],
    ['meta', { property: 'og:description', content: ogDescription }],
    ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
    ['meta', { name: 'twitter:site', content: 'github-pages' }],
    ['meta', { name: 'theme-color', content: '#646cff' }],
    [
      'script',
      {
        src: 'https://cdn.usefathom.com/script.js',
        'data-site': 'CBDFBSLI',
        'data-spa': 'auto',
        defer: '',
      },
    ],
  ],

  themeConfig: {
    logo: '/logo.svg',

    editLink: {
      pattern: 'https://github.com/Yand-hi/notebook/edit/main/docs/:path',
      text: 'Suggest changes to this page',
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/Yand-hi/notebook' },
    ],

    algolia: {
      appId: 'ACY4698UDH',
      apiKey: '830efbe026a05eb3eab7e6a615663b6c',
      indexName: 'blog',
      searchParameters: {
        facetFilters: ['tags:en'],
      },
    },

    footer: {
      message: `Released under the MIT License.`,
      copyright: 'Copyright © 2022-present Yandhi',
    },

    nav: [
      { text: 'Typescript', link: '/Typescript/枚举', activeMatch: '/Typescript/' },
      { text: 'Books 笔记', link: '/Books 笔记/Vuejs设计与实现/1-框架设计概览', activeMatch: '/Books 笔记/' },
    ],

    sidebar: {
      '/Typescript/': [
        {
          text: 'Typescript',
          items: [
            {
              text: '枚举',
              link: '/Typescript/枚举',
            },
            {
              text: '接口',
              link: '/Typescript/接口',
            },
            {
              text: '泛型',
              link: '/Typescript/泛型',
            },
            {
              text: '抽象类抽象属性与方法',
              link: '/Typescript/抽象类抽象属性与方法',
            },
            {
              text: 'any-unknown-never',
              link: '/Typescript/any-unknown-never',
            },
            {
              text: '重载',
              link: '/Typescript/重载',
            },
            {
              text: '工具类型',
              link: '/Typescript/工具类型',
            },
            {
              text: '装饰器',
              link: '/Typescript/装饰器',
            },
          ],
        },
      ],
      '/Books 笔记/': [
        {
          text: '《Vuejs设计与实现》',
          items: [
            {
              text: '1-框架设计概览',
              link: '/Books 笔记/Vuejs设计与实现/1-框架设计概览',
            },
            {
              text: '2-响应系统的作用与实现',
              link: '/Books 笔记/Vuejs设计与实现/2-响应系统的作用与实现',
            },
            {
              text: '3-嵌套的副作用函数',
              link: '/Books 笔记/Vuejs设计与实现/3-嵌套的副作用函数',
            },
            {
              text: '4-trigger实现调度执行',
              link: '/Books 笔记/Vuejs设计与实现/4-trigger实现调度执行',
            },
            {
              text: '5-computed实现原理',
              link: '/Books 笔记/Vuejs设计与实现/5-computed实现原理',
            },
            {
              text: '6-watch的实现原理',
              link: '/Books 笔记/Vuejs设计与实现/6-watch的实现原理',
            },
          ],
        },
        {
          text: '《C Prime Plus》',
          items: [
            {
              text: '1-初识C语言',
              link: '/Books 笔记/C Prime Plus/1-初识C语言',
            },
          ],
        },
      ],
    },
  },
})
