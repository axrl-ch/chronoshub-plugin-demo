<template>
  <main style="max-width:680px; margin:0 auto; padding:2rem; font-family:system-ui,sans-serif;">
    <nav style="margin-bottom:1.5rem; font-size:0.875rem; color:#666;">
      <a href="/" style="color:#666; text-decoration:none;">Home</a> / Edit skill
    </nav>

    <div v-if="!skill" style="color:#888; padding:2rem 0; text-align:center;">
      Skill <code>{{ route.params.slug }}</code> not found.
      <br><a href="/" style="color:#1a1a1a;">← Back</a>
    </div>

    <template v-else>
      <h1 style="font-size:1.5rem; font-weight:700; margin:0 0 0.25rem;">Edit skill</h1>
      <p style="color:#555; margin:0 0 2rem;">Changes are committed directly to the repository.</p>

      <form @submit.prevent="submitForm">
        <div style="margin-bottom:1.25rem;">
          <label style="display:block; font-weight:600; margin-bottom:0.4rem;">Skill name</label>
          <input
            v-model="form.name"
            required
            style="width:100%; padding:0.6rem 0.75rem; border:1px solid #ccc; border-radius:6px; font-size:0.95rem; box-sizing:border-box;"
          />
          <p style="margin:0.25rem 0 0; font-size:0.8rem; color:#888;">
            Slug: <code>{{ slug }}</code>
            <span v-if="slug !== route.params.slug" style="color:#b45309; margin-left:0.5rem;">⚠ This will create a new skill — rename won't delete the old one.</span>
          </p>
        </div>

        <div style="margin-bottom:1.25rem;">
          <label style="display:block; font-weight:600; margin-bottom:0.4rem;">Description. When should Claude use this skill?</label>
          <textarea
            v-model="form.description"
            required
            rows="3"
            style="width:100%; padding:0.6rem 0.75rem; border:1px solid #ccc; border-radius:6px; font-size:0.95rem; box-sizing:border-box; resize:vertical;"
          />
        </div>

        <div style="margin-bottom:1.75rem;">
          <label style="display:block; font-weight:600; margin-bottom:0.4rem;">Instructions for Claude (Markdown)</label>
          <textarea
            v-model="form.instructions"
            required
            rows="16"
            style="width:100%; padding:0.6rem 0.75rem; border:1px solid #ccc; border-radius:6px; font-size:0.9rem; font-family:monospace; box-sizing:border-box; resize:vertical;"
          />
        </div>

        <div v-if="error" style="background:#fef2f2; border:1px solid #fca5a5; border-radius:6px; padding:0.75rem 1rem; margin-bottom:1rem; color:#b91c1c; font-size:0.9rem;">
          {{ error }}
        </div>

        <div style="display:flex; gap:0.75rem; align-items:center; justify-content:space-between;">
          <div style="display:flex; gap:0.75rem; align-items:center;">
            <button
              type="submit"
              :disabled="loading"
              style="background:#1a1a1a; color:#fff; border:none; border-radius:6px; padding:0.7rem 1.5rem; font-size:0.95rem; font-weight:600; cursor:pointer;"
              :style="loading ? 'opacity:0.6; cursor:not-allowed;' : ''"
            >
              {{ loading ? 'Saving…' : 'Save changes' }}
            </button>
            <a href="/" style="font-size:0.875rem; color:#666; text-decoration:none;">Cancel</a>
          </div>
          <button
            type="button"
            @click="showDeleteConfirm = true"
            style="background:none; border:1px solid #fca5a5; color:#b91c1c; border-radius:6px; padding:0.7rem 1.25rem; font-size:0.875rem; font-weight:600; cursor:pointer;"
          >
            Remove skill
          </button>
        </div>
      </form>

      <!-- Delete confirmation modal -->
      <div
        v-if="showDeleteConfirm"
        style="position:fixed; inset:0; background:rgba(0,0,0,0.4); display:flex; align-items:center; justify-content:center; z-index:100;"
        @click.self="showDeleteConfirm = false"
      >
        <div style="background:#fff; border-radius:12px; padding:2rem; max-width:400px; width:90%; box-shadow:0 8px 32px rgba(0,0,0,0.2);">
          <h2 style="font-size:1.1rem; font-weight:700; margin:0 0 0.5rem;">Remove skill?</h2>
          <p style="color:#555; margin:0 0 1.5rem; font-size:0.9rem;">
            This will permanently delete <strong>{{ skill.name }}</strong> from the repository. This cannot be undone.
          </p>
          <div v-if="deleteError" style="background:#fef2f2; border:1px solid #fca5a5; border-radius:6px; padding:0.6rem 0.875rem; margin-bottom:1rem; color:#b91c1c; font-size:0.875rem;">
            {{ deleteError }}
          </div>
          <div style="display:flex; gap:0.75rem; justify-content:flex-end;">
            <button
              @click="showDeleteConfirm = false"
              style="background:none; border:1px solid #ddd; border-radius:6px; padding:0.6rem 1.25rem; font-size:0.875rem; cursor:pointer; color:#333;"
            >
              Cancel
            </button>
            <button
              @click="deleteSkill"
              :disabled="deleteLoading"
              style="background:#b91c1c; color:#fff; border:none; border-radius:6px; padding:0.6rem 1.25rem; font-size:0.875rem; font-weight:600; cursor:pointer;"
              :style="deleteLoading ? 'opacity:0.6; cursor:not-allowed;' : ''"
            >
              {{ deleteLoading ? 'Removing…' : 'Yes, remove it' }}
            </button>
          </div>
        </div>
      </div>
    </template>

    <!-- Success toast -->
    <div v-if="success" style="position:fixed; bottom:2rem; right:2rem; background:#16a34a; color:#fff; border-radius:8px; padding:1rem 1.5rem; font-weight:600; box-shadow:0 4px 16px rgba(0,0,0,0.15); max-width:320px;">
      ✓ Skill <code style="background:rgba(255,255,255,0.2); padding:0 4px; border-radius:3px;">{{ success }}</code> saved!
      <br><span style="font-size:0.85rem; font-weight:400; opacity:0.9;">Deploying now — ready in ~1 min.</span>
    </div>
  </main>
