import { create } from 'zustand'

interface UIStore {
  theme: 'light' | 'dark'
  isCartOpen: boolean
  isMobileMenuOpen: boolean
  toggleTheme: () => void
  setTheme: (theme: 'light' | 'dark') => void
  openCart: () => void
  closeCart: () => void
  toggleCart: () => void
  openMobileMenu: () => void
  closeMobileMenu: () => void
}

export const useUIStore = create<UIStore>((set) => ({
  theme: 'dark',
  isCartOpen: false,
  isMobileMenuOpen: false,

  toggleTheme: () =>
    set((state) => {
      const newTheme = state.theme === 'dark' ? 'light' : 'dark'
      document.documentElement.classList.toggle('dark', newTheme === 'dark')
      return { theme: newTheme }
    }),

  setTheme: (theme) => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
    set({ theme })
  },

  openCart: () => set({ isCartOpen: true }),
  closeCart: () => set({ isCartOpen: false }),
  toggleCart: () => set((state) => ({ isCartOpen: !state.isCartOpen })),

  openMobileMenu: () => set({ isMobileMenuOpen: true }),
  closeMobileMenu: () => set({ isMobileMenuOpen: false }),
}))
