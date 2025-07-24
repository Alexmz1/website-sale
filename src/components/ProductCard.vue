<template>
  <div class="product-card" @click="$emit('productClick', product)">
    <img 
      :src="product.image" 
      :alt="product.name"
      class="product-image"
      @error="handleImageError"
    />
    <div class="product-info">
      <h3 class="product-title">{{ product.name }}</h3>
      <p class="product-description">{{ product.description }}</p>
      <div class="product-price">{{ formatPrice(product.price) }} €</div>
      <button 
        class="add-to-cart-btn"
        @click.stop="addToCart"
        :disabled="adding"
      >
        {{ adding ? 'Ajout...' : 'Ajouter au panier' }}
      </button>
    </div>
  </div>
</template>

<script>
import { useCartStore } from '../store/cart.js'

export default {
  name: 'ProductCard',
  props: {
    product: {
      type: Object,
      required: true
    }
  },
  emits: ['productClick'],
  data() {
    return {
      adding: false
    }
  },
  setup() {
    const cartStore = useCartStore()
    return {
      cartStore
    }
  },
  methods: {
    async addToCart() {
      this.adding = true
      
      await new Promise(resolve => setTimeout(resolve, 300))
      
      this.cartStore.addToCart(this.product)
      this.adding = false
      
      this.$emit('productClick', this.product)
    },
    
    formatPrice(price) {
      return price.toFixed(2)
    },
    
    handleImageError(event) {
      event.target.src = 'https://via.placeholder.com/400x300/ecf0f1/2c3e50?text=Image+non+disponible'
    }
  }
}
</script>
