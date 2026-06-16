<template>
  <main class="page">
    <nav class="page-nav">
      <a href="/">Home</a> / Add skill
    </nav>

    <h1 class="page-title">Add a new skill</h1>
    <p class="page-subtitle">Skills tell Claude how to handle specific tasks.</p>

    <div class="tab-group">
      <button :class="mode==='form'   ? 'tab-btn tab-btn-active' : 'tab-btn tab-btn-inactive'" @click="mode='form'">Create from scratch</button>
      <button :class="mode==='paste'  ? 'tab-btn tab-btn-active' : 'tab-btn tab-btn-inactive'" @click="mode='paste'">Paste SKILL.md</button>
      <button :class="mode==='upload' ? 'tab-btn tab-btn-active' : 'tab-btn tab-btn-inactive'" @click="mode='upload'">Upload skill folder</button>
    </div>

    <!-- Form mode -->
    <form v-if="mode==='form'" @submit.prevent="submitForm">
      <div class="form-group">
        <label class="form-label">Skill name <span style="font-weight:400; color:var(--text-subtle); font-size:0.85rem;">(same name overwrites existing skill)</span></label>
        <input v-model="form.name" placeholder="e.g. Weekly Report Generator" required class="form-input" />
        <p v-if="form.name" class="form-hint">Saved as: <code>{{ slug }}</code></p>
      </div>

      <div class="form-group">
        <label class="form-label">Description — when should Claude use this skill?</label>
        <textarea
          v-model="form.description"
          placeholder="e.g. Use this skill whenever someone asks to generate a weekly activity report or status update."
          required rows="3" class="form-textarea"
        />
        <p class="form-hint">This is what Claude reads to decide when to apply the skill.</p>
      </div>

      <div class="form-group-lg">
        <label class="form-label">Instructions for Claude (Markdown)</label>
        <textarea
          v-model="form.instructions"
          placeholder="Write step-by-step instructions for what Claude should do. Markdown supported."
          required rows="12" class="form-textarea form-textarea-mono"
        />
      </div>

      <div v-if="error" class="form-error">{{ error }}</div>

      <div class="form-actions">
        <button type="submit" :disabled="loading" class="btn-primary">
          {{ loading ? 'Adding skill…' : 'Add skill' }}
        </button>
        <a href="/" class="btn-cancel">Cancel</a>
      </div>
    </form>

    <!-- Paste mode -->
    <form v-else-if="mode==='paste'" @submit.prevent="submitPaste">
      <div class="form-group-lg">
        <label class="form-label">Paste your SKILL.md content</label>
        <textarea
          v-model="pasteRaw"
          placeholder="---
name: My Skill
description: >
  Use this skill when...
---

# My Skill

Instructions go here..."
          rows="20" class="form-textarea form-textarea-mono"
        />
        <p class="form-hint">Must include <code>name:</code> and <code>description:</code> in the frontmatter (<code>---</code> block at the top).</p>
      </div>

      <!-- Live parse preview -->
      <div v-if="pasteRaw.trim()" class="parse-preview" :class="parsedPaste.valid ? 'parse-ok' : 'parse-warn'">
        <template v-if="parsedPaste.valid">
          ✓ Detected — name: <strong>{{ parsedPaste.name }}</strong>
        </template>
        <template v-else>
          ⚠ {{ parsedPaste.hint }}
          <span v-if="parsedPaste.switchHint"> — try <button type="button" class="inline-link" @click="mode='form'">Create from scratch</button> instead.</span>
        </template>
      </div>

      <div v-if="error" class="form-error">{{ error }}</div>

      <div class="form-actions">
        <button type="submit" :disabled="loading || !pasteRaw.trim()" class="btn-primary">
          {{ loading ? 'Adding skill…' : 'Add skill' }}
        </button>
        <a href="/" class="btn-cancel">Cancel</a>
      </div>
    </form>

    <!-- Upload mode -->
    <form v-else @submit.prevent="submitUpload" enctype="multipart/form-data">
      <div class="upload-zone" @click="$refs.fileInput.click()" @dragover.prevent @drop.prevent="onDrop">
        <div class="upload-icon">📦</div>
        <p class="upload-title">Drop your skill folder here</p>
        <p class="upload-sub">or click to choose a .zip file</p>
        <p v-if="uploadFile" class="upload-filename">{{ uploadFile.name }}</p>
      </div>

      <input ref="fileInput" type="file" accept=".zip" style="display:none" @change="onFileChange" />

      <p class="form-hint" style="margin: 0 0 1.5rem;">
        Zip your skill folder so it contains a <code>SKILL.md</code> at the root or inside a single folder.
      </p>

      <div v-if="error" class="form-error">{{ error }}</div>

      <div class="form-actions">
        <button type="submit" :disabled="loading || !uploadFile" class="btn-primary">
          {{ loading ? 'Uploading…' : 'Upload skill' }}
        </button>
        <a href="/" class="btn-cancel">Cancel</a>
      </div>
    </form>

    <div v-if="success" class="toast-success">
      ✓ Skill <code>{{ success }}</code> added!
      <br><span class="toast-detail">Deploying now — ready in ~1 min.</span>
    </div>
  </main>
