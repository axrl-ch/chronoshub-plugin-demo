export default defineNuxtConfig({
  modules: [
    '@nuxt/content',
    'nuxt-studio'
  ],

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
