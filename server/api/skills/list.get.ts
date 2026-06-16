import { defineEventHandler, createError } from 'h3'

export default defineEventHandler(async () => {
  const owner = process.env.VERCEL_GIT_REPO_OWNER || process.env.GITHUB_OWNER
  const repo = process.env.VERCEL_GIT_REPO_SLUG || process.env.GITHUB_REPO
  const token = process.env.STUDIO_GITHUB_TOKEN

  if (!owner || !repo) {
    throw createError({ statusCode: 500, message: 'GitHub configuration missing' })
  }

  const headers: Record<string, string> = { 'User-Agent': 'chronoshub-studio' }
  if (token) headers['Authorization'] = `token ${token}`

  // List top-level entries in skills/
  let entries: any[]
  try {
    entries = await $fetch<any[]>(`https://api.github.com/repos/${owner}/${repo}/contents/skills`, { headers })
  } catch (e: any) {
    return { skills: [], debug: { error: String(e?.message || e), owner, repo, hasToken: !!token } }
  }

  const skillDirs = entries.filter((e: any) => e.type === 'dir')

  // Fetch SKILL.md for each to extract name + description
  const skills = await Promise.all(
    skillDirs.map(async (dir: any) => {
      try {
        const file: any = await $fetch(
          `https://api.github.com/repos/${owner}/${repo}/contents/skills/${dir.name}/SKILL.md`,
          { headers }
        )
        const content = Buffer.from(file.content, 'base64').toString('utf8')

        // Parse frontmatter name and description
        const nameMatch = content.match(/^name:\s*(.+)/m)
        const descMatch = content.match(/^description:\s*[>|]?\s*\n?((?:[ \t]+.+\n?)+|.+)/m)

        const name = nameMatch?.[1]?.trim() || dir.name
        let description = descMatch?.[1]?.trim().replace(/\s+/g, ' ') || ''
        // Trim to first sentence for display
        const firstSentence = description.match(/^[^.!?]+[.!?]/)
        if (firstSentence) description = firstSentence[0]

        return { slug: dir.name, name, description }
      } catch {
        return { slug: dir.name, name: dir.name, description: '' }
      }
    })
  )

  return { skills }
})
