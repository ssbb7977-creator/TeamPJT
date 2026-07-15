<template>
  <tr class="hover:bg-surface-container-lowest transition-colors">
    <td class="px-4 py-3">
      <router-link :to="`/board/${post.id}`" class="font-medium text-on-surface">{{ post.title }}</router-link>
    </td>
    <td class="px-4 py-3">{{ post.category }}</td>
    <td class="px-4 py-3 hidden md:table-cell">{{ new Date(post.createdAt).toLocaleDateString() }}</td>
    <td class="px-4 py-3 text-right"><router-link :to="`/board/${post.id}`" class="text-primary">보기</router-link></td>
  </tr>
</template>

<script>
export default {
  name: 'BoardRow',
  props: { post: { type: Object, required: true } }
}
</script>

<style scoped>
</style>
