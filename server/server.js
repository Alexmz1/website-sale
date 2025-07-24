import express from 'express'
import cors from 'cors'
import helmet from 'helmet'

const app = express()
const PORT = process.env.PORT || 3005

// Middleware
app.use(helmet())
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://your-domain.vercel.app'] // Remplacez par votre domaine Vercel
    : ['http://localhost:3000', 'http://localhost:3004', 'http://localhost:3005', 'http://127.0.0.1:3000', 'http://127.0.0.1:3004'],
  credentials: true
}))
app.use(express.json())

// Middleware de logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`)
  next()
})

// Route de test
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'API de paiement fonctionnelle' })
})

// Route de traitement du paiement
app.post('/api/payment', async (req, res) => {
  try {
    console.log('Données de paiement reçues:', req.body)
    
    const { cardNumber, expiryDate, cvv, cardHolder, email, address, city, postalCode, items, total, subtotal, shipping } = req.body
    
    // Validation des données
    if (!cardNumber || !expiryDate || !cvv || !cardHolder || !email || !items || !total) {
      return res.status(400).json({
        error: 'Données de paiement incomplètes',
        message: 'Tous les champs obligatoires doivent être remplis'
      })
    }
    
    // Simulation d'une validation de carte
    if (cardNumber.length < 13) {
      return res.status(400).json({
        error: 'Numéro de carte invalide',
        message: 'Le numéro de carte doit contenir au moins 13 chiffres'
      })
    }
    
    // Simulation d'un délai de traitement
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    // Simulation d'une chance d'échec (10% de chance)
    if (Math.random() < 0.1) {
      return res.status(402).json({
        error: 'Paiement refusé',
        message: 'Votre carte a été refusée. Veuillez vérifier vos informations ou utiliser une autre carte.'
      })
    }
    
    // Génération d'un ID de transaction
    const transactionId = 'TXN_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9)
    
    // Simulation d'une réponse de succès
    const paymentResponse = {
      success: true,
      transactionId,
      amount: total,
      subtotal: subtotal || total,
      shipping: shipping || 0,
      currency: 'EUR',
      status: 'completed',
      timestamp: new Date().toISOString(),
      orderDetails: {
        items: items.map(item => ({
          name: item.name,
          quantity: item.quantity,
          price: item.price
        })),
        subtotal: subtotal || total,
        shipping: shipping || 0,
        total,
        customerEmail: email
      },
      message: 'Paiement traité avec succès'
    }
    
    console.log('Paiement réussi:', transactionId)
    res.json(paymentResponse)
    
  } catch (error) {
    console.error('Erreur lors du traitement du paiement:', error)
    res.status(500).json({
      error: 'Erreur serveur',
      message: 'Une erreur interne s\'est produite lors du traitement du paiement'
    })
  }
})

// Route pour récupérer les détails d'une transaction
app.get('/api/payment/:transactionId', (req, res) => {
  const { transactionId } = req.params
  
  // Simulation de récupération de transaction
  res.json({
    transactionId,
    status: 'completed',
    amount: 199.99,
    currency: 'EUR',
    timestamp: new Date().toISOString()
  })
})

// Route pour les remboursements
app.post('/api/payment/:transactionId/refund', (req, res) => {
  const { transactionId } = req.params
  const { amount, reason } = req.body
  
  // Simulation de remboursement
  res.json({
    success: true,
    refundId: 'REF_' + Date.now(),
    originalTransactionId: transactionId,
    amount,
    reason,
    status: 'processed',
    timestamp: new Date().toISOString()
  })
})

// Gestion des erreurs 404
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Route non trouvée',
    message: `La route ${req.originalUrl} n'existe pas`
  })
})

// Gestion globale des erreurs
app.use((error, req, res, next) => {
  console.error('Erreur globale:', error)
  res.status(500).json({
    error: 'Erreur serveur interne',
    message: 'Une erreur inattendue s\'est produite'
  })
})

// Démarrage du serveur (seulement en développement local)
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`🚀 Serveur API de paiement démarré sur http://localhost:${PORT}`)
    console.log(`📊 Endpoint de santé: http://localhost:${PORT}/api/health`)
    console.log(`💳 Endpoint de paiement: http://localhost:${PORT}/api/payment`)
  })
}

// Export pour Vercel
export default app
