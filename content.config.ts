import { defineContentConfig, defineCollection, z } from '@nuxt/content'

export default defineContentConfig({
  collections: {
    skills: defineCollection({
      type: 'page',
      source: 'skills/**',
      schema: z.object({
        name: z.string(),
        title: z.string(),
        description: z.string(),
        version: z.string().optional(),
        author: z.string().optional(),
        tags: z.array(z.string()).optional(),
        triggers: z.array(z.string()).optional(),
        enabled: z.boolean().optional()
      })
    }),
    connectors: defineCollection({
      type: 'page',
      source: 'connectors/**',
      schema: z.object({
        name: z.string(),
        title: z.string(),
        description: z.string(),
        version: z.string().optional(),
        provider: z.string().optional(),
        category: z.string().optional(),
        tags: z.array(z.string()).optional(),
        enabled: z.boolean().optional(),
        setupUrl: z.string().optional(),
        requiredScopes: z.array(z.string()).optional()
      })
    })
  }
})
