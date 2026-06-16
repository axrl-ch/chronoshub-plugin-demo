import { defineEventHandler, readBody, createError } from 'h3'
import { requireStudioAuth } from '../../utils/studio-auth'

async function githubDelete(token: string, owner: string, repo: string, path: string, message: string) {
  const headers = { Authorization: `token ${token}`, 'Content-Type': 'application/json', 'User-Agent': 'chronoshub-studio' }
  let sha: string | undefined
  try {
    const existing: any = await $fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${path}`, { headers })
    sha = existing.sha
  } catch {
    return // file doesn't exist, nothing to delete
  }
  await $fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${path}`, {
    method: 'DELETE',
    headers,
    body: { message, sha }
  })
}

export default defineEventHandler(async (event) => {
  const user = await requireStudioAuth(event) as any
  const body = await readBody(event)
  const { slug } = body

  if (!slug) throw createError({ statusCode: 400, message: 'slug is required' })

  const token = user.accessToken
  const owner = process.env.VERCEL_GIT_REPO_OWNER || process.env.GITHUB_OWNER
  const repo = process.env.VERCEL_GIT_REPO_SLUG || process.env.GITHUB_REPO

  if (!token || !owner || !repo) throw createError({ statusCode: 500, message: 'GitHub configuration missing' })

  await githubDelete(token, owner, repo, `skills/${slug}/SKILL.md`, `skill: remove ${slug}`)
  await githubDelete(token, owner, repo, `content/skills/${slug}.md`, `content: remove skill entry for ${slug}`)

  return { success: true, slug }
})
