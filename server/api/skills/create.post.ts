import { defineEventHandler, readBody, createError } from 'h3'
import { requireStudioAuth } from '../../utils/studio-auth'

async function githubPut(token: string, owner: string, repo: string, path: string, content: string, message: string) {
  const headers = { Authorization: `token ${token}`, 'Content-Type': 'application/json', 'User-Agent': 'chronoshub-studio' }
  let sha: string | undefined
  try {
    const existing: any = await $fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${path}`, { headers })
    sha = existing.sha
  } catch {}
  await $fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${path}`, {
    method: 'PUT',
    headers,
    body: { message, content, ...(sha ? { sha } : {}) }
  })
}

export default defineEventHandler(async (event) => {
  const user = await requireStudioAuth(event) as any
  const body = await readBody(event)
  const { name, description, instructions } = body

  if (!name || !description || !instructions) {
    throw createError({ statusCode: 400, message: 'name, description and instructions are required' })
  }

  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
  const token = user.accessToken
  const owner = process.env.VERCEL_GIT_REPO_OWNER || process.env.GITHUB_OWNER
  const repo = process.env.VERCEL_GIT_REPO_SLUG || process.env.GITHUB_REPO

  if (!token || !owner || !repo) {
    throw createError({ statusCode: 500, message: 'GitHub configuration missing' })
  }

  // 1. Write skills/<slug>/SKILL.md (the actual plugin file)
  const skillMd = ['---', `name: ${slug}`, `description: >`, `  ${description}`, '---', '', `# ${name}`, '', instructions].join('\n')
  await githubPut(token, owner, repo, `skills/${slug}/SKILL.md`, Buffer.from(skillMd).toString('base64'), `skill: add ${slug}`)

  // 2. Write content/skills/<slug>.md (the CMS metadata entry so it shows on the homepage)
  const contentMd = [
    '---',
    `title: ${name}`,
    `name: ${slug}`,
    `description: >`,
    `  ${description}`,
    `enabled: true`,
    '---'
  ].join('\n')
  await githubPut(token, owner, repo, `content/skills/${slug}.md`, Buffer.from(contentMd).toString('base64'), `content: add skill entry for ${slug}`)

  return { success: true, slug }
})
