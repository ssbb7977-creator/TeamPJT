<template>
  <article class="place-card">
    <img v-if="place.firstimage" :src="place.firstimage" class="thumb" alt="" />
    <div class="content">
      <h4 class="title">{{ place.title || place.name }}</h4>
      <div class="addr">{{ place.addr1 || place.address || '' }}</div>
      <div class="meta">
        <span class="type">{{ place.contentType || place.contenttype || '' }}</span>
        <span class="tel" v-if="place.tel">{{ place.tel }}</span>
      </div>
    </div>
  </article>
</template>

<script>
export default {
  name: 'PlaceCard',
  props: { place: { type: Object, required: true } }
}
</script>

<style scoped>
.place-card { display:flex; gap:8px; padding:8px }
.thumb { width:72px; height:72px; object-fit:cover; border-radius:6px }
.content { flex:1 }
.title { margin:0 0 6px; font-size:14px }
.addr { color:#666; font-size:13px; margin-bottom:6px }
.meta { font-size:12px; color:#999 }
</style>
