<template>
  <div v-if="page">
    <h1>{{ page.title || page.name }}</h1>
    <p>{{ page.description }}</p>
    <div v-if="page.tags?.length" class="tags">
      <span v-for="tag in page.tags" :key="tag">{{ tag }}</span>
    </div>
    <ContentRenderer :value="page" />
  </div>
</template>

<script setup>
const route = useRoute()
const { data: page } = await useAsyncData(route.path, () =>
  queryCollection('connectors').path(route.path).first()
)
</script>
