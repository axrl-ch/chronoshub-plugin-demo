export default defineNuxtConfig({
  modules: [
    '@nuxt/content',
    'nuxt-studio'
  ],

  nitro: {
    preset: 'vercel',
    serverAssets: [
      { baseName: 'skills', dir: './skills' }
    ]
  },

  studio: {
    route: '/admin',
    git: {
      commit: {
        messagePrefix: 'content:'
      }
    }
  },

  content: {},

  compatibilityDate: '2025-01-01'
})
