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

  content: {
    collections: {
      skills: {
        type: 'page',
        source: 'skills/**'
      },
      connectors: {
        type: 'page',
        source: 'connectors/**'
      }
    }
  },

  compatibilityDate: '2025-01-01'
})
