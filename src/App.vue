<template>
  <div id="app" class="min-h-screen bg-gray-100">
    <Header />
    
    <ProductGrid />
    
    <CartModal />
    
    <CheckoutForm />
  </div>
</template>

<script>
import Header from './components/Header.vue'
import ProductGrid from './components/ProductGrid.vue'
import CartModal from './components/CartModal.vue'
import CheckoutForm from './components/CheckoutForm.vue'

export default {
  name: 'App',
  components: {
    Header,
    ProductGrid,
    CartModal,
    CheckoutForm
  }
}
</script>

