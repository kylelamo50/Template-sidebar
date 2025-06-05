<template>
  <div
    v-if="isMobileOpen"
    class="fixed inset-0 bg-gray-900/50 z-9999 lg:hidden"
    @click="toggleMobileSidebar"
  ></div>
</template>

<script setup lang="ts">
import { useSidebar } from '@/composables/useSidebar'
const { toggleMobileSidebar, isMobileOpen } = useSidebar()

/*
The Backdrop component in your project is used to display a semi-transparent overlay behind the sidebar on mobile devices. Its main purposes are:

Dim the background: When the mobile sidebar is open (isMobileOpen is true), the backdrop covers the rest of the screen with a dark overlay (bg-gray-900/50), drawing focus to the sidebar.
Close the sidebar on click: Clicking the backdrop triggers toggleMobileSidebar, which closes the sidebar.
It is only visible on mobile (lg:hidden), and is rendered conditionally based on the sidebar's open state. This improves user experience by making it clear that the sidebar is active and allowing users to easily dismiss it by clicking outside.
*/
</script>
