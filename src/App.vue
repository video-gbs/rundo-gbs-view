<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
import { Local } from './utils/storage'
import { newRefreshToken } from '@/api/method/home'
export default {
  name: 'App',
  mounted() {}
}
</script>
