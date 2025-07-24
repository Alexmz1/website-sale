<template>
  <div v-if="cartStore.isCheckoutOpen" class="payment-overlay" @click="closeCheckout">
    <div class="payment-modal" @click.stop>
      <div class="payment-header">
        <h2 class="payment-title">Paiement</h2>
        <button class="payment-close-btn" @click="closeCheckout">×</button>
      </div>
      
      <div v-if="cartStore.paymentSuccess" class="payment-success">
        <div class="payment-success-icon">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor" style="margin-right: 12px;">
            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
          </svg>
          <h3>Paiement réussi !</h3>
        </div>
        <p>Votre commande a été traitée avec succès. Vous recevrez un email de confirmation.</p>
        <button class="payment-success-btn" @click="closeCheckout">
          Fermer
        </button>
      </div>
      
      <div v-else>
        <div v-if="cartStore.paymentError" class="payment-error">
          {{ cartStore.paymentError }}
        </div>
        
        <div class="order-summary">
          <h3>Résumé de la commande</h3>
          <div v-for="item in cartStore.items" :key="item.id" class="order-item">
            <span>{{ item.name }} (x{{ item.quantity }})</span>
            <span>{{ formatPrice(item.price * item.quantity) }} €</span>
          </div>
          <hr class="order-divider">
          <div class="order-subtotal">
            <span>Sous-total</span>
            <span>{{ cartStore.formattedTotal }} €</span>
          </div>
          <div class="order-shipping">
            <span>Livraison</span>
            <span v-if="cartStore.shippingCost === 0" class="order-shipping-free">Gratuite</span>
            <span v-else>{{ cartStore.shippingCost.toFixed(2) }} €</span>
          </div>
          <div class="order-total">
            <span>Total</span>
            <span>{{ cartStore.formattedTotalWithShipping }} €</span>
          </div>
        </div>
        
        <div class="payment-form">
          <form @submit.prevent="processPayment">
            <h3 class="form-section-title">Informations de paiement</h3>
            
            <div class="form-group">
              <label class="form-label" for="cardNumber">Numéro de carte</label>
              <input
                id="cardNumber"
                v-model="paymentForm.cardNumber"
                type="text"
                class="form-input"
                placeholder="1234 5678 9012 3456"
                maxlength="19"
                @input="formatCardNumber"
                required
              >
            </div>
            
            <div class="form-row">
              <div class="form-group">
                <label class="form-label" for="expiryDate">Date d'expiration</label>
                <input
                  id="expiryDate"
                  v-model="paymentForm.expiryDate"
                  type="text"
                  class="form-input"
                  placeholder="MM/AA"
                  maxlength="5"
                  @input="formatExpiryDate"
                  required
                >
              </div>
              <div class="form-group">
                <label class="form-label" for="cvv">CVV</label>
                <input
                  id="cvv"
                  v-model="paymentForm.cvv"
                  type="text"
                  class="form-input"
                  placeholder="123"
                  maxlength="4"
                  required
                >
              </div>
            </div>
            
            <div class="form-group">
              <label class="form-label" for="cardHolder">Nom du titulaire</label>
              <input
                id="cardHolder"
                v-model="paymentForm.cardHolder"
                type="text"
                class="form-input"
                placeholder="Jean Dupont"
                required
              >
            </div>
            
            <h3 class="form-section-title" style="margin-top: 2rem;">Adresse de facturation</h3>
            
            <div class="form-group">
              <label class="form-label" for="email">Email</label>
              <input
                id="email"
                v-model="paymentForm.email"
                type="email"
                class="form-input"
                placeholder="jean.dupont@email.com"
                required
              >
            </div>
            
            <div class="form-group">
              <label class="form-label" for="address">Adresse</label>
              <input
                id="address"
                v-model="paymentForm.address"
                type="text"
                class="form-input"
                placeholder="123 Rue de la Paix"
                required
              >
            </div>
            
            <div class="form-row">
              <div class="form-group">
                <label class="form-label" for="city">Ville</label>
                <input
                  id="city"
                  v-model="paymentForm.city"
                  type="text"
                  class="form-input"
                  placeholder="Paris"
                  required
                >
              </div>
              <div class="form-group">
                <label class="form-label" for="postalCode">Code postal</label>
                <input
                  id="postalCode"
                  v-model="paymentForm.postalCode"
                  type="text"
                  class="form-input"
                  placeholder="75001"
                  maxlength="5"
                  required
                >
              </div>
            </div>
            
            <button 
              type="submit" 
              class="payment-submit-btn"
              :disabled="cartStore.paymentLoading || !isFormValid"
            >
              {{ cartStore.paymentLoading ? 'Traitement en cours...' : `Payer ${cartStore.formattedTotalWithShipping} €` }}
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useCartStore } from '../store/cart.js'
import { paymentService } from '../services/api.js'

export default {
  name: 'CheckoutForm',
  data() {
    return {
      paymentForm: {
        cardNumber: '',
        expiryDate: '',
        cvv: '',
        cardHolder: '',
        email: '',
        address: '',
        city: '',
        postalCode: ''
      }
    }
  },
  setup() {
    const cartStore = useCartStore()
    return {
      cartStore
    }
  },
  computed: {
    isFormValid() {
      const form = this.paymentForm
      return (
        form.cardNumber.replace(/\s/g, '').length >= 13 &&
        form.expiryDate.length === 5 &&
        form.cvv.length >= 3 &&
        form.cardHolder.trim() &&
        form.email.includes('@') &&
        form.address.trim() &&
        form.city.trim() &&
        form.postalCode.length === 5
      )
    }
  },
  methods: {
    closeCheckout() {
      this.cartStore.closeCheckout()
      this.resetForm()
    },
    
    formatCardNumber() {
      let value = this.paymentForm.cardNumber.replace(/\s/g, '')
      value = value.replace(/\D/g, '')
      value = value.replace(/(\d{4})(?=\d)/g, '$1 ')
      this.paymentForm.cardNumber = value
    },
    
    formatExpiryDate() {
      let value = this.paymentForm.expiryDate.replace(/\D/g, '')
      if (value.length >= 2) {
        value = value.substring(0, 2) + '/' + value.substring(2, 4)
      }
      this.paymentForm.expiryDate = value
    },
    
    async processPayment() {
      if (!this.isFormValid) {
        return
      }
      
      const cardNumber = this.paymentForm.cardNumber.replace(/\s/g, '')
      if (!paymentService.validateCardNumber(cardNumber)) {
        this.cartStore.paymentError = 'Numéro de carte invalide'
        return
      }
      
      if (!paymentService.validateExpiryDate(this.paymentForm.expiryDate)) {
        this.cartStore.paymentError = 'Date d\'expiration invalide'
        return
      }
      
      if (!paymentService.validateCVV(this.paymentForm.cvv)) {
        this.cartStore.paymentError = 'CVV invalide'
        return
      }
      
      try {
        await this.cartStore.processPayment({
          ...this.paymentForm,
          cardNumber: cardNumber
        })
        
        this.resetForm()
      } catch (error) {
        console.error('Erreur de paiement:', error)
      }
    },
    
    resetForm() {
      this.paymentForm = {
        cardNumber: '',
        expiryDate: '',
        cvv: '',
        cardHolder: '',
        email: '',
        address: '',
        city: '',
        postalCode: ''
      }
    },
    
    formatPrice(price) {
      return price.toFixed(2)
    }
  }
}
</script>
