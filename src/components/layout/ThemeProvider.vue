<template>
  <!-- This <slot> allows the ThemeProvider to wrap any child components passed to it. -->
  <slot></slot>
</template>

<script setup>
// Import Vue Composition API functions
import { ref, provide, onMounted, watch, computed } from 'vue'

// Reactive variable to store the current theme ('light' or 'dark')
const theme = ref('light')

// Flag to check whether the theme was initialized from localStorage
const isInitialized = ref(false)

// Computed property to determine if the current theme is dark mode
const isDarkMode = computed(() => theme.value === 'dark')

// Function to toggle between 'light' and 'dark' themes
const toggleTheme = () => {
  theme.value = theme.value === 'light' ? 'dark' : 'light'
}

// Runs once when the component is mounted to the DOM
onMounted(() => {
  // Get the saved theme from localStorage, if any
  const savedTheme = localStorage.getItem('theme')

  // Use saved theme if available, otherwise default to 'light'
  const initialTheme = savedTheme || 'light'

  // Set the theme and mark it as initialized
  theme.value = initialTheme
  isInitialized.value = true
})

// Watch both theme and isInitialized for changes
watch([theme, isInitialized], ([newTheme, newIsInitialized]) => {
  // Only apply changes if initialization has completed
  if (newIsInitialized) {
    // Save the new theme to localStorage
    localStorage.setItem('theme', newTheme)

    // Add or remove the 'dark' class on <html> element to trigger Tailwind dark mode
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }
})

// Provide the theme state and toggle function to all descendant components
provide('theme', {
  isDarkMode,  // allows components to know if dark mode is active
  toggleTheme, // allows components to switch the theme
})
</script>

<script>
// Import inject function to access provided values in child components
import { inject } from 'vue'

// This gives child components a simple hook (useTheme()) to access toggleTheme and isDarkMode.
export function useTheme() {
  // Try to get the 'theme' object from the context
  const theme = inject('theme')

  // If theme context doesn't exist, throw an error
  // This ensures useTheme is only called inside a component wrapped by ThemeProvider
  if (!theme) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }

  // Return the injected theme object, which includes isDarkMode and toggleTheme
  return theme
}
</script>