</template>

<style>
.parse-preview {
  border-radius: 6px; padding: 0.6rem 0.875rem;
  margin-bottom: 1rem; font-size: 0.875rem;
}
.parse-ok   { background: #052e16; border: 1px solid #166534; color: #4ade80; }
.parse-warn { background: #1c1a09; border: 1px solid #713f12; color: #fbbf24; }
[data-theme="light"] .parse-ok   { background: #f0fdf4; border-color: #bbf7d0; color: #15803d; }
[data-theme="light"] .parse-warn { background: #fffbeb; border-color: #fde68a; color: #92400e; }

.inline-link {
  background: none; border: none; padding: 0; cursor: pointer;
  color: inherit; text-decoration: underline; font-size: inherit; font-family: inherit;
}
</style>

<script setup>
const DRAFT_KEY = '_new_skill_draft'

const mode = ref('form')
const loading = ref(false)
const error = ref('')
const success = ref('')
const uploadFile = ref(null)
const fileInput = ref(null)
const pasteRaw = ref('')

const form = reactive({ name: '', description: '', instructions: '' })

function saveDraft() {
  localStorage.setItem(DRAFT_KEY, JSON.stringify({
    mode: mode.value, name: form.name, description: form.description,
    instructions: form.instructions, pasteRaw: pasteRaw.value
  }))
}

onMounted(() => {
  const raw = localStorage.getItem(DRAFT_KEY)
  if (raw) {
    try {
      const d = JSON.parse(raw)
      mode.value = d.mode || 'form'
      form.name = d.name || ''
      form.description = d.description || ''
      form.instructions = d.instructions || ''
      pasteRaw.value = d.pasteRaw || ''
    } catch {}
    localStorage.removeItem(DRAFT_KEY)
  }
  window.addEventListener('save-draft-for-auth', saveDraft)
})

onUnmounted(() => {
  window.removeEventListener('save-draft-for-auth', saveDraft)
})

const slug = computed(() =>
  form.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
)

// Live parse of pasted content
const parsedPaste = computed(() => {
  const raw = pasteRaw.value
  const match = raw.match(/^---\n([\s\S]*?)\n---/)
  if (!match) return { valid: false, hint: 'No frontmatter block found — wrap metadata in --- at the top', switchHint: true }
  const fm = match[1]
  const getName = fm.match(/^name:\s*(.+)/m)?.[1]?.trim()
  const getDesc = fm.match(/^description:\s*[>|]?\s*\n((?:[ \t]+.+\n?)+)/m)?.[1]?.trim().replace(/\s+/g, ' ')
    || fm.match(/^description:\s*(.+)/m)?.[1]?.trim()
  if (!getName) return { valid: false, hint: 'Missing name: field in frontmatter', switchHint: true }
  if (!getDesc) return { valid: false, hint: 'Missing description: field in frontmatter', switchHint: true }
  return { valid: true, name: getName, description: getDesc, instructions: raw.slice(match[0].length).trim() }
})

async function submitPaste() {
  error.value = ''
  if (!parsedPaste.value.valid) {
    error.value = `Cannot save: ${parsedPaste.value.hint}. Use "Create from scratch" to fill in fields manually.`
    return
  }
  loading.value = true
  try {
    const { name, description, instructions } = parsedPaste.value
    const res = await $fetch('/api/skills/create', {
      method: 'POST',
      body: { name, description, instructions }
    })
    success.value = res.slug
    pasteRaw.value = ''
    setTimeout(() => success.value = '', 8000)
  } catch (e) {
    error.value = e?.data?.message || 'Something went wrong. Try again.'
  } finally {
    loading.value = false
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
    form.name = ''; form.description = ''; form.instructions = ''
    setTimeout(() => success.value = '', 8000)
  } catch (e) {
    error.value = e?.data?.message || 'Something went wrong. Try again.'
  } finally {
    loading.value = false
  }
}

function onFileChange(e) { uploadFile.value = e.target.files[0] || null }
function onDrop(e) { uploadFile.value = e.dataTransfer.files[0] || null }

async function submitUpload() {
  if (!uploadFile.value) return
  error.value = ''
  loading.value = true
  try {
    const fd = new FormData()
    fd.append('file', uploadFile.value)
    const res = await $fetch('/api/skills/upload', { method: 'POST', body: fd })
    success.value = res.slug
    uploadFile.value = null
    setTimeout(() => success.value = '', 8000)
  } catch (e) {
    error.value = e?.data?.message || 'Upload failed. Make sure the zip contains a SKILL.md.'
  } finally {
    loading.value = false
  }
}
</script>
