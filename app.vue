<template>
  <div>
    <div class="top-bar">
      <button class="top-bar-login" @click="openAuth">Authenticate →</button>
      <button class="theme-toggle" @click="toggleTheme" :title="isDark ? 'Switch to light mode' : 'Switch to dark mode'">
        {{ isDark ? '☀️' : '🌙' }}
      </button>
    </div>
    <NuxtPage />
  </div>
</template>

<script setup>
const isDark = ref(true)

onMounted(() => {
  const saved = localStorage.getItem('theme')
  isDark.value = saved ? saved === 'dark' : true
  document.documentElement.setAttribute('data-theme', isDark.value ? 'dark' : 'light')

})

function toggleTheme() {
  isDark.value = !isDark.value
  const theme = isDark.value ? 'dark' : 'light'
  document.documentElement.setAttribute('data-theme', theme)
  localStorage.setItem('theme', theme)
}

function openAuth() {
  const currentPath = window.location.pathname + window.location.search
  window.dispatchEvent(new CustomEvent('save-draft-for-auth'))
  // Pass redirect param so nuxt-studio returns here after OAuth completes
  window.location.href = `/admin?redirect=${encodeURIComponent(currentPath)}`
}

</script>

<style>
/* ── Theme variables ── */
:root {
  --bg:           #111111;
  --bg-card:      #1c1c1c;
  --bg-muted:     #242424;
  --bg-code:      #2a2a2a;
  --border:       #303030;
  --border-input: #3d3d3d;
  --text:         #ebebeb;
  --text-muted:   #aaaaaa;
  --text-subtle:  #666666;
  --btn-bg:       #e8e8e8;
  --btn-text:     #111111;
  --link:         #aaaaaa;
}
[data-theme="light"] {
  --bg:           #ffffff;
  --bg-card:      #ffffff;
  --bg-muted:     #fafafa;
  --bg-code:      #f5f5f5;
  --border:       #e5e5e5;
  --border-input: #cccccc;
  --text:         #1a1a1a;
  --text-muted:   #555555;
  --text-subtle:  #888888;
  --btn-bg:       #1a1a1a;
  --btn-text:     #ffffff;
  --link:         #555555;
}

/* ── Global resets ── */
html { font-size: 115%; }
*, *::before, *::after { box-sizing: border-box; }
body { background: var(--bg); color: var(--text); margin: 0; transition: background 0.2s, color 0.2s; }

/* ── Shared page classes ── */
.page { max-width: 680px; margin: 0 auto; padding: 2rem; font-family: system-ui, sans-serif; }
.page-wide { max-width: 720px; margin: 0 auto; padding: 2rem; font-family: system-ui, sans-serif; }

.page-nav { margin-bottom: 1.5rem; font-size: 0.875rem; color: var(--text-subtle); }
.page-nav a { color: var(--text-subtle); text-decoration: none; }
.page-nav a:hover { color: var(--text); }

.page-title { font-size: 1.5rem; font-weight: 700; margin: 0 0 0.25rem; color: var(--text); }
.page-subtitle { color: var(--text-muted); margin: 0 0 2rem; }

