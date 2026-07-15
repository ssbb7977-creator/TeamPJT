<template>
  <button @click="$emit('click')" :class="['px-4 py-2 rounded-full text-sm', active ? 'bg-primary text-white' : 'bg-slate-100 text-slate-700']">
    <slot>{{ label }}</slot>
  </button>
</template>

<script>
export default {
  name: 'TagChip',
  props: {
    label: { type: String, required: true },
    active: { type: Boolean, default: false }
  }
}
</script>

<style scoped>
/* simple chip styles kept in classes */
</style>
