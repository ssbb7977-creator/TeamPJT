<template>
  <tr class="hover:bg-surface-container-lowest transition-colors">
    <td class="px-4 py-3">
      <router-link :to="`/board/${post.id}`" class="font-medium text-on-surface">{{ post.title }}</router-link>
      <div class="mt-1 text-xs text-slate-500 flex items-center gap-2">
        <span v-if="isLocal" class="bg-amber-100 text-amber-800 px-2 py-0.5 rounded">지역추천</span>
        <span v-if="post.summary">{{ post.summary }}</span>
      </div>
    </td>
    <td class="px-4 py-3">{{ post.category }}</td>
    <td class="px-4 py-3 hidden md:table-cell">{{ new Date(post.createdAt).toLocaleDateString() }}</td>
    <td class="px-4 py-3 text-right">
      <div class="flex items-center justify-end gap-3">
        <button @click.stop="like" class="flex items-center gap-1 text-sm px-3 py-1 rounded border hover:bg-surface-container-low">
          <span class="material-symbols-outlined text-base">favorite</span>
          <span>{{ likes }}</span>
        </button>
        <router-link :to="`/board/${post.id}`" class="text-primary">보기</router-link>
      </div>
    </td>
  </tr>
</template>

<script>
import { updatePost, getPost } from '../utils/posts'

export default {
  name: 'BoardRow',
  props: { post: { type: Object, required: true } },
  data() { return { likes: this.post.likes || 0 } },
  computed: {
    isLocal() { return this.post.category === '추천' }
  },
  methods: {
    like() {
      const newCount = (this.likes || 0) + 1
      updatePost(this.post.id, { likes: newCount })
      this.likes = newCount
      // notify parent to refresh if needed
      this.$emit('updated', this.post.id)
    }
  }
}
</script>

<style scoped>
</style>
