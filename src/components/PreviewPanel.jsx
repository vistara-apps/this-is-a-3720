import React, { useState } from 'react'
import { Eye, Share, Download, TrendingUp, Instagram, Music } from 'lucide-react'
import { useApp } from '../context/AppContext'
import SocialPostModal from './SocialPostModal'

export default function PreviewPanel() {
  const { state } = useApp()
  const [selectedVariation, setSelectedVariation] = useState(null)
  const [showPostModal, setShowPostModal] = useState(false)

  if (!state.generatedVariations.length) {
    return (
      <div className="bg-white/10 backdrop-blur-md rounded-xl p-8 border border-white/20 h-96 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto rounded-full bg-white/10 flex items-center justify-center mb-4">
            <Eye size={24} className="text-white/50" />
          </div>
          <h3 className="text-white font-medium mb-2">No Variations Yet</h3>
          <p className="text-white/70 text-sm">
            Upload an image and generate variations to see them here
          </p>
        </div>
      </div>
    )
  }

  const getPlatformIcon = (platform) => {
    return platform === 'instagram' ? Instagram : Music
  }

  const getPlatformColor = (platform) => {
    return platform === 'instagram' ? 'from-pink-500 to-orange-500' : 'from-black to-gray-700'
  }

  return (
    <>
      <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
          <Eye className="mr-2" size={20} />
          Generated Variations
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {state.generatedVariations.map((variation) => {
            const PlatformIcon = getPlatformIcon(variation.platform)
            
            return (
              <div key={variation.id} className="bg-white/5 rounded-lg overflow-hidden card-hover">
                <div className="aspect-square relative">
                  <img
                    src={variation.url}
                    alt={variation.prompt}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 left-3">
                    <div className={`w-8 h-8 rounded-full bg-gradient-to-r ${getPlatformColor(variation.platform)} flex items-center justify-center`}>
                      <PlatformIcon size={16} className="text-white" />
                    </div>
                  </div>
                  <div className="absolute top-3 right-3 bg-black/50 rounded-lg px-2 py-1">
                    <span className="text-white text-xs font-medium">
                      {variation.platform === 'instagram' ? '1:1' : '9:16'}
                    </span>
                  </div>
                </div>
                
                <div className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-white/70 text-sm capitalize">
                      {variation.platform} • {variation.style}
                    </span>
                    <div className="flex items-center space-x-1 text-green-300 text-xs">
                      <TrendingUp size={12} />
                      <span>{variation.engagement}</span>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <button
                      onClick={() => {
                        setSelectedVariation(variation)
                        setShowPostModal(true)
                      }}
                      className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white py-2 px-3 rounded-lg text-sm font-medium hover:shadow-lg transition-all duration-200"
                    >
                      Post
                    </button>
                    <button className="px-3 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors">
                      <Download size={16} />
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {state.generatedVariations.length > 0 && (
          <div className="mt-6 p-4 bg-white/5 rounded-lg">
            <div className="flex items-center justify-between text-sm">
              <span className="text-white/70">Generation Stats</span>
              <span className="text-green-300">All variations ready</span>
            </div>
            <div className="mt-2 grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-white font-medium">{state.generatedVariations.length}</div>
                <div className="text-white/60 text-xs">Variations</div>
              </div>
              <div>
                <div className="text-white font-medium">2</div>
                <div className="text-white/60 text-xs">Platforms</div>
              </div>
              <div>
                <div className="text-white font-medium">~3s</div>
                <div className="text-white/60 text-xs">Generation Time</div>
              </div>
            </div>
          </div>
        )}
      </div>

      {showPostModal && (
        <SocialPostModal
          variation={selectedVariation}
          onClose={() => setShowPostModal(false)}
        />
      )}
    </>
  )
}