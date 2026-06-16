import { defineEventHandler, readBody, createError } from 'h3'
import { requireStudioAuth } from '../../utils/studio-auth'

export default defineEventHandler(async (event) => {
  const user = await requireStudioAuth(event) as any

  const body = await readBody(event)
  const { name, description, instructions } = body

  if (!name || !description || !instructions) {
    throw createError({ statusCode: 400, message: 'name, description and instructions are required' })
  }

  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')

  const skillMd = [
    '---',
    `name: ${slug}`,
    `description: >`,
    `  ${description}`,
    '---',
    '',
    `# ${name}`,
    '',
    instructions
  ].join('\n')

  const token = user.accessToken
  const owner = process.env.VERCEL_GIT_REPO_OWNER || process.env.GITHUB_OWNER
  const repo = process.env.VERCEL_GIT_REPO_SLUG || process.env.GITHUB_REPO

  if (!token || !owner || !repo) {
    throw createError({ statusCode: 500, message: 'GitHub configuration missing' })
  }

  const path = `skills/${slug}/SKILL.md`
  const encoded = Buffer.from(skillMd).toString('base64')

  // Check if file already exists (need its SHA to update)
  let sha: string | undefined
  try {
    const existing: any = await $fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${path}`, {
      headers: { Authorization: `token ${token}`, 'User-Agent': 'chronoshub-studio' }
    })
    sha = existing.sha
  } catch {}

  await $fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${path}`, {
    method: 'PUT',
    headers: {
      Authorization: `token ${token}`,
      'Content-Type': 'application/json',
      'User-Agent': 'chronoshub-studio'
    },
    body: {
      message: `skill: add ${slug}`,
      content: encoded,
      ...(sha ? { sha } : {})
    }
  })

  return { success: true, slug }
})
