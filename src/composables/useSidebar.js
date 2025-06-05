import { ref, computed, onMounted, onUnmounted, provide, inject } from 'vue'

// Unique symbol used for provide/inject to prevent name collisions
const SidebarSymbol = Symbol()


//This function sets up the sidebar state and behavior and makes it available to any component that calls useSidebar().
export function useSidebarProvider() {
  const isExpanded = ref(true)
  const isMobileOpen = ref(false)
  const isMobile = ref(false)
  const isHovered = ref(false)
  const activeItem = ref(null)
  const openSubmenu = ref(null)

  const handleResize = () => {
    const mobile = window.innerWidth < 768  // Treat screen width <768px as mobile
    isMobile.value = mobile
    if (!mobile) {
      isMobileOpen.value = false   // Close mobile sidebar if no longer on mobile
    }
  }


  //These lifecycle hooks ensure the app reacts to changes in screen size and avoids memory leaks.
  onMounted(() => {
    handleResize()  // Check screen size on load
    window.addEventListener('resize', handleResize)  // Update on window resize
  })

  onUnmounted(() => {
    window.removeEventListener('resize', handleResize)
  })

  const toggleSidebar = () => {
    if (isMobile.value) {
      isMobileOpen.value = !isMobileOpen.value   // Toggle mobile sidebar
    } else {
      isExpanded.value = !isExpanded.value   // Toggle desktop sidebar width
    }
  }

  const toggleMobileSidebar = () => {
    isMobileOpen.value = !isMobileOpen.value  // Explicit toggle for mobile only
  }

  const setIsHovered = (value) => {
    isHovered.value = value              // Used for hover-expansion behavior
  }

  const setActiveItem = (item) => {
    activeItem.value = item             // Track which item is selected
  }

  const toggleSubmenu = (item) => {
    openSubmenu.value = openSubmenu.value === item ? null : item   // Open or close submenu
  }


  //context is the full reactive object that will be shared with components. isExpanded is a computed property that always returns false on mobile (to collapse it).
  const context = {
    isExpanded: computed(() => (isMobile.value ? false : isExpanded.value)),
    isMobileOpen,
    isHovered,
    activeItem,
    openSubmenu,
    toggleSidebar,
    toggleMobileSidebar,
    setIsHovered,
    setActiveItem,
    toggleSubmenu,
  }

  provide(SidebarSymbol, context)  //// Makes sidebar context available to all descendant components

  return context
}

export function useSidebar() {
  const context = inject(SidebarSymbol)
  if (!context) {
    throw new Error(
      'useSidebar must be used within a component that has SidebarProvider as an ancestor',
    )
  }
  return context
}
