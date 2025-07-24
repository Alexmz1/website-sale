<template>
  <div v-if="cartStore.isCartOpen" class="cart-overlay" @click="closeCart">
    <div class="cart-modal" @click.stop>
      <div class="cart-header">
        <h2 class="cart-title">Panier ({{ cartStore.totalItems }})</h2>
        <button class="cart-close-btn" @click="closeCart">×</button>
      </div>
      
      <div v-if="cartStore.items.length === 0" class="cart-empty">
        <div style="margin-bottom: 20px; opacity: 0.6;">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="#bdc3c7" style="margin: 0 auto;">
            <path d="M7 18c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12L8.1 13h7.45c.75 0 1.41-.41 1.75-1.03L21.7 4H5.21l-.94-2H1zm16 16c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
          </svg>
        </div>
        <p>Votre panier est vide</p>
      </div>
      
      <div v-else>
        <div 
          v-for="item in cartStore.items" 
          :key="item.id" 
          class="cart-item"
        >
          <img 
            :src="item.image" 
            :alt="item.name"
            class="cart-item-image"
            @error="handleImageError"
          />
          <div class="cart-item-details">
            <div class="cart-item-name">{{ item.name }}</div>
            <div class="cart-item-price">{{ formatPrice(item.price) }} €</div>
            <div class="cart-item-controls">
              <button 
                class="quantity-control-btn" 
                @click="decreaseQuantity(item.id)"
              >
                -
              </button>
              <span class="quantity-display">{{ item.quantity }}</span>
              <button 
                class="quantity-control-btn" 
                @click="increaseQuantity(item.id)"
              >
                +
              </button>
              <button 
                class="remove-btn" 
                @click="removeItem(item.id)"
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>
        
        <div class="cart-summary">
          <div v-if="cartStore.shippingCost === 0" class="shipping-info shipping-free">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" style="margin-right: 8px;">
              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
            </svg>
            Livraison gratuite
          </div>
          
          <div v-else class="shipping-progress">
            <div class="shipping-progress-text">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" style="margin-right: 8px;">
                <path d="M20,8h-3V4H3C1.9,4,1,4.9,1,6v12c0,1.1,0.9,2,2,2h3c0-1.66,1.34-3,3-3s3,1.34,3,3h6c0-1.66,1.34-3,3-3s3,1.34,3,3h1V12L20,8z M6,18.5C6,17.67,5.33,17,4.5,17S3,17.67,3,18.5S3.67,20,4.5,20S6,19.33,6,18.5z M19.5,17c-0.83,0-1.5,0.67-1.5,1.5S18.67,20,19.5,20S21,19.33,21,18.5S20.33,17,19.5,17z"/>
              </svg>
              Plus que {{ cartStore.amountForFreeShipping.toFixed(2) }}€ pour la livraison gratuite
            </div>
            <div class="progress-container">
              <div class="progress-fill" :style="{ width: (cartStore.totalPrice / cartStore.freeShippingThreshold * 100) + '%' }"></div>
            </div>
          </div>

          <div class="price-breakdown">
            <div class="price-row price-subtotal">
              <span>Sous-total</span>
              <span>{{ cartStore.formattedTotal }} €</span>
            </div>
            <div class="price-row price-shipping">
              <span>Livraison</span>
              <span v-if="cartStore.shippingCost === 0" class="price-shipping-free">Gratuite</span>
              <span v-else>{{ cartStore.shippingCost.toFixed(2) }} €</span>
            </div>
            <div class="price-row price-total">
              <span>Total</span>
              <span>{{ cartStore.formattedTotalWithShipping }} €</span>
            </div>
          </div>
          
          <button class="checkout-btn" @click="proceedToCheckout">
            Procéder au paiement
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useCartStore } from '../store/cart.js'

export default {
  name: 'CartModal',
  setup() {
    const cartStore = useCartStore()
    return {
      cartStore
    }
  },
  methods: {
    closeCart() {
      this.cartStore.closeCart()
    },
    
    increaseQuantity(productId) {
      const item = this.cartStore.items.find(item => item.id === productId)
      if (item) {
        this.cartStore.updateQuantity(productId, item.quantity + 1)
      }
    },
    
    decreaseQuantity(productId) {
      const item = this.cartStore.items.find(item => item.id === productId)
      if (item && item.quantity > 1) {
        this.cartStore.updateQuantity(productId, item.quantity - 1)
      } else if (item) {
        this.cartStore.removeFromCart(productId)
      }
    },
    
    removeItem(productId) {
      this.cartStore.removeFromCart(productId)
    },
    
    proceedToCheckout() {
      this.cartStore.openCheckout()
    },
    
    formatPrice(price) {
      return price.toFixed(2)
    },
    
    handleImageError(event) {
      event.target.src = 'https://via.placeholder.com/80x80/ecf0f1/2c3e50?text=?'
    }
  }
}
</script>
