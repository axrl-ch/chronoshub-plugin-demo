export default defineNuxtConfig({
  modules: [
    '@nuxt/content',
    'nuxt-studio'
  ],

  nitro: {
    preset: 'vercel'
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
