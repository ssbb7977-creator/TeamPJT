<template>
  <article class="feature-card bg-white rounded-xl shadow-md overflow-hidden border">
    <div class="flex">
      <div class="w-36 h-24 flex-shrink-0 overflow-hidden">
        <img v-if="img" :src="img" class="w-full h-full object-cover" />
        <div v-else class="w-full h-full bg-slate-200"></div>
      </div>
      <div class="p-4 flex-1">
        <div class="flex items-center justify-between">
          <h3 class="font-bold text-on-surface truncate">{{ title }}</h3>
          <span v-if="tag" class="text-xs bg-secondary-container text-on-secondary-container px-2 py-0.5 rounded">{{ tag }}</span>
        </div>
        <p class="text-sm text-slate-600 mt-2 line-clamp-2">{{ desc }}</p>
      </div>
    </div>
  </article>
</template>

<script>
export default {
  name: 'FeatureCard',
  props: {
    title: String,
    desc: String,
    img: String,
    tag: String
  }
}
</script>

<style scoped>
.feature-card { min-height: 76px }
</style>
