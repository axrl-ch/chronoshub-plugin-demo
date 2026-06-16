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
      <a
        v-for="skill in skills"
        :key="skill.slug"
        :href="`/studio/edit-skill/${skill.slug}`"
        style="border:1px solid #e5e5e5; border-radius:8px; padding:1rem 1.25rem; display:flex; justify-content:space-between; align-items:center; cursor:pointer; text-decoration:none; color:inherit; transition:border-color 0.15s;"
        @mouseenter="e => e.currentTarget.style.borderColor='#aaa'"
        @mouseleave="e => e.currentTarget.style.borderColor='#e5e5e5'"
      >
        <div>
          <div style="font-weight:600; font-size:0.95rem; margin-bottom:0.2rem;">{{ skill.name }}</div>
          <div style="font-size:0.825rem; color:#666; max-width:520px;">{{ skill.description }}</div>
        </div>
        <div style="display:flex; align-items:center; gap:0.75rem; flex-shrink:0; margin-left:1rem;">
          <code style="font-size:0.75rem; color:#999; background:#f5f5f5; padding:2px 8px; border-radius:4px;">{{ skill.slug }}</code>
          <span style="font-size:0.75rem; color:#bbb;">›</span>
        </div>
      </a>
    </div>
  </main>
</template>

<script setup>
const skillFiles = import.meta.glob('~/skills/**/SKILL.md', { as: 'raw', eager: true })

function parseFrontmatter(raw) {
  const match = raw.match(/^---\n([\s\S]*?)\n---/)
  if (!match) return { name: '', description: '', body: raw }
  const fm = match[1]
  const get = (pattern) => fm.match(pattern)?.[1]?.trim() || ''
  const desc = fm.match(/^description:\s*[>|]?\s*\n((?:[ \t]+.+\n?)+)/m)
  const body = raw.slice(match[0].length).trim()
  return {
    name: get(/^name:\s*(.+)/m),
    description: desc ? desc[1].trim().replace(/\s+/g, ' ') : get(/^description:\s*(.+)/m),
    body
  }
}

const skills = Object.entries(skillFiles)
  .map(([path, raw]) => {
    const slug = path.split('/').slice(-2)[0]
    const fm = parseFrontmatter(raw)
    return { slug, name: fm.name || slug, description: fm.description, body: fm.body }
  })
  .filter(s => s.slug)
  .sort((a, b) => a.name.localeCompare(b.name))

</script>
