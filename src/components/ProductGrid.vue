<template>
  <div style="max-width: 1200px; margin: 0 auto; padding: 0 20px;">
    <h1 style="text-align: center; margin: 40px 0; font-size: 2.5rem; font-weight: bold; color: #1f2937;">
      Nos Produits Tech
    </h1>
    
    <div v-if="loading" style="text-align: center; padding: 40px 0;">
      <div style="color: #3b82f6; font-size: 3rem; margin-bottom: 16px;">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor" style="animation: spin 1s linear infinite; margin: 0 auto;">
          <path d="M12,1A11,11,0,1,0,23,12,11,11,0,0,0,12,1Zm0,19a8,8,0,1,1,8-8A8,8,0,0,1,12,20Z" opacity=".25"/>
          <path d="M12,4a8,8,0,0,1,7.89,6.7A1.53,1.53,0,0,0,21.38,12h0a1.5,1.5,0,0,0,1.48-1.75,11,11,0,0,0-21.72,0A1.5,1.5,0,0,0,2.62,12h0a1.53,1.53,0,0,0,1.49-1.3A8,8,0,0,1,12,4Z"/>
        </svg>
      </div>
      <p style="color: #6b7280;">Chargement des produits...</p>
    </div>
    
    <div v-else-if="error" style="background-color: #ef4444; color: white; padding: 20px; border-radius: 8px; text-align: center; margin: 20px 0;">
      {{ error }}
    </div>
    
    <div v-else class="products-grid">
      <ProductCard
        v-for="product in products"
        :key="product.id"
        :product="product"
        @product-click="onProductClick"
      />
    </div>
  </div>
</template>

<script>
import ProductCard from './ProductCard.vue'
import { productService } from '../services/api.js'

export default {
  name: 'ProductGrid',
  components: {
    ProductCard
  },
  data() {
    return {
      products: [],
      loading: true,
      error: null
    }
  },
  async mounted() {
    await this.loadProducts()
  },
  methods: {
    async loadProducts() {
      try {
        this.loading = true
        this.error = null
        this.products = await productService.getProducts()
      } catch (error) {
        this.error = 'Erreur lors du chargement des produits'
        console.error('Erreur:', error)
      } finally {
        this.loading = false
      }
    },
    
    onProductClick(product) {
      console.log('Produit cliqué:', product.name)
    }
  }
}
</script>
