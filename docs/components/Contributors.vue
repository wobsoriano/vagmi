
<script setup lang="ts">
import { computed } from 'vue'
const props = defineProps<{ fn: string }>()
const contributors = ref([])
fetch('/contributors.json').then(res => {
  return res.json()
}).then(data => {
  contributors.value = data
})
</script>

<template>
  <div class="flex flex-wrap gap-4 pt-2">
    <div v-for="c of contributors[fn]" :key="c.hash" class="flex gap-2 items-center">
      <img :src="`https://gravatar.com/avatar/${c.hash}?d=retro`" class="w-8 h-8 rounded-full">
      {{ c.name }}
    </div>
  </div>
</template>
