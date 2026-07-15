<template>
  <div class="flex items-center justify-center gap-2">
    <button class="px-3 py-1 border rounded" @click="changePage(page-1)" :disabled="page<=1">◀</button>
    <button v-for="n in pages" :key="n" @click="changePage(n)" :class="['px-3 py-1 rounded', page===n? 'bg-primary text-white':'border']">{{ n }}</button>
    <button class="px-3 py-1 border rounded" @click="changePage(page+1)" :disabled="page>=total">▶</button>
  </div>
</template>

<script>
export default {
  name: 'Pagination',
  props: { page: { type: Number, required: true }, total: { type: Number, required: true } },
  computed: {
    pages() {
      const arr = []
      for (let i=1;i<=this.total;i++) arr.push(i)
      return arr
    }
  },
  methods: {
    changePage(n) {
      if (n < 1) n = 1
      if (n > this.total) n = this.total
      this.$emit('change', n)
    }
  }
}
</script>

<style scoped>
</style>
