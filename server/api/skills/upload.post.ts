import { defineEventHandler, readMultipartFormData, createError } from 'h3'
import { requireStudioAuth } from '../../utils/studio-auth'
import AdmZip from 'adm-zip'

export default defineEventHandler(async (event) => {
  await requireStudioAuth(event)

  const form = await readMultipartFormData(event)
  const file = form?.find(f => f.name === 'file')

  if (!file?.data) {
    throw createError({ statusCode: 400, message: 'No file uploaded' })
  }

  const token = process.env.STUDIO_GITHUB_TOKEN
  const owner = process.env.VERCEL_GIT_REPO_OWNER || process.env.GITHUB_OWNER
  const repo = process.env.VERCEL_GIT_REPO_SLUG || process.env.GITHUB_REPO

  if (!token || !owner || !repo) {
    throw createError({ statusCode: 500, message: 'GitHub configuration missing' })
  }

  // Parse the zip
  const zip = new AdmZip(file.data)
  const entries = zip.getEntries()

  // Find the skill name from the root folder or SKILL.md
  const skillMdEntry = entries.find(e => e.entryName.endsWith('SKILL.md'))
  if (!skillMdEntry) {
    throw createError({ statusCode: 400, message: 'No SKILL.md found in the zip' })
  }

  // Determine skill slug from root directory name or SKILL.md frontmatter
  const parts = skillMdEntry.entryName.split('/')
  const skillSlug = parts.length > 1
    ? parts[0]
    : skillMdEntry.getData().toString('utf8').match(/^name:\s*(.+)/m)?.[1]?.trim() || 'unknown-skill'

  // Commit each file
  const committed: string[] = []

  for (const entry of entries) {
    if (entry.isDirectory) continue

    // Strip the leading folder name if present
    let filePath = entry.entryName
    if (parts.length > 1) {
      filePath = entry.entryName.replace(/^[^/]+\//, '')
    }
    if (!filePath) continue

    const fullPath = `skills/${skillSlug}/${filePath}`
    const content = entry.getData().toString('base64')

    // Check for existing SHA
    let sha: string | undefined
    try {
      const existing: any = await $fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${fullPath}`, {
        headers: { Authorization: `token ${token}`, 'User-Agent': 'chronoshub-studio' }
      })
      sha = existing.sha
    } catch {}

    await $fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${fullPath}`, {
      method: 'PUT',
      headers: {
        Authorization: `token ${token}`,
        'Content-Type': 'application/json',
        'User-Agent': 'chronoshub-studio'
      },
      body: {
        message: `skill: upload ${skillSlug} (${filePath})`,
        content,
        ...(sha ? { sha } : {})
      }
    })

    committed.push(fullPath)
  }

  return { success: true, slug: skillSlug, files: committed }
})
