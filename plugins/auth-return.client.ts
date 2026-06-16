// Runs before any component mounts — intercepts nuxt-studio's post-auth URL
// and redirects back to wherever the user was before authenticating.
export default defineNuxtPlugin(() => {
  if (!window.location.pathname.startsWith('/__nuxt_studio/auth/')) return

  const returnUrl = localStorage.getItem('_auth_return_url')
  localStorage.removeItem('_auth_return_url')

  // Use replace so the auth callback URL doesn't end up in browser history
  window.location.replace(returnUrl || '/')
})
