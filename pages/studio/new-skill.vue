<template>
  <main class="page">
    <nav class="page-nav">
      <a href="/">Home</a> / Add skill
    </nav>

    <h1 class="page-title">Add a new skill</h1>
    <p class="page-subtitle">Skills tell Claude how to handle specific tasks.</p>

    <div class="tab-group">
      <button :class="mode==='form' ? 'tab-btn tab-btn-active' : 'tab-btn tab-btn-inactive'" @click="mode='form'">Create from scratch</button>
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

<script setup>
const mode = ref('form')
const loading = ref(false)
const error = ref('')
const success = ref('')
const uploadFile = ref(null)
const fileInput = ref(null)

const form = reactive({ name: '', description: '', instructions: '' })

const slug = computed(() =>
  form.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
)

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
