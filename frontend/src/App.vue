<template>
  <div id="app">
    <header-view v-if="$route.name !== 'Login'" />
    <router-view />
  </div>
</template>

<script>
import HeaderView from '@/components/Header.vue'

export default {
  components: { HeaderView }
}
</script>