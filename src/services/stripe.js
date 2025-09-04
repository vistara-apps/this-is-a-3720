import { loadStripe } from '@stripe/stripe-js'

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY)

export const subscriptionService = {
  /**
   * Create a Stripe Checkout session for subscription
   * @param {string} priceId - Stripe price ID for the subscription plan
   * @param {string} userId - User ID for the subscription
   * @returns {Promise<void>} Redirects to Stripe Checkout
   */
  async createCheckoutSession(priceId, userId) {
    try {
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          priceId,
          userId,
          successUrl: `${window.location.origin}/dashboard?success=true`,
          cancelUrl: `${window.location.origin}/billing?canceled=true`,
        }),
      })

      const session = await response.json()

      if (session.error) {
        throw new Error(session.error)
      }

      const stripe = await stripePromise
      const { error } = await stripe.redirectToCheckout({
        sessionId: session.id,
      })

      if (error) {
        throw error
      }
    } catch (error) {
      console.error('Stripe Checkout Error:', error)
      throw new Error(`Failed to create checkout session: ${error.message}`)
    }
  },

  /**
   * Create a Stripe Customer Portal session
   * @param {string} customerId - Stripe customer ID
   * @returns {Promise<void>} Redirects to Stripe Customer Portal
   */
  async createPortalSession(customerId) {
    try {
      const response = await fetch('/api/create-portal-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customerId,
          returnUrl: `${window.location.origin}/billing`,
        }),
      })

      const session = await response.json()

      if (session.error) {
        throw new Error(session.error)
      }

      window.location.href = session.url
    } catch (error) {
      console.error('Stripe Portal Error:', error)
      throw new Error(`Failed to create portal session: ${error.message}`)
    }
  },

  /**
   * Get subscription plans configuration
   * @returns {Array} Available subscription plans
   */
  getSubscriptionPlans() {
    return [
      {
        id: 'basic',
        name: 'Basic Plan',
        price: 19,
        priceId: import.meta.env.VITE_STRIPE_BASIC_PRICE_ID,
        interval: 'month',
        features: [
          '100 ad generations per month',
          '10 auto-posts per month',
          'Instagram & TikTok support',
          'Basic analytics',
          'Email support'
        ],
        limits: {
          generations: 100,
          posts: 10
        }
      },
      {
        id: 'pro',
        name: 'Pro Plan',
        price: 49,
        priceId: import.meta.env.VITE_STRIPE_PRO_PRICE_ID,
        interval: 'month',
        features: [
          'Unlimited ad generations',
          '50 auto-posts per month',
          'Instagram & TikTok support',
          'Advanced analytics',
          'Priority support',
          'Custom prompts',
          'A/B testing insights'
        ],
        limits: {
          generations: -1, // Unlimited
          posts: 50
        }
      }
    ]
  },

  /**
   * Check if user has reached usage limits
   * @param {Object} user - User object with subscription and usage data
   * @param {string} type - Type of usage to check ('generations' or 'posts')
   * @returns {boolean} Whether user has reached the limit
   */
  hasReachedLimit(user, type) {
    const plans = this.getSubscriptionPlans()
    const userPlan = plans.find(plan => plan.id === user.subscriptionTier)
    
    if (!userPlan) return true
    
    const limit = userPlan.limits[type]
    if (limit === -1) return false // Unlimited
    
    return user.usage[type] >= limit
  },

  /**
   * Get usage percentage for display
   * @param {Object} user - User object with subscription and usage data
   * @param {string} type - Type of usage ('generations' or 'posts')
   * @returns {number} Usage percentage (0-100)
   */
  getUsagePercentage(user, type) {
    const plans = this.getSubscriptionPlans()
    const userPlan = plans.find(plan => plan.id === user.subscriptionTier)
    
    if (!userPlan) return 100
    
    const limit = userPlan.limits[type]
    if (limit === -1) return 0 // Unlimited
    
    return Math.min((user.usage[type] / limit) * 100, 100)
  }
}

export default subscriptionService
