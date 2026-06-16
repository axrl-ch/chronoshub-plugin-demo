import { defineEventHandler } from 'h3'

export default defineEventHandler(async () => {
  const storage = useStorage('assets:skills')

  let keys: string[]
  try {
    keys = await storage.getKeys()
  } catch (e: any) {
    return { skills: [], debug: { error: String(e?.message) } }
  }

  // Keys look like "boop:SKILL.md" or "chronoshub-pptx:SKILL.md"
  const skillMdKeys = keys.filter(k => k.endsWith(':SKILL.md') || k.endsWith(':skill.md'))

  const skills = await Promise.all(
    skillMdKeys.map(async (key) => {
      const slug = key.split(':')[0]
      try {
        const content = await storage.getItem(key) as string

        const nameMatch = content.match(/^name:\s*(.+)/m)
        const descMatch = content.match(/^description:\s*[>|]?\s*\n?((?:[ \t]+.+\n?)+|.+)/m)

        const name = nameMatch?.[1]?.trim() || slug
        let description = descMatch?.[1]?.trim().replace(/\s+/g, ' ') || ''
        const firstSentence = description.match(/^[^.!?]+[.!?]/)
        if (firstSentence) description = firstSentence[0]

        return { slug, name, description }
      } catch {
        return null
      }
    })
  )

  return { skills: skills.filter(Boolean) }
})
