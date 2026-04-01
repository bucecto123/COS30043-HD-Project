<template>
  <div id="app">
    <Navbar v-if="showNavbar" />
    <router-view />
    <Footer v-if="showFooter" />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import Navbar from './components/Navbar.vue'
import Footer from './components/Footer.vue'

const route = useRoute()

const authRoutes = ['/login', '/register']
const showNavbar = computed(() => !authRoutes.includes(route.path))
const showFooter = computed(() => !authRoutes.includes(route.path))
</script>
