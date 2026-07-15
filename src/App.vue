<template>
  <AppLayout>
    <router-view />
  </AppLayout>
</template>

<script>
import AppLayout from './components/AppLayout.vue'

export default {
  components: { AppLayout }
}
</script>

<style>
/* Root styles handled in assets/styles.css and layout component */
</style>
