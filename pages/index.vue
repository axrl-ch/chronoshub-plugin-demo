<template>
  <main style="max-width:720px; margin:0 auto; padding:2rem; font-family:system-ui,sans-serif;">
    <div style="display:flex; align-items:baseline; justify-content:space-between; margin-bottom:2rem;">
      <h1 style="font-size:1.5rem; font-weight:700; margin:0;">ChronosHub Plugin</h1>
      <div style="display:flex; gap:1rem; font-size:0.875rem;">
        <a href="/studio/new-skill" style="color:#1a1a1a; font-weight:600; text-decoration:none;">+ Add skill</a>
        <a href="/admin" style="color:#666; text-decoration:none;">Studio →</a>
      </div>
    </div>

    <div v-if="!skills.length" style="color:#888; font-size:0.9rem; padding:2rem 0; text-align:center;">
      No skills yet. <a href="/studio/new-skill" style="color:#1a1a1a;">Add the first one →</a>
    </div>
    <div v-else style="display:flex; flex-direction:column; gap:0.75rem;">
      <div
        v-for="skill in skills"
        :key="skill.slug"
        style="border:1px solid #e5e5e5; border-radius:8px; padding:1rem 1.25rem; display:flex; justify-content:space-between; align-items:center;"
      >
        <div>
          <div style="font-weight:600; font-size:0.95rem; margin-bottom:0.2rem;">{{ skill.name }}</div>
          <div style="font-size:0.825rem; color:#666; max-width:520px;">{{ skill.description }}</div>
        </div>
        <code style="font-size:0.75rem; color:#999; background:#f5f5f5; padding:2px 8px; border-radius:4px; white-space:nowrap; margin-left:1rem;">{{ skill.slug }}</code>
      </div>
    </div>
  </main>
</template>

<script setup>
// Read skill markdown files at build time via Vite glob — no SQLite/native modules needed
const skillFiles = import.meta.glob('~/skills/**/SKILL.md', { as: 'raw', eager: true })

function parseFrontmatter(raw) {
  const match = raw.match(/^---\n([\s\S]*?)\n---/)
  if (!match) return {}
  const fm = match[1]
  const get = (pattern) => fm.match(pattern)?.[1]?.trim() || ''
  const desc = fm.match(/^description:\s*[>|]?\s*\n((?:[ \t]+.+\n?)+)/m)
  return {
    title: get(/^title:\s*(.+)/m),
    name: get(/^name:\s*(.+)/m),
    description: desc ? desc[1].trim().replace(/\s+/g, ' ') : get(/^description:\s*(.+)/m)
  }
}

const skills = Object.entries(skillFiles)
  .map(([path, raw]) => {
    // Slug is the folder name: skills/<slug>/SKILL.md
    const slug = path.split('/').slice(-2)[0]
    const fm = parseFrontmatter(raw)
    if (!fm.name && !slug) return null
    const name = fm.name || slug
    return { slug, name, description: fm.description }
  })
  .filter(Boolean)
  .sort((a, b) => a.name.localeCompare(b.name))
</script>
