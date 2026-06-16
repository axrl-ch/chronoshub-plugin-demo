<template>
  <main class="page">
    <nav class="page-nav">
      <a href="/">Home</a> / Edit skill
    </nav>

    <div v-if="!skill" style="color:var(--text-subtle); padding:2rem 0; text-align:center;">
      Skill <code>{{ route.params.slug }}</code> not found.
      <br><a href="/" style="color:var(--text);">← Back</a>
    </div>

    <template v-else>
      <h1 class="page-title">Edit skill</h1>
      <p class="page-subtitle">Changes are committed directly to the repository.</p>

      <form @submit.prevent="submitForm">
        <div class="form-group">
          <label class="form-label">Skill name</label>
          <input v-model="form.name" required class="form-input" />
          <p class="form-hint">
            Slug: <code>{{ slug }}</code>
            <span v-if="slug !== route.params.slug" class="rename-warn">⚠ This will create a new skill — rename won't delete the old one.</span>
          </p>
        </div>

        <div class="form-group">
          <label class="form-label">Description — when should Claude use this skill?</label>
          <textarea v-model="form.description" required rows="3" class="form-textarea" />
        </div>

        <div class="form-group-lg">
          <label class="form-label">Instructions for Claude (Markdown)</label>
          <textarea v-model="form.instructions" required rows="16" class="form-textarea form-textarea-mono" />
        </div>

        <div v-if="error" class="form-error">{{ error }}</div>

        <div class="form-actions-spread">
          <div class="form-actions">
            <button type="submit" :disabled="loading" class="btn-primary">
              {{ loading ? 'Saving…' : 'Save changes' }}
            </button>
            <a href="/" class="btn-cancel">Cancel</a>
          </div>
          <button type="button" @click="showDeleteConfirm = true" class="btn-danger-outline">
            Remove skill
          </button>
        </div>
      </form>

      <!-- Delete confirmation modal -->
      <div v-if="showDeleteConfirm" class="modal-overlay" @click.self="showDeleteConfirm = false">
        <div class="modal-box">
          <h2 class="modal-title">Remove skill?</h2>
          <p class="modal-body">
            This will permanently delete <strong>{{ skill.name }}</strong> from the repository. This cannot be undone.
          </p>
          <div v-if="deleteError" class="form-error">{{ deleteError }}</div>
          <div class="modal-actions">
            <button @click="showDeleteConfirm = false" class="btn-modal-cancel">Cancel</button>
            <button @click="deleteSkill" :disabled="deleteLoading" class="btn-modal-danger">
              {{ deleteLoading ? 'Removing…' : 'Yes, remove it' }}
            </button>
          </div>
        </div>
      </div>
    </template>

    <div v-if="success" class="toast-success">
      ✓ Skill <code>{{ success }}</code> saved!
      <br><span class="toast-detail">Deploying now — ready in ~1 min.</span>
    </div>
  </main>
</template>

<script setup>
const route = useRoute()

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
  const entry = Object.entries(skillFiles).find(([path]) => path.split('/').slice(-2)[0] === route.params.slug)
  if (!entry) return null
  return parseFrontmatter(entry[1])
})

const form = reactive({ name: '', description: '', instructions: '' })

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
    await $fetch('/api/skills/delete', { method: 'DELETE', body: { slug: route.params.slug } })
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
