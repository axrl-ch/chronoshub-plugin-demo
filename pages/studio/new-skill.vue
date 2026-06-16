<template>
  <main style="max-width:680px; margin:0 auto; padding:2rem; font-family:system-ui,sans-serif;">
    <nav style="margin-bottom:1.5rem; font-size:0.875rem; color:#666;">
      <a href="/" style="color:#666; text-decoration:none;">Home</a> / Add skill
    </nav>

    <h1 style="font-size:1.5rem; font-weight:700; margin:0 0 0.25rem;">Add a new skill</h1>
    <p style="color:#555; margin:0 0 2rem;">Skills tell Claude how to handle specific tasks.</p>

    <!-- Mode tabs -->
    <div style="display:flex; gap:0; border:1px solid #ddd; border-radius:8px; overflow:hidden; margin-bottom:2rem; width:fit-content;">
      <button
        :style="mode==='form' ? activeTab : inactiveTab"
        @click="mode='form'"
      >Create from scratch</button>
      <button
        :style="mode==='upload' ? activeTab : inactiveTab"
        @click="mode='upload'"
      >Upload skill folder</button>
    </div>

    <!-- Form mode -->
    <form v-if="mode==='form'" @submit.prevent="submitForm">
      <div style="margin-bottom:1.25rem;">
        <label style="display:block; font-weight:600; margin-bottom:0.4rem;">Skill name (Warning! If you have the same name as an existing skill that skill will be overwritten)</label>
        <input
          v-model="form.name"
          placeholder="e.g. Weekly Report Generator"
          required
          style="width:100%; padding:0.6rem 0.75rem; border:1px solid #ccc; border-radius:6px; font-size:0.95rem; box-sizing:border-box;"
        />
        <p v-if="form.name" style="margin:0.25rem 0 0; font-size:0.8rem; color:#888;">
          Saved as: <code>{{ slug }}</code>
        </p>
      </div>

      <div style="margin-bottom:1.25rem;">
        <label style="display:block; font-weight:600; margin-bottom:0.4rem;">Description. When should Claude use this skill?</label>
        <textarea
          v-model="form.description"
          placeholder="e.g. Use this skill whenever someone asks to generate a weekly activity report or status update. Trigger phrases: 'weekly report', 'status update', 'what did I do this week'."
          required
          rows="3"
          style="width:100%; padding:0.6rem 0.75rem; border:1px solid #ccc; border-radius:6px; font-size:0.95rem; box-sizing:border-box; resize:vertical;"
        />
        <p style="margin:0.25rem 0 0; font-size:0.8rem; color:#888;">This is what Claude reads to decide when to apply the skill.</p>
      </div>

      <div style="margin-bottom:1.75rem;">
        <label style="display:block; font-weight:600; margin-bottom:0.4rem;">Instructions for Claude (as Markdown)</label>
        <textarea
          v-model="form.instructions"
          placeholder="Write step-by-step instructions for what Claude should do. Markdown supported.

Example:
1. Ask the user for the date range if not specified.
2. Summarise completed tasks grouped by project.
3. Highlight any blockers or risks.
4. Format the output as a short email-ready summary."
          required
          rows="12"
          style="width:100%; padding:0.6rem 0.75rem; border:1px solid #ccc; border-radius:6px; font-size:0.9rem; font-family:monospace; box-sizing:border-box; resize:vertical;"
        />
      </div>

      <div v-if="error" style="background:#fef2f2; border:1px solid #fca5a5; border-radius:6px; padding:0.75rem 1rem; margin-bottom:1rem; color:#b91c1c; font-size:0.9rem;">
        {{ error }}
      </div>

      <button
        type="submit"
        :disabled="loading"
        style="background:#1a1a1a; color:#fff; border:none; border-radius:6px; padding:0.7rem 1.5rem; font-size:0.95rem; font-weight:600; cursor:pointer; opacity:1;"
        :style="loading ? 'opacity:0.6; cursor:not-allowed;' : ''"
      >
        {{ loading ? 'Adding skill…' : 'Add skill' }}
      </button>
    </form>

    <!-- Upload mode -->
    <form v-else @submit.prevent="submitUpload" enctype="multipart/form-data">
      <div
        style="border:2px dashed #ccc; border-radius:8px; padding:3rem 2rem; text-align:center; margin-bottom:1.5rem; cursor:pointer;"
        @click="$refs.fileInput.click()"
        @dragover.prevent
        @drop.prevent="onDrop"
      >
        <div style="font-size:2rem; margin-bottom:0.5rem;">📦</div>
        <p style="margin:0; font-weight:600;">Drop your skill folder here</p>
        <p style="margin:0.25rem 0 0; color:#888; font-size:0.875rem;">or click to choose a .zip file</p>
        <p v-if="uploadFile" style="margin:0.75rem 0 0; color:#16a34a; font-size:0.875rem; font-weight:600;">
          {{ uploadFile.name }}
        </p>
      </div>

      <input ref="fileInput" type="file" accept=".zip" style="display:none" @change="onFileChange" />

      <p style="font-size:0.875rem; color:#666; margin:0 0 1.5rem;">
        Zip your skill folder so it contains a <code>SKILL.md</code> at the root or inside a single folder.
        Scripts and reference files are supported.
      </p>

      <div v-if="error" style="background:#fef2f2; border:1px solid #fca5a5; border-radius:6px; padding:0.75rem 1rem; margin-bottom:1rem; color:#b91c1c; font-size:0.9rem;">
        {{ error }}
      </div>

      <button
        type="submit"
        :disabled="loading || !uploadFile"
        style="background:#1a1a1a; color:#fff; border:none; border-radius:6px; padding:0.7rem 1.5rem; font-size:0.95rem; font-weight:600; cursor:pointer;"
        :style="(loading || !uploadFile) ? 'opacity:0.4; cursor:not-allowed;' : ''"
      >
        {{ loading ? 'Uploading…' : 'Upload skill' }}
      </button>
    </form>

    <!-- Success -->
    <div v-if="success" style="position:fixed; bottom:2rem; right:2rem; background:#16a34a; color:#fff; border-radius:8px; padding:1rem 1.5rem; font-weight:600; box-shadow:0 4px 16px rgba(0,0,0,0.15); max-width:320px;">
      ✓ Skill <code style="background:rgba(255,255,255,0.2); padding:0 4px; border-radius:3px;">{{ success }}</code> added!
      <br><span style="font-size:0.85rem; font-weight:400; opacity:0.9;">Deploying now — ready in ~1 min.</span>
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

const activeTab = 'background:#1a1a1a; color:#fff; border:none; padding:0.6rem 1.25rem; font-size:0.9rem; font-weight:600; cursor:pointer;'
const inactiveTab = 'background:#fff; color:#333; border:none; padding:0.6rem 1.25rem; font-size:0.9rem; cursor:pointer;'

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

function onFileChange(e) {
  uploadFile.value = e.target.files[0] || null
}

function onDrop(e) {
  uploadFile.value = e.dataTransfer.files[0] || null
}

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