.form-group { margin-bottom: 1.25rem; }
.form-group-lg { margin-bottom: 1.75rem; }
.form-label { display: block; font-weight: 600; margin-bottom: 0.4rem; color: var(--text); }
.form-input {
  width: 100%; padding: 0.6rem 0.75rem;
  background: var(--bg-card); color: var(--text);
  border: 1px solid var(--border-input); border-radius: 6px;
  font-size: 0.95rem; font-family: inherit; outline: none;
}
.form-input:focus { border-color: var(--text-muted); }
.form-textarea {
  width: 100%; padding: 0.6rem 0.75rem;
  background: var(--bg-card); color: var(--text);
  border: 1px solid var(--border-input); border-radius: 6px;
  font-size: 0.95rem; font-family: inherit; resize: vertical; outline: none;
}
.form-textarea:focus { border-color: var(--text-muted); }
.form-textarea-mono { font-family: monospace; font-size: 0.9rem; }
.form-hint { margin: 0.25rem 0 0; font-size: 0.8rem; color: var(--text-subtle); }
.form-hint code { background: var(--bg-code); color: var(--text-muted); padding: 1px 5px; border-radius: 3px; }
.form-error {
  background: #2d1212; border: 1px solid #7f1d1d; border-radius: 6px;
  padding: 0.75rem 1rem; margin-bottom: 1rem; color: #fca5a5; font-size: 0.9rem;
}
[data-theme="light"] .form-error { background: #fef2f2; border-color: #fca5a5; color: #b91c1c; }

.form-actions { display: flex; gap: 0.75rem; align-items: center; }
.form-actions-spread { display: flex; gap: 0.75rem; align-items: center; justify-content: space-between; }

.btn-primary {
  background: var(--btn-bg); color: var(--btn-text);
  border: none; border-radius: 6px;
  padding: 0.7rem 1.5rem; font-size: 0.95rem; font-weight: 600; cursor: pointer;
}
.btn-primary:disabled { opacity: 0.5; cursor: not-allowed; }
.btn-primary:not(:disabled):hover { opacity: 0.85; }

.btn-cancel { font-size: 0.875rem; color: var(--text-subtle); text-decoration: none; }
.btn-cancel:hover { color: var(--text); }

.btn-danger-outline {
  background: none; border: 1px solid #7f1d1d; color: #f87171;
  border-radius: 6px; padding: 0.7rem 1.25rem; font-size: 0.875rem; font-weight: 600; cursor: pointer;
}
[data-theme="light"] .btn-danger-outline { border-color: #fca5a5; color: #b91c1c; }
.btn-danger-outline:hover { background: #2d1212; }
[data-theme="light"] .btn-danger-outline:hover { background: #fef2f2; }

/* ── Modal ── */
.modal-overlay {
  position: fixed; inset: 0; background: rgba(0,0,0,0.65);
  display: flex; align-items: center; justify-content: center; z-index: 100;
}
.modal-box {
  background: var(--bg-card); border: 1px solid var(--border);
  border-radius: 12px; padding: 2rem; max-width: 400px; width: 90%;
  box-shadow: 0 8px 32px rgba(0,0,0,0.4);
}
.modal-title { font-size: 1.1rem; font-weight: 700; margin: 0 0 0.5rem; color: var(--text); }
.modal-body { color: var(--text-muted); margin: 0 0 1.5rem; font-size: 0.9rem; }
.modal-actions { display: flex; gap: 0.75rem; justify-content: flex-end; }

.btn-modal-cancel {
  background: none; border: 1px solid var(--border-input); border-radius: 6px;
  padding: 0.6rem 1.25rem; font-size: 0.875rem; cursor: pointer; color: var(--text-muted);
}
.btn-modal-cancel:hover { border-color: var(--text-muted); color: var(--text); }

.btn-modal-danger {
  background: #b91c1c; color: #fff; border: none; border-radius: 6px;
  padding: 0.6rem 1.25rem; font-size: 0.875rem; font-weight: 600; cursor: pointer;
}
.btn-modal-danger:disabled { opacity: 0.5; cursor: not-allowed; }

/* ── Toast ── */
.toast-success {
  position: fixed; bottom: 2rem; right: 2rem;
  background: #16a34a; color: #fff; border-radius: 8px;
  padding: 1rem 1.5rem; font-weight: 600;
  box-shadow: 0 4px 16px rgba(0,0,0,0.3); max-width: 320px;
}
.toast-success code { background: rgba(255,255,255,0.2); padding: 0 4px; border-radius: 3px; }
.toast-detail { font-size: 0.85rem; font-weight: 400; opacity: 0.9; }

/* ── Mode tab toggle ── */
.tab-group {
  display: flex; border: 1px solid var(--border); border-radius: 8px;
  overflow: hidden; margin-bottom: 2rem; width: fit-content;
}
.tab-btn {
  border: none; padding: 0.6rem 1.25rem; font-size: 0.9rem; cursor: pointer; font-family: inherit;
}
.tab-btn-active { background: var(--btn-bg); color: var(--btn-text); font-weight: 600; }
.tab-btn-inactive { background: var(--bg-card); color: var(--text-muted); }
.tab-btn-inactive:hover { color: var(--text); }

/* ── Upload dropzone ── */
.upload-zone {
  border: 2px dashed var(--border-input); border-radius: 8px;
  padding: 3rem 2rem; text-align: center; margin-bottom: 1.5rem; cursor: pointer;
}
.upload-zone:hover { border-color: var(--text-muted); }
.upload-icon { font-size: 2rem; margin-bottom: 0.5rem; }
.upload-title { margin: 0; font-weight: 600; color: var(--text); }
.upload-sub { margin: 0.25rem 0 0; color: var(--text-subtle); font-size: 0.875rem; }
.upload-filename { margin: 0.75rem 0 0; color: #4ade80; font-size: 0.875rem; font-weight: 600; }

/* ── Top bar (login + theme toggle) ── */
.top-bar {
  position: fixed; top: 1rem; right: 1rem; z-index: 200;
  display: flex; align-items: center; gap: 0.5rem;
}
.top-bar-return {
  color: #4ade80; font-size: 0.875rem; cursor: pointer;
  background: var(--bg-card); border: 1px solid #166534;
  border-radius: 8px; padding: 0.4rem 0.75rem; font-family: system-ui, sans-serif;
  text-decoration: none; white-space: nowrap;
}
.top-bar-return:hover { border-color: #4ade80; }
[data-theme="light"] .top-bar-return { color: #15803d; border-color: #bbf7d0; }
.top-bar-login {
  color: var(--text-subtle); font-size: 0.875rem; cursor: pointer;
  background: var(--bg-card); border: 1px solid var(--border);
  border-radius: 8px; padding: 0.4rem 0.75rem; font-family: system-ui, sans-serif;
  text-decoration: none;
}
.top-bar-login:hover { color: var(--text); border-color: var(--text-muted); }
.theme-toggle {
  background: var(--bg-card); border: 1px solid var(--border);
  border-radius: 8px; padding: 0.4rem 0.6rem; font-size: 1rem;
  cursor: pointer; line-height: 1;
}
.theme-toggle:hover { border-color: var(--text-muted); }

/* ── Warn span ── */
.rename-warn { color: #fbbf24; margin-left: 0.5rem; }
[data-theme="light"] .rename-warn { color: #b45309; }
</style>
