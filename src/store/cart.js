import { defineStore } from 'pinia'

export const useCartStore = defineStore('cart', {
  state: () => ({
    items: [],
    isCartOpen: false,
    isCheckoutOpen: false,
    paymentLoading: false,
    paymentSuccess: false,
    paymentError: null
  }),

  getters: {
    totalItems: (state) => {
      return state.items.reduce((total, item) => total + item.quantity, 0)
    },
    
    totalPrice: (state) => {
      return state.items.reduce((total, item) => total + (item.price * item.quantity), 0)
    },
    
    formattedTotal: (state) => {
      const total = state.items.reduce((total, item) => total + (item.price * item.quantity), 0)
      return total.toFixed(2)
    },
    
    shippingCost: (state) => {
      const total = state.items.reduce((total, item) => total + (item.price * item.quantity), 0)
      return total >= 99 ? 0 : 5.99
    },
    
    totalWithShipping: (state) => {
      const subtotal = state.items.reduce((total, item) => total + (item.price * item.quantity), 0)
      const shipping = subtotal >= 99 ? 0 : 5.99
      return subtotal + shipping
    },
    
    formattedTotalWithShipping: (state) => {
      const subtotal = state.items.reduce((total, item) => total + (item.price * item.quantity), 0)
      const shipping = subtotal >= 99 ? 0 : 5.99
      return (subtotal + shipping).toFixed(2)
    },
    
    freeShippingThreshold: () => 99,
    
    amountForFreeShipping: (state) => {
      const total = state.items.reduce((total, item) => total + (item.price * item.quantity), 0)
      return Math.max(0, 99 - total)
    }
  },

  actions: {
    addToCart(product) {
      const existingItem = this.items.find(item => item.id === product.id)
      
      if (existingItem) {
        existingItem.quantity += 1
      } else {
        this.items.push({
          ...product,
          quantity: 1
        })
      }
    },

    removeFromCart(productId) {
      const index = this.items.findIndex(item => item.id === productId)
      if (index > -1) {
        this.items.splice(index, 1)
      }
    },

    updateQuantity(productId, quantity) {
      const item = this.items.find(item => item.id === productId)
      if (item) {
        if (quantity <= 0) {
          this.removeFromCart(productId)
        } else {
          item.quantity = quantity
        }
      }
    },

    clearCart() {
      this.items = []
    },

    openCart() {
      this.isCartOpen = true
    },

    closeCart() {
      this.isCartOpen = false
    },

    openCheckout() {
      this.isCheckoutOpen = true
      this.isCartOpen = false
    },

    closeCheckout() {
      this.isCheckoutOpen = false
      this.paymentSuccess = false
      this.paymentError = null
    },

    async processPayment(paymentData) {
      this.paymentLoading = true
      this.paymentError = null
      
      try {
        // Import du service de paiement
        const { paymentService } = await import('../services/api.js')
        
        // Appel à notre API de paiement
        const response = await paymentService.processPayment({
          ...paymentData,
          items: this.items,
          total: this.totalWithShipping,
          subtotal: this.totalPrice,
          shipping: this.shippingCost
        })

        console.log('Réponse du paiement:', response)
        
        this.paymentSuccess = true
        this.clearCart()
        
        return response
      } catch (error) {
        this.paymentError = error.message || 'Une erreur est survenue lors du paiement'
        throw error
      } finally {
        this.paymentLoading = false
      }
    }
  }
})
