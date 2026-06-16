<template>
  <main style="max-width:720px; margin:0 auto; padding:2rem; font-family:system-ui,sans-serif;">
    <div style="display:flex; align-items:baseline; justify-content:space-between; margin-bottom:2rem;">
      <h1 style="font-size:1.725rem; font-weight:700; margin:0;">ChronosHub Plugin</h1>
      <div style="display:flex; gap:1rem; align-items:center; font-size:1rem;">
        <a href="/studio/new-skill" style="color:#fff; font-weight:600; text-decoration:none; background:#16a34a; padding:0.4rem 1rem; border-radius:6px;">+ Add skill</a>
        <a href="/admin" style="color:#666; text-decoration:none;">Login →</a>
      </div>
    </div>

    <div v-if="!skills.length" style="color:#888; font-size:1.035rem; padding:2rem 0; text-align:center;">
      No skills yet. <a href="/studio/new-skill" style="color:#1a1a1a;">Add the first one →</a>
    </div>
    <div v-else style="display:flex; flex-direction:column; gap:0.75rem;">
      <a
        v-for="skill in skills"
        :key="skill.slug"
        :href="`/studio/edit-skill/${skill.slug}`"
        class="skill-card"
      >
        <div style="flex:1; min-width:0;">
          <div class="skill-name">{{ skill.name }}</div>
          <div
            class="skill-desc"
            :class="{ expanded: expandedDesc[skill.slug] }"
          >{{ skill.description }}</div>
          <button
            v-if="skill.description && skill.description.length > 120"
            class="desc-toggle"
            @click.prevent.stop="expandedDesc[skill.slug] = !expandedDesc[skill.slug]"
          >
            {{ expandedDesc[skill.slug] ? 'Show less ▲' : 'Show more ▼' }}
          </button>
        </div>
        <div style="display:flex; align-items:center; gap:0.75rem; flex-shrink:0; margin-left:1rem;">
          <code style="font-size:0.86rem; color:#999; background:#f5f5f5; padding:2px 8px; border-radius:4px;">{{ skill.slug }}</code>
          <span style="font-size:0.86rem; color:#bbb;">›</span>
        </div>
      </a>
    </div>
  </main>
</template>

<style>
.skill-card {
  border: 1px solid #e5e5e5;
  border-radius: 8px;
  padding: 1rem 1.25rem;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  cursor: pointer;
  text-decoration: none;
  color: inherit;
  transition: border-color 0.15s;
}
.skill-card:hover { border-color: #aaa; }
.skill-name {
  font-weight: 600;
  font-size: 1.09rem;
  margin-bottom: 0.2rem;
}
.skill-card:hover .skill-name { text-decoration: underline; }
.skill-desc {
  font-size: 0.95rem;
  color: #666;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.skill-desc.expanded {
  display: block;
  overflow: visible;
  -webkit-line-clamp: unset;
}
.desc-toggle {
  background: none;
  border: none;
  padding: 0;
  margin-top: 0.3rem;
  font-size: 0.8rem;
  color: #999;
  cursor: pointer;
  display: block;
}
.desc-toggle:hover { color: #444; }
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

const expandedDesc = reactive({})
</script>
