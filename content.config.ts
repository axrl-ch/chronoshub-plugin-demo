import { defineContentConfig, defineCollection } from '@nuxt/content'

export default defineContentConfig({
  collections: {
    skills: defineCollection({
      type: 'page',
      source: 'skills/**'
    }),
    connectors: defineCollection({
      type: 'page',
      source: 'connectors/**'
    })
  }
})
