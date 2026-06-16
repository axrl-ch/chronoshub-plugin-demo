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
        style="border:1px solid #e5e5e5; border-radius:8px; overflow:hidden;"
      >
        <!-- Header row — click to expand -->
        <div
          @click="toggle(skill.slug)"
          style="padding:1rem 1.25rem; display:flex; justify-content:space-between; align-items:center; cursor:pointer; user-select:none;"
          :style="expanded[skill.slug] ? 'border-bottom:1px solid #e5e5e5;' : ''"
        >
          <div>
            <div style="font-weight:600; font-size:0.95rem; margin-bottom:0.2rem;">{{ skill.name }}</div>
            <div style="font-size:0.825rem; color:#666; max-width:520px;">{{ skill.description }}</div>
          </div>
          <div style="display:flex; align-items:center; gap:0.75rem; flex-shrink:0; margin-left:1rem;">
            <code style="font-size:0.75rem; color:#999; background:#f5f5f5; padding:2px 8px; border-radius:4px;">{{ skill.slug }}</code>
            <span style="font-size:0.75rem; color:#bbb;">{{ expanded[skill.slug] ? '▲' : '▼' }}</span>
          </div>
        </div>

        <!-- Expanded markdown body -->
        <div v-if="expanded[skill.slug]" style="padding:1.25rem 1.5rem; background:#fafafa;">
          <MDC :value="skill.body" tag="article" class="skill-body" />
        </div>
      </div>
    </div>
  </main>
</template>

<style>
.skill-body h1 { display: none; } /* hide the # SkillName heading — redundant with card header */
.skill-body h2 { font-size: 1rem; font-weight: 700; margin: 1.25rem 0 0.4rem; }
.skill-body h3 { font-size: 0.9rem; font-weight: 600; margin: 1rem 0 0.3rem; }
.skill-body p { font-size: 0.875rem; color: #444; margin: 0 0 0.6rem; line-height: 1.6; }
.skill-body pre { background: #1a1a1a; color: #e5e5e5; border-radius: 6px; padding: 0.75rem 1rem; font-size: 0.8rem; overflow-x: auto; margin: 0.5rem 0 0.75rem; }
.skill-body code:not(pre code) { background: #f0f0f0; padding: 1px 5px; border-radius: 3px; font-size: 0.82rem; }
.skill-body ul, .skill-body ol { font-size: 0.875rem; color: #444; padding-left: 1.25rem; margin: 0 0 0.6rem; }
.skill-body li { margin-bottom: 0.2rem; line-height: 1.5; }
.skill-body table { font-size: 0.8rem; border-collapse: collapse; width: 100%; margin: 0.5rem 0; }
.skill-body th, .skill-body td { border: 1px solid #e5e5e5; padding: 0.4rem 0.6rem; text-align: left; }
.skill-body th { background: #f5f5f5; font-weight: 600; }
</style>

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

const expanded = reactive({})
function toggle(slug) {
  expanded[slug] = !expanded[slug]
}
</script>
