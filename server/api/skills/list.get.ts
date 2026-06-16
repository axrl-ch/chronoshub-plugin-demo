import { defineEventHandler } from 'h3'
import { readdir, readFile } from 'fs/promises'
import { join, resolve } from 'path'

export default defineEventHandler(async () => {
  // Skills folder is bundled with the deployment — read from filesystem
  const skillsDir = resolve(process.cwd(), 'skills')

  let dirs: string[]
  try {
    const entries = await readdir(skillsDir, { withFileTypes: true })
    dirs = entries.filter(e => e.isDirectory()).map(e => e.name)
  } catch (e: any) {
    return { skills: [], debug: { cwd: process.cwd(), skillsDir, error: String(e?.message) } }
  }

  const skills = await Promise.all(
    dirs.map(async (slug) => {
      try {
        const content = await readFile(join(skillsDir, slug, 'SKILL.md'), 'utf8')

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
