<template>
  <div class="category-filter">
    <button
      v-for="cat in categories"
      :key="cat.value"
      :class="['chip', { active: cat.value === selected } ]"
      @click="select(cat.value)">
      {{ cat.label }}
    </button>
  </div>
</template>

<script>
export default {
  name: 'CategoryFilter',
  props: {
    value: { type: String, default: 'all' },
    categories: {
      type: Array,
      default: () => [
        { label: '관광지', value: 'tour' },
        { label: '문화시설', value: 'culture' },
        { label: '축제', value: 'festival' },
        { label: '레포츠', value: 'sports' },
        { label: '숙박', value: 'stay' },
        { label: '쇼핑', value: 'shopping' }
      ]
    }
  },
  data() { return { selected: this.value } },
  watch: {
    value(v) { this.selected = v }
  },
  methods: {
    select(val) {
      this.selected = val
      this.$emit('update:value', val)
      this.$emit('change', val)
    }
  }
}
</script>

<style scoped>
.category-filter { display:flex; gap:8px; flex-wrap:wrap }
.chip { padding:6px 10px; border-radius:16px; border:1px solid #ddd; background:#fff; cursor:pointer }
.chip.active { background:#007acc; color:#fff; border-color:#007acc }

@media (max-width:720px) {
  .category-filter { justify-content:center }
}
</style>
