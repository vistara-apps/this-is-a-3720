import React, { useState } from 'react'
import { Instagram, Music, Link, Unlink, CheckCircle, AlertCircle, ExternalLink } from 'lucide-react'
import { useApp } from '../context/AppContext'
import socialMediaService from '../services/socialMedia'

export default function SocialAccountLinker() {
  const { state, dispatch } = useApp()
  const [isConnecting, setIsConnecting] = useState({})
  const [connectionStatus, setConnectionStatus] = useState({})

  const platforms = [
    {
      id: 'instagram',
      name: 'Instagram',
      icon: Instagram,
      color: 'from-pink-500 to-orange-500',
      description: 'Connect your Instagram account to post square format ads'
    },
    {
      id: 'tiktok',
      name: 'TikTok',
      icon: Music,
      color: 'from-black to-gray-700',
      description: 'Connect your TikTok account to post vertical format ads'
    }
  ]

  const handleConnect = async (platform) => {
    setIsConnecting(prev => ({ ...prev, [platform.id]: true }))
    
    try {
      // Get OAuth URL and redirect
      const oauthUrl = socialMediaService.getOAuthUrl(platform.id)
      
      // Store the platform we're connecting for the callback
      localStorage.setItem('connecting_platform', platform.id)
      
      // Redirect to OAuth
      window.location.href = oauthUrl
    } catch (error) {
      console.error('Connection error:', error)
      setConnectionStatus(prev => ({
        ...prev,
        [platform.id]: { success: false, message: error.message }
      }))
    } finally {
      setIsConnecting(prev => ({ ...prev, [platform.id]: false }))
    }
  }

  const handleDisconnect = async (platform) => {
    try {
      // Update local state
      dispatch({
        type: 'DISCONNECT_ACCOUNT',
        payload: platform.id
      })

      // Update database (if using real backend)
      // await socialAccountService.disconnectAccount(state.user.userId, platform.id)

      setConnectionStatus(prev => ({
        ...prev,
        [platform.id]: { success: true, message: `${platform.name} account disconnected` }
      }))
    } catch (error) {
      console.error('Disconnect error:', error)
      setConnectionStatus(prev => ({
        ...prev,
        [platform.id]: { success: false, message: error.message }
      }))
    }
  }

  const getAccountStatus = (platformId) => {
    return state.connectedAccounts.find(acc => acc.platform === platformId)
  }

  const isConnected = (platformId) => {
    const account = getAccountStatus(platformId)
    return account && account.connected
  }

  return (
    <div className="space-y-6">
      <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
          <Link className="mr-2" size={20} />
          Social Media Accounts
        </h3>
        
        <p className="text-white/70 text-sm mb-6">
          Connect your social media accounts to enable automatic posting of generated ad variations.
        </p>

        <div className="space-y-4">
          {platforms.map((platform) => {
            const PlatformIcon = platform.icon
            const connected = isConnected(platform.id)
            const account = getAccountStatus(platform.id)
            const connecting = isConnecting[platform.id]
            const status = connectionStatus[platform.id]

            return (
              <div
                key={platform.id}
                className="bg-white/5 rounded-lg p-4 border border-white/10"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${platform.color} flex items-center justify-center`}>
                      <PlatformIcon size={24} className="text-white" />
                    </div>
                    
                    <div>
                      <h4 className="text-white font-medium flex items-center">
                        {platform.name}
                        {connected && (
                          <CheckCircle size={16} className="text-green-300 ml-2" />
                        )}
                      </h4>
                      <p className="text-white/70 text-sm">
                        {connected ? `Connected as ${account.handle}` : platform.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    {connected ? (
                      <>
                        <button
                          onClick={() => handleDisconnect(platform)}
                          className="px-4 py-2 bg-red-500/20 text-red-300 rounded-lg hover:bg-red-500/30 transition-colors flex items-center space-x-2"
                        >
                          <Unlink size={16} />
                          <span>Disconnect</span>
                        </button>
                        
                        <a
                          href={`https://${platform.id}.com/${account.handle.replace('@', '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors"
                        >
                          <ExternalLink size={16} />
                        </a>
                      </>
                    ) : (
                      <button
                        onClick={() => handleConnect(platform)}
                        disabled={connecting}
                        className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:shadow-lg transition-all duration-200 flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {connecting ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            <span>Connecting...</span>
                          </>
                        ) : (
                          <>
                            <Link size={16} />
                            <span>Connect</span>
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>

                {/* Connection Status Message */}
                {status && (
                  <div className={`mt-3 p-3 rounded-lg flex items-start space-x-2 ${
                    status.success ? 'bg-green-500/20 border border-green-400/30' : 'bg-red-500/20 border border-red-400/30'
                  }`}>
                    {status.success ? (
                      <CheckCircle size={16} className="text-green-300 mt-0.5" />
                    ) : (
                      <AlertCircle size={16} className="text-red-300 mt-0.5" />
                    )}
                    <p className={`text-sm ${status.success ? 'text-green-200' : 'text-red-200'}`}>
                      {status.message}
                    </p>
                  </div>
                )}

                {/* Platform-specific features */}
                {connected && (
                  <div className="mt-4 pt-4 border-t border-white/10">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-white/70">Format:</span>
                        <span className="text-white ml-2">
                          {platform.id === 'instagram' ? '1:1 Square' : '9:16 Vertical'}
                        </span>
                      </div>
                      <div>
                        <span className="text-white/70">Status:</span>
                        <span className="text-green-300 ml-2">Ready to post</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Connection Instructions */}
      <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
        <h3 className="text-lg font-semibold text-white mb-4">Connection Instructions</h3>
        
        <div className="space-y-4 text-sm text-white/80">
          <div>
            <h4 className="text-white font-medium mb-2">For Instagram:</h4>
            <ul className="space-y-1 ml-4">
              <li>• Make sure you have a business or creator account</li>
              <li>• Your account must be connected to a Facebook page</li>
              <li>• You'll need to approve permissions for posting</li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-white font-medium mb-2">For TikTok:</h4>
            <ul className="space-y-1 ml-4">
              <li>• Use a TikTok business account for best results</li>
              <li>• Ensure your account allows third-party posting</li>
              <li>• Videos will be posted as public by default</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Test Account Setup */}
      <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
        <h3 className="text-lg font-semibold text-white mb-4">Test Account Recommendations</h3>
        
        <div className="bg-blue-500/20 border border-blue-400/30 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <AlertCircle size={20} className="text-blue-300 mt-0.5" />
            <div>
              <p className="text-blue-200 text-sm font-medium mb-2">
                Best Practices for Test Accounts
              </p>
              <ul className="text-blue-300/80 text-sm space-y-1">
                <li>• Create separate accounts specifically for ad testing</li>
                <li>• Use clear naming like "@brandname_test" or "@brandname_ads"</li>
                <li>• Keep test accounts private or limit audience</li>
                <li>• Monitor performance metrics separately from main accounts</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