</template>

<script setup>
const route = useRoute()

// Load all skills at build time and find the one matching the slug
const skillFiles = import.meta.glob('~/skills/**/SKILL.md', { as: 'raw', eager: true })

function parseFrontmatter(raw) {
  const match = raw.match(/^---\n([\s\S]*?)\n---/)
  if (!match) return { name: '', description: '', instructions: raw }
  const fm = match[1]
  const get = (pattern) => fm.match(pattern)?.[1]?.trim() || ''
  const descBlock = fm.match(/^description:\s*[>|]?\s*\n((?:[ \t]+.+\n?)+)/m)
  const description = descBlock
    ? descBlock[1].trim().replace(/\s+/g, ' ')
    : get(/^description:\s*(.+)/m)
  const instructions = raw.slice(match[0].length).trim()
  return { name: get(/^name:\s*(.+)/m), description, instructions }
}

const skill = computed(() => {
  const entry = Object.entries(skillFiles).find(([path]) => {
    const s = path.split('/').slice(-2)[0]
    return s === route.params.slug
  })
  if (!entry) return null
  const [, raw] = entry
  return parseFrontmatter(raw)
})

const form = reactive({ name: '', description: '', instructions: '' })

// Pre-fill form once skill is resolved
watch(skill, (s) => {
  if (s) {
    form.name = s.name || route.params.slug
    form.description = s.description
    form.instructions = s.instructions
  }
}, { immediate: true })

const slug = computed(() =>
  form.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
)

const loading = ref(false)
const error = ref('')
const success = ref('')
const showDeleteConfirm = ref(false)
const deleteLoading = ref(false)
const deleteError = ref('')

async function deleteSkill() {
  deleteError.value = ''
  deleteLoading.value = true
  try {
    await $fetch('/api/skills/delete', {
      method: 'DELETE',
      body: { slug: route.params.slug }
    })
    navigateTo('/')
  } catch (e) {
    deleteError.value = e?.data?.message || 'Delete failed. Try again.'
    deleteLoading.value = false
  }
}

async function submitForm() {
  error.value = ''
  loading.value = true
  try {
    const res = await $fetch('/api/skills/create', {
      method: 'POST',
      body: { name: form.name, description: form.description, instructions: form.instructions }
    })
    success.value = res.slug
    setTimeout(() => success.value = '', 8000)
  } catch (e) {
    error.value = e?.data?.message || 'Something went wrong. Try again.'
  } finally {
    loading.value = false
  }
}
</script>
