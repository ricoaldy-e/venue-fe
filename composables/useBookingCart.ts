import { ref, computed, watch } from 'vue'
import { BOOKING } from '~/utils/constants'

export interface BookingSlot {
  key: string
  courtId: number
  courtName: string
  range: string
  price: number
  dateLabel: string
  dateKey: string
}

export interface BookingCartData {
  stadionId: number | null
  stadionName: string
  slots: BookingSlot[]
  createdAt?: number
}

export interface UseBookingCartReturn {
  cart: Ref<BookingCartData>
  totalSlots: Ref<number>
  totalPrice: Ref<number>
  isEmpty: Ref<boolean>
  isExpired: Ref<boolean>
  addSlot: (slot: BookingSlot) => boolean
  removeSlot: (slotKey: string) => void
  clearCart: () => void
  hasSlot: (slotKey: string) => boolean
  setStadion: (id: number, name: string) => void
  timeRemaining: Ref<number>
}

const STORAGE_KEY = 'dipsport_booking_cart'

/**
 * Composable untuk managing booking cart dengan:
 * - Persistent storage (localStorage)
 * - Auto expiry setelah X menit
 * - Max slots validation
 * - Total price calculation
 * 
 * @example
 * const { cart, addSlot, totalPrice, clearCart } = useBookingCart()
 */
export const useBookingCart = (): UseBookingCartReturn => {
  const loadCartFromStorage = (): BookingCartData => {
    if (process.client) {
      try {
        const stored = localStorage.getItem(STORAGE_KEY)
        if (stored) {
          const parsed = JSON.parse(stored) as BookingCartData
          
          if (parsed.createdAt) {
            const expiryTime = BOOKING.CART_EXPIRY_MINUTES * 60 * 1000
            const isExpired = Date.now() - parsed.createdAt > expiryTime
            
            if (!isExpired) {
              return parsed
            }
          }
        }
      } catch (error) {
        console.error('Failed to load cart from storage:', error)
      }
    }
    
    return {
      stadionId: null,
      stadionName: '',
      slots: [],
      createdAt: Date.now(),
    }
  }

  const cart = ref<BookingCartData>(loadCartFromStorage())

  const saveCartToStorage = () => {
    if (process.client) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(cart.value))
      } catch (error) {
        console.error('Failed to save cart to storage:', error)
      }
    }
  }

  watch(cart, saveCartToStorage, { deep: true })

  const totalSlots = computed(() => cart.value.slots.length)
  
  const totalPrice = computed(() => 
    cart.value.slots.reduce((sum, slot) => sum + (slot.price || 0), 0)
  )
  
  const isEmpty = computed(() => totalSlots.value === 0)

  const isExpired = computed(() => {
    if (!cart.value.createdAt) return false
    const expiryTime = BOOKING.CART_EXPIRY_MINUTES * 60 * 1000
    return Date.now() - cart.value.createdAt > expiryTime
  })

  const timeRemaining = computed(() => {
    if (!cart.value.createdAt) return 0
    const expiryTime = BOOKING.CART_EXPIRY_MINUTES * 60 * 1000
    const remaining = expiryTime - (Date.now() - cart.value.createdAt)
    return Math.max(0, Math.floor(remaining / 1000))
  })

  const setStadion = (id: number, name: string) => {
    if (cart.value.stadionId && cart.value.stadionId !== id) {
      cart.value.slots = []
    }
    
    cart.value.stadionId = id
    cart.value.stadionName = name
    cart.value.createdAt = Date.now()
  }

  const hasSlot = (slotKey: string): boolean => {
    return cart.value.slots.some(slot => slot.key === slotKey)
  }

  const addSlot = (slot: BookingSlot): boolean => {
    if (isExpired.value) {
      clearCart()
      return false
    }

    if (hasSlot(slot.key)) {
      return false
    }

    cart.value.slots.push(slot)
    
    if (!cart.value.createdAt) {
      cart.value.createdAt = Date.now()
    }

    return true
  }

  const removeSlot = (slotKey: string) => {
    cart.value.slots = cart.value.slots.filter(slot => slot.key !== slotKey)
    
    if (cart.value.slots.length === 0) {
      cart.value.stadionId = null
      cart.value.stadionName = ''
      cart.value.createdAt = Date.now()
    }
  }

  const clearCart = () => {
    cart.value = {
      stadionId: null,
      stadionName: '',
      slots: [],
      createdAt: Date.now(),
    }
    
    if (process.client) {
      localStorage.removeItem(STORAGE_KEY)
    }
  }

  if (isExpired.value) {
    clearCart()
  }

  return {
    cart,
    totalSlots,
    totalPrice,
    isEmpty,
    isExpired,
    addSlot,
    removeSlot,
    clearCart,
    hasSlot,
    setStadion,
    timeRemaining,
  }
}
