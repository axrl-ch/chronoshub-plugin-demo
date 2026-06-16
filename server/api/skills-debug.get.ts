import { defineEventHandler } from 'h3'

export default defineEventHandler(async () => {
  try {
    const skills = await queryCollection('skills').all()
    return { ok: true, count: skills.length, skills }
  } catch (e: any) {
    return { ok: false, error: e?.message, stack: e?.stack?.split('\n').slice(0, 5) }
  }
})
