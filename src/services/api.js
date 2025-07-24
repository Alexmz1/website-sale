// Service pour récupérer les produits
export const productService = {
  // Simulation de données produits
  async getProducts() {
    // Simulation d'un délai d'API
    await new Promise(resolve => setTimeout(resolve, 500))
    
    return [
      {
        id: 1,
        name: "iPhone 15 Pro",
        description: "Smartphone Apple avec puce A17 Pro, appareil photo 48MP et écran Super Retina XDR 6.1 pouces",
        price: 1199.99,
        image: "https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=400&h=300&fit=crop",
        category: "électronique"
      },
      {
        id: 2,
        name: "Sony WH-1000XM5",
        description: "Casque sans fil à réduction de bruit avec son haute résolution et autonomie 30h",
        price: 349.99,
        image: "https://images.unsplash.com/photo-1545127398-14699f92334b?w=400&h=300&fit=crop",
        category: "audio"
      },
      {
        id: 3,
        name: "MacBook Pro 16\"",
        description: "Ordinateur portable Apple avec puce M3 Pro, 18GB RAM et SSD 512GB",
        price: 2499.99,
        image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=300&fit=crop",
        category: "informatique"
      },
      {
        id: 4,
        name: "Apple Watch Series 9",
        description: "Montre connectée avec GPS, monitoring santé avancé et résistance à l'eau",
        price: 429.99,
        image: "https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?w=400&h=300&fit=crop",
        category: "wearables"
      },
      {
        id: 5,
        name: "iPad Pro 12.9\"",
        description: "Tablette professionnelle avec puce M2, écran Liquid Retina XDR et support Apple Pencil",
        price: 1099.99,
        image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&h=300&fit=crop",
        category: "tablettes"
      },
      {
        id: 6,
        name: "Canon EOS R6 Mark II",
        description: "Appareil photo hybride 24MP avec stabilisation 5 axes et vidéo 4K",
        price: 2499.99,
        image: "https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?w=400&h=300&fit=crop",
        category: "photo"
      },
      {
        id: 7,
        name: "Nintendo Switch OLED",
        description: "Console portable avec écran OLED 7 pouces et manettes Joy-Con",
        price: 349.99,
        image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop",
        category: "gaming"
      },
      {
        id: 8,
        name: "Bose SoundLink Max",
        description: "Enceinte Bluetooth portable avec son stéréo premium et résistance à l'eau IPX4",
        price: 199.99,
        image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&h=300&fit=crop",
        category: "audio"
      }
    ]
  },

  async getProductById(id) {
    const products = await this.getProducts()
    return products.find(product => product.id === id)
  }
}

// Service pour le paiement
export const paymentService = {
  async processPayment(paymentData) {
    // Appel à notre API de paiement locale
    try {
      // URL dynamique selon l'environnement
      const apiUrl = import.meta.env.PROD 
        ? '/api/payment'  // En production, utilise l'API Vercel
        : 'http://localhost:3005/api/payment'  // En développement, utilise le serveur local
      
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getAuthToken()}`
        },
        body: JSON.stringify(paymentData)
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Erreur de paiement')
      }

      return await response.json()
    } catch (error) {
      console.error('Erreur lors du traitement du paiement:', error)
      throw error
    }
  },

  validateCardNumber(cardNumber) {
    // Validation simple du numéro de carte (algorithme de Luhn)
    const number = cardNumber.replace(/\s/g, '')
    
    if (!/^\d{13,19}$/.test(number)) {
      return false
    }

    let sum = 0
    let isEven = false
    
    for (let i = number.length - 1; i >= 0; i--) {
      let digit = parseInt(number.charAt(i))
      
      if (isEven) {
        digit *= 2
        if (digit > 9) {
          digit -= 9
        }
      }
      
      sum += digit
      isEven = !isEven
    }
    
    return sum % 10 === 0
  },

  validateExpiryDate(expiry) {
    const [month, year] = expiry.split('/')
    const now = new Date()
    const currentYear = now.getFullYear() % 100
    const currentMonth = now.getMonth() + 1
    
    const expiryMonth = parseInt(month)
    const expiryYear = parseInt(year)
    
    if (expiryMonth < 1 || expiryMonth > 12) {
      return false
    }
    
    if (expiryYear < currentYear || (expiryYear === currentYear && expiryMonth < currentMonth)) {
      return false
    }
    
    return true
  },

  validateCVV(cvv) {
    return /^\d{3,4}$/.test(cvv)
  }
}

// Utilitaire pour le token d'authentification
function getAuthToken() {
  // Récupération du token depuis le localStorage ou autre
  return localStorage.getItem('authToken') || 'demo-token'
}
