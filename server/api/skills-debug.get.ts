import { defineEventHandler } from 'h3'

// queryCollection is not available in Nitro server routes — removed
export default defineEventHandler(() => ({ note: 'use /__nuxt_content directly' }))
