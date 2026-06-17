<template>
  <main class="page-wide">
    <div class="index-header">
      <h1 class="index-title">ChronosHub Plugin</h1>
      <div class="index-actions">
        <a href="/studio/new-skill" class="btn-add-skill">+ Add skill</a>
      </div>
    </div>

    <!-- TEMP DEBUG - remove after diagnosis -->
    <pre v-if="debugLog" style="font-size:0.7rem; background:var(--bg-muted); border:1px solid var(--border); border-radius:6px; padding:0.75rem; margin-bottom:1rem; white-space:pre-wrap; word-break:break-all; color:var(--text-muted);">{{ debugLog }}</pre>

    <div v-if="!skills.length" class="empty-state">
      No skills yet. <a href="/studio/new-skill" class="empty-link">Add the first one →</a>
    </div>
    <div v-else class="skill-list">
      <div
        v-for="skill in skills"
        :key="skill.slug"
        class="skill-card"
        @click="expandedDesc[skill.slug] = !expandedDesc[skill.slug]"
      >
        <div style="flex:1; min-width:0;">
          <div class="skill-name">{{ skill.name }}</div>
          <div class="skill-desc" :class="{ expanded: expandedDesc[skill.slug] }">{{ skill.description }}</div>
        </div>
        <div class="skill-card-right">
          <a :href="`/studio/edit-skill/${skill.slug}`" class="edit-btn" @click.stop>Edit</a>
        </div>
      </div>
    </div>
  </main>
</template>

<style>
.index-header {
  display: flex; align-items: baseline; justify-content: space-between; margin-bottom: 2rem;
}
.index-title { font-size: 1.725rem; font-weight: 700; margin: 0; color: var(--text); }
.index-actions { display: flex; gap: 1rem; align-items: center; font-size: 1rem; }
.btn-add-skill {
  color: #fff; font-weight: 600; text-decoration: none;
  background: #16a34a; padding: 0.4rem 1rem; border-radius: 6px;
}
.btn-add-skill:hover { background: #15803d; }
.index-login { color: var(--text-subtle); text-decoration: none; }
.index-login:hover { color: var(--text); }

.empty-state { color: var(--text-subtle); font-size: 1.035rem; padding: 2rem 0; text-align: center; }
.empty-link { color: var(--text); }

.skill-list { display: flex; flex-direction: column; gap: 0.75rem; }

.skill-card {
  border: 1px solid var(--border);
  border-radius: 8px; padding: 1rem 1.25rem;
  display: flex; justify-content: space-between; align-items: center;
  cursor: pointer; background: var(--bg-card);
  transition: border-color 0.15s;
}
.skill-card:hover { border-color: var(--text-subtle); }

.skill-name { font-weight: 600; font-size: 1.09rem; margin-bottom: 0.2rem; color: var(--text); }
.skill-card:hover .skill-name { text-decoration: underline; }

.skill-desc {
  font-size: 0.95rem; color: var(--text-muted);
  display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;
}
.skill-desc.expanded { display: block; overflow: visible; -webkit-line-clamp: unset; }

.skill-card-right { display: flex; align-items: center; flex-shrink: 0; margin-left: 1rem; align-self: center; }

.edit-btn {
  background: var(--bg-muted); color: var(--text-muted);
  border: none; border-radius: 6px;
  padding: 0.35rem 0.875rem; font-size: 0.875rem; font-weight: 500;
  cursor: pointer; text-decoration: none; white-space: nowrap;
}
.edit-btn:hover { color: var(--text); }
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

const debugLog = ref('')
onMounted(() => {
  const raw = localStorage.getItem('_auth_debug_log')
  if (raw) {
    try { debugLog.value = JSON.stringify(JSON.parse(raw), null, 2) }
    catch { debugLog.value = raw }
  }
})
</script>
