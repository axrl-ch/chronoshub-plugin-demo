// Runs before any component mounts — intercepts nuxt-studio's post-auth URL
// and redirects back to wherever the user was before authenticating.
export default defineNuxtPlugin(() => {
  // Accumulate log entries so we can see every plugin run in order
  const entry = {
    path: window.location.pathname,
    search: window.location.search,
    returnUrl: localStorage.getItem('_auth_return_url'),
    time: new Date().toISOString()
  }
  const prev = JSON.parse(localStorage.getItem('_auth_debug_log') || '[]')
  localStorage.setItem('_auth_debug_log', JSON.stringify([...prev, entry]))

  if (!window.location.pathname.startsWith('/__nuxt_studio/auth/')) return

  const returnUrl = localStorage.getItem('_auth_return_url')
  localStorage.removeItem('_auth_return_url')

  // Use replace so the auth callback URL doesn't end up in browser history
  window.location.replace(returnUrl || '/')
})
