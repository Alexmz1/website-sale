<template>
  <header class="header">
    <h1>TechShop Pro</h1>
    <button class="cart-button" @click="openCart">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M7 18c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12L8.1 13h7.45c.75 0 1.41-.41 1.75-1.03L21.7 4H5.21l-.94-2H1zm16 16c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
      </svg>
      Panier
      <span v-if="cartStore.totalItems > 0" class="cart-badge">
        {{ cartStore.totalItems }}
      </span>
    </button>
  </header>
</template>

<script>
import { useCartStore } from '../store/cart.js'

export default {
  name: 'Header',
  setup() {
    const cartStore = useCartStore()
    return {
      cartStore
    }
  },
  methods: {
    openCart() {
      this.cartStore.openCart()
    }
  }
}
</script>
