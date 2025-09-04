import React, { useState } from 'react'
import { CreditCard, Check, Zap, Crown, Star } from 'lucide-react'
import { useApp } from '../context/AppContext'
import subscriptionService from '../services/stripe'

export default function BillingPanel() {
  const { state, dispatch } = useApp()
  const [isLoading, setIsLoading] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState(state.user.subscriptionTier)

  const plans = subscriptionService.getSubscriptionPlans()

  const handleUpgrade = async (plan) => {
    if (plan.id === state.user.subscriptionTier) return

    setIsLoading(true)
    try {
      await subscriptionService.createCheckoutSession(plan.priceId, state.user.userId)
    } catch (error) {
      console.error('Upgrade error:', error)
      // Handle error (show toast, etc.)
    } finally {
      setIsLoading(false)
    }
  }

  const handleManageBilling = async () => {
    setIsLoading(true)
    try {
      await subscriptionService.createPortalSession(state.user.customerId)
    } catch (error) {
      console.error('Billing portal error:', error)
      // Handle error
    } finally {
      setIsLoading(false)
    }
  }

  const getPlanIcon = (planId) => {
    return planId === 'basic' ? Zap : Crown
  }

  const getPlanColor = (planId) => {
    return planId === 'basic' 
      ? 'from-blue-500 to-cyan-500' 
      : 'from-purple-500 to-pink-500'
  }

  return (
    <div className="space-y-6">
      {/* Current Plan Status */}
      <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
          <CreditCard className="mr-2" size={20} />
          Current Plan
        </h3>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${getPlanColor(state.user.subscriptionTier)} flex items-center justify-center`}>
              {React.createElement(getPlanIcon(state.user.subscriptionTier), { size: 24, className: "text-white" })}
            </div>
            <div>
              <h4 className="text-white font-medium capitalize">
                {state.user.subscriptionTier} Plan
              </h4>
              <p className="text-white/70 text-sm">
                {state.user.subscriptionTier === 'basic' ? '$19/month' : '$49/month'}
              </p>
            </div>
          </div>
          
          <button
            onClick={handleManageBilling}
            disabled={isLoading}
            className="px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors disabled:opacity-50"
          >
            Manage Billing
          </button>
        </div>

        {/* Usage Stats */}
        <div className="mt-6 grid grid-cols-2 gap-4">
          <div className="bg-white/5 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-white/70 text-sm">Generations</span>
              <span className="text-white text-sm font-medium">
                {state.user.usage.generations}/{state.user.usage.limit === -1 ? '∞' : state.user.usage.limit}
              </span>
            </div>
            <div className="w-full bg-white/10 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full transition-all duration-300"
                style={{ 
                  width: `${subscriptionService.getUsagePercentage(state.user, 'generations')}%` 
                }}
              />
            </div>
          </div>

          <div className="bg-white/5 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-white/70 text-sm">Posts</span>
              <span className="text-white text-sm font-medium">
                {state.user.usage.posts}/{plans.find(p => p.id === state.user.subscriptionTier)?.limits.posts || 0}
              </span>
            </div>
            <div className="w-full bg-white/10 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full transition-all duration-300"
                style={{ 
                  width: `${subscriptionService.getUsagePercentage(state.user, 'posts')}%` 
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Available Plans */}
      <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
        <h3 className="text-lg font-semibold text-white mb-6">Available Plans</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {plans.map((plan) => {
            const isCurrentPlan = plan.id === state.user.subscriptionTier
            const PlanIcon = getPlanIcon(plan.id)

            return (
              <div
                key={plan.id}
                className={`
                  relative rounded-xl p-6 border transition-all duration-200
                  ${isCurrentPlan
                    ? 'bg-white/20 border-white/40'
                    : 'bg-white/5 border-white/20 hover:bg-white/10'
                  }
                `}
              >
                {plan.id === 'pro' && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 py-1 rounded-full text-xs font-medium flex items-center">
                      <Star size={12} className="mr-1" />
                      Most Popular
                    </div>
                  </div>
                )}

                <div className="flex items-center space-x-3 mb-4">
                  <div className={`w-10 h-10 rounded-lg bg-gradient-to-r ${getPlanColor(plan.id)} flex items-center justify-center`}>
                    <PlanIcon size={20} className="text-white" />
                  </div>
                  <div>
                    <h4 className="text-white font-semibold">{plan.name}</h4>
                    <div className="flex items-baseline">
                      <span className="text-2xl font-bold text-white">${plan.price}</span>
                      <span className="text-white/70 text-sm ml-1">/{plan.interval}</span>
                    </div>
                  </div>
                </div>

                <ul className="space-y-2 mb-6">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center text-white/80 text-sm">
                      <Check size={16} className="text-green-300 mr-2 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => handleUpgrade(plan)}
                  disabled={isCurrentPlan || isLoading}
                  className={`
                    w-full py-3 px-4 rounded-lg font-medium transition-all duration-200
                    ${isCurrentPlan
                      ? 'bg-white/10 text-white/50 cursor-not-allowed'
                      : 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:shadow-lg'
                    }
                  `}
                >
                  {isCurrentPlan ? 'Current Plan' : `Upgrade to ${plan.name}`}
                </button>
              </div>
            )
          })}
        </div>
      </div>

      {/* Billing History */}
      <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
        <h3 className="text-lg font-semibold text-white mb-4">Recent Billing</h3>
        
        <div className="space-y-3">
          {/* Mock billing history */}
          <div className="flex items-center justify-between py-3 border-b border-white/10">
            <div>
              <p className="text-white font-medium">Basic Plan</p>
              <p className="text-white/70 text-sm">Dec 1, 2024</p>
            </div>
            <div className="text-right">
              <p className="text-white font-medium">$19.00</p>
              <p className="text-green-300 text-sm">Paid</p>
            </div>
          </div>
          
          <div className="flex items-center justify-between py-3 border-b border-white/10">
            <div>
              <p className="text-white font-medium">Basic Plan</p>
              <p className="text-white/70 text-sm">Nov 1, 2024</p>
            </div>
            <div className="text-right">
              <p className="text-white font-medium">$19.00</p>
              <p className="text-green-300 text-sm">Paid</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
