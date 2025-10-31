export default {
  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: 'my-nuxt2-demo',
    htmlAttrs: {
      lang: 'en'
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
      { name: 'format-detection', content: 'telephone=no' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
    'element-ui/lib/theme-chalk/index.css',
  ],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    '@/plugins/axios',
    '@/plugins/element-ui'
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    '@nuxtjs/style-resources' // 注册模块
    ,'@nuxtjs/axios'
  ],

  styleResources: {
    scss: [
      '@/assets/scss/variables.scss', // 全局引入的 SCSS 变量文件
    ]
  },

  router:{
    // middleware: 'auth' // 全局中间件（已暂时禁用以允许访问演示页面）
  },
  axios: {
    // Axios 模块配置
    baseURL: '/' // 仅作为示例，实际项目中请根据需要进行配置
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
    loaders: {
      pug: {
        // Pug 模板配置（可选）
        pretty: true // 格式化 HTML 输出
      },
      scss: {
       
      }
    },
    transpile: [/^element-ui/],
  }
}
