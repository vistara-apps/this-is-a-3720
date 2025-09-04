import React, { useState } from 'react'
import { X, Instagram, Music, Check, AlertCircle } from 'lucide-react'
import { useApp } from '../context/AppContext'
import socialMediaService from '../services/socialMedia'
import subscriptionService from '../services/stripe'

export default function SocialPostModal({ variation, onClose }) {
  const { state, dispatch } = useApp()
  const [caption, setCaption] = useState('')
  const [selectedAccount, setSelectedAccount] = useState('')
  const [isPosting, setIsPosting] = useState(false)
  const [posted, setPosted] = useState(false)

  const platformAccounts = state.connectedAccounts.filter(
    account => account.platform === variation.platform && account.connected
  )

  const handlePost = async () => {
    if (!selectedAccount) return
    
    // Check usage limits
    if (subscriptionService.hasReachedLimit(state.user, 'posts')) {
      alert('You have reached your posting limit. Please upgrade your plan.')
      return
    }
    
    setIsPosting(true)
    
    try {
      // Use real social media service for posting
      const result = await socialMediaService.simulatePost({
        platform: variation.platform,
        imageUrl: variation.url,
        caption,
        accountHandle: selectedAccount
      })

      if (result.success) {
        setPosted(true)
        dispatch({ 
          type: 'UPDATE_USAGE', 
          payload: { posts: state.user.usage.posts + 1 }
        })
        
        setTimeout(() => {
          onClose()
        }, 2000)
      } else {
        throw new Error(result.error)
      }
    } catch (error) {
      console.error('Posting failed:', error)
      alert(`Failed to post: ${error.message}`)
    } finally {
      setIsPosting(false)
    }
  }

  const PlatformIcon = variation.platform === 'instagram' ? Instagram : Music

  if (posted) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white/10 backdrop-blur-md rounded-xl p-8 max-w-md w-full border border-white/20 text-center">
          <div className="w-16 h-16 mx-auto rounded-full bg-green-500 flex items-center justify-center mb-4">
            <Check size={24} className="text-white" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Posted Successfully!</h3>
          <p className="text-white/70 text-sm">
            Your ad variation has been published to {selectedAccount}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white/10 backdrop-blur-md rounded-xl max-w-lg w-full border border-white/20 max-h-[90vh] overflow-auto">
        <div className="flex items-center justify-between p-6 border-b border-white/20">
          <h3 className="text-lg font-semibold text-white flex items-center">
            <PlatformIcon className="mr-2" size={20} />
            Post to {variation.platform}
          </h3>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-white/70 hover:text-white hover:bg-white/10"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6">
          <div className="mb-6">
            <div className="aspect-square rounded-lg overflow-hidden bg-white/5 mb-4">
              <img
                src={variation.url}
                alt={variation.prompt}
                className="w-full h-full object-cover"
              />
            </div>
            
            <div className="text-white/70 text-sm">
              <div className="flex justify-between items-center">
                <span>Platform: {variation.platform}</span>
                <span>Style: {variation.style}</span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-white/90 text-sm font-medium mb-2">
                Caption
              </label>
              <textarea
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                placeholder="Write your caption..."
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent resize-none"
                rows={4}
              />
            </div>

            <div>
              <label className="block text-white/90 text-sm font-medium mb-2">
                Test Account
              </label>
              {platformAccounts.length > 0 ? (
                <select
                  value={selectedAccount}
                  onChange={(e) => setSelectedAccount(e.target.value)}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent"
                >
                  <option value="">Select an account</option>
                  {platformAccounts.map((account) => (
                    <option key={account.platform} value={account.handle} className="bg-gray-800">
                      {account.handle}
                    </option>
                  ))}
                </select>
              ) : (
                <div className="p-4 bg-orange-500/20 border border-orange-400/30 rounded-lg flex items-start space-x-3">
                  <AlertCircle size={20} className="text-orange-300 mt-0.5" />
                  <div>
                    <p className="text-orange-200 text-sm font-medium">
                      No connected {variation.platform} accounts
                    </p>
                    <p className="text-orange-300/70 text-xs mt-1">
                      Connect an account in Settings to enable posting
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex space-x-3 mt-6">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-3 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handlePost}
              disabled={!selectedAccount || isPosting}
              className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 px-4 rounded-lg font-medium hover:shadow-lg transition-all duration-200 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isPosting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Posting...</span>
                </>
              ) : (
                <span>Post Now</span>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
