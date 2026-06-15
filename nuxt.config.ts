export default defineNuxtConfig({
  modules: [
    '@nuxt/content',
    'nuxt-studio'
  ],

  studio: {
    // Studio will be at /admin instead of the default /_studio
    route: '/admin',
    git: {
      commit: {
        messagePrefix: 'content:'
      }
    }
  },

  content: {
    // Skills and connectors live in content/
  },

  // Vercel auto-detects git provider, but set explicitly as fallback
  // studio.repository is auto-populated from VERCEL_GIT_* env vars

  compatibilityDate: '2025-01-01'
})
