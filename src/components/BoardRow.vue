<template>
  <tr class="hover:bg-surface-container-lowest transition-colors">
    <td class="px-4 py-3">
      <div class="flex items-start gap-3">
        <router-link :to="`/board/${post.id}`" class="font-medium text-on-surface">{{ post.title }}</router-link>
      </div>
      <div class="mt-1 text-xs text-slate-500 flex items-center gap-2">
        <span v-if="isLocal" class="bg-amber-100 text-amber-800 px-2 py-0.5 rounded">지역추천</span>
        <span v-if="post.summary">{{ post.summary }}</span>
      </div>
    </td>
    <td class="px-4 py-3">{{ post.category }}</td>
    <td class="px-4 py-3 hidden md:table-cell">
      <div class="date-cell">
        <span>{{ formatDate(post.createdAt) }}</span>
        <button @click.stop="toggleFavorite" class="favorite-btn" aria-label="favorite">
          <span v-if="favorited">❤</span>
          <span v-else>♡</span>
          <span class="ml-1 text-sm">{{ likes }}</span>
        </button>
      </div>
    </td>
  </tr>
</template>

<script>
import { updatePost, getPost } from '../utils/posts'

export default {
  name: 'BoardRow',
  props: { post: { type: Object, required: true } },
  data() { return { likes: this.post.likes || 0, favorited: false } },
  computed: {
    isLocal() { return this.post.category === '추천' }
  },
  mounted() {
    try {
      const key = 'localhub_favorites_v1'
      const raw = localStorage.getItem(key)
      const favs = raw ? JSON.parse(raw) : []
      this.favorited = favs.includes(this.post.id)
    } catch (e) {
      // ignore
    }
  },
  methods: {
    formatDate(ts) {
      if (!ts) return ''
      const d = new Date(ts)
      return isNaN(d.getTime()) ? '' : d.toLocaleDateString()
    },
    toggleFavorite() {
      try {
        // store per-user favorites in localStorage
        const key = 'localhub_favorites_v1'
        const raw = localStorage.getItem(key)
        const favs = raw ? JSON.parse(raw) : []
        const id = this.post.id
        const has = favs.includes(id)
        if (has) {
          // unfavorite: remove and decrement likes if >0
          const idx = favs.indexOf(id)
          favs.splice(idx,1)
          const newCount = Math.max(0, (this.likes||0) - 1)
          updatePost(this.post.id, { likes: newCount })
          this.likes = newCount
          this.favorited = false
        } else {
          // favorite: add and increment likes
          favs.push(id)
          const newCount = (this.likes||0) + 1
          updatePost(this.post.id, { likes: newCount })
          this.likes = newCount
          this.favorited = true
        }
        localStorage.setItem(key, JSON.stringify(favs))
        this.$emit('updated', this.post.id)
      } catch (e) {
        console.error('favorite toggle error', e)
      }
    }
  }
}
</script>

<style scoped>
.favorite-btn { background:transparent; border:0; cursor:pointer; display:inline-flex; align-items:center; gap:6px }
.favorite-btn span { font-size:18px }

.date-cell { display:flex; align-items:center; justify-content:space-between; gap:12px }

</style>
