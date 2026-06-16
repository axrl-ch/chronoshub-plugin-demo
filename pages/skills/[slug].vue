<template>
  <main v-if="page" style="max-width:720px; margin:0 auto; padding:2rem; font-family:system-ui,sans-serif;">
    <nav style="margin-bottom:1.5rem; font-size:0.875rem; color:#666;">
      <a href="/" style="color:#666; text-decoration:none;">Home</a> /
      <a href="/skills" style="color:#666; text-decoration:none;">Skills</a> /
      {{ page.title || page.name }}
    </nav>

    <h1 style="font-size:1.75rem; font-weight:700; margin:0 0 0.5rem;">{{ page.title || page.name }}</h1>
    <p style="color:#444; font-size:1.05rem; margin:0 0 1.25rem; line-height:1.6;">{{ page.description }}</p>

    <div v-if="page.tags?.length" style="display:flex; flex-wrap:wrap; gap:0.4rem; margin-bottom:1.5rem;">
      <span
        v-for="tag in page.tags"
        :key="tag"
        style="background:#f0f0f0; border-radius:999px; padding:0.2rem 0.75rem; font-size:0.8rem; color:#333;"
      >{{ tag }}</span>
    </div>

    <table v-if="page.version || page.author" style="border-collapse:collapse; font-size:0.9rem; margin-bottom:1.5rem;">
      <tr v-if="page.version">
        <td style="color:#666; padding:0.3rem 1.5rem 0.3rem 0;">Version</td>
        <td>{{ page.version }}</td>
      </tr>
      <tr v-if="page.author">
        <td style="color:#666; padding:0.3rem 1.5rem 0.3rem 0;">Author</td>
        <td>{{ page.author }}</td>
      </tr>
    </table>

    <div v-if="page.triggers?.length">
      <h2 style="font-size:1rem; font-weight:600; margin:0 0 0.5rem;">Trigger phrases</h2>
      <ul style="margin:0; padding-left:1.25rem; color:#444; font-size:0.9rem; line-height:1.8;">
        <li v-for="t in page.triggers" :key="t">{{ t }}</li>
      </ul>
    </div>
  </main>
</template>

<script setup>
const route = useRoute()
const { data: page } = await useAsyncData(route.path, () =>
  queryCollection('skills').path(route.path).first()
)
</script>
