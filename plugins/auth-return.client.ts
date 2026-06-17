// Intercept nuxt-studio's post-auth URL and redirect back to the saved page.
// sessionStorage persists across same-tab navigations (including OAuth redirects)
// and is not accessible to server-side code, so it reliably survives the auth flow.
export default defineNuxtPlugin(() => {
  if (!window.location.pathname.startsWith('/__nuxt_studio/auth/')) return

  const returnUrl = sessionStorage.getItem('_auth_return_url')
  sessionStorage.removeItem('_auth_return_url')
  window.location.replace(returnUrl || '/')
})
