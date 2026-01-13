import { addCollection } from '@iconify/vue'
export const useIconPreload = () => {
  const preloadIcons = async () => {
    try {
      const lucide = await import('@iconify-json/lucide/icons.json')
      addCollection(lucide.default)
      
      const heroicons = await import('@iconify-json/heroicons/icons.json')
      addCollection(heroicons.default)
      
      console.log('✅ Icons preloaded successfully')
    } catch (error) {
      console.warn('⚠️ Failed to preload icons, falling back to CDN:', error)
    }
  }

  return {
    preloadIcons
  }
}
