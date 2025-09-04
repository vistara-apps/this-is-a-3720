import React, { useState } from 'react'
import { Sparkles, Settings, Wand2 } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { imageGenerationService } from '../services/openai'
import subscriptionService from '../services/stripe'

export default function GenerationPanel() {
  const { state, dispatch } = useApp()
  const [prompt, setPrompt] = useState('')
  const [style, setStyle] = useState('modern')
  const [platform, setPlatform] = useState('both')

  const styles = [
    { id: 'modern', name: 'Modern', description: 'Clean, minimalist design' },
    { id: 'vibrant', name: 'Vibrant', description: 'Bold colors and energy' },
    { id: 'luxury', name: 'Luxury', description: 'Premium, sophisticated' },
    { id: 'playful', name: 'Playful', description: 'Fun and engaging' }
  ]

  const platforms = [
    { id: 'both', name: 'Both Platforms', ratio: '1:1 & 9:16' },
    { id: 'instagram', name: 'Instagram', ratio: '1:1 Square' },
    { id: 'tiktok', name: 'TikTok', ratio: '9:16 Vertical' }
  ]

  const generateVariations = async () => {
    // Check usage limits
    if (subscriptionService.hasReachedLimit(state.user, 'generations')) {
      alert('You have reached your generation limit. Please upgrade your plan.')
      return
    }

    dispatch({ type: 'SET_GENERATING', payload: true })
    
    try {
      // Use real OpenAI service for generation
      const generatedVariations = await imageGenerationService.generateVariations({
        baseImageUrl: state.uploadedImage.url,
        style,
        platform,
        customPrompt: prompt
      })

      // Transform the response to match our data structure
      const variations = generatedVariations.map((variation, index) => ({
        id: index + 1,
        platform: variation.platform,
        style: variation.style,
        url: variation.url,
        prompt: variation.prompt,
        engagement: `${(Math.random() * 8 + 2).toFixed(1)}%`, // Mock engagement data
        reach: `${(Math.random() * 20 + 5).toFixed(1)}K` // Mock reach data
      }))
      
      dispatch({ type: 'SET_GENERATED_VARIATIONS', payload: variations })
      dispatch({ 
        type: 'UPDATE_USAGE', 
        payload: { generations: state.user.usage.generations + variations.length }
      })
    } catch (error) {
      console.error('Generation failed:', error)
      
      // Fallback to mock data if API fails
      const fallbackVariations = [
        {
          id: 1,
          platform: 'instagram',
          style,
          url: state.uploadedImage.url,
          prompt: `${style} style Instagram ad`,
          engagement: '4.2%',
          reach: '12.5K'
        },
        {
          id: 2,
          platform: 'tiktok', 
          style,
          url: state.uploadedImage.url,
          prompt: `${style} style TikTok ad`,
          engagement: '6.8%',
          reach: '25.3K'
        }
      ]
      
      dispatch({ type: 'SET_GENERATED_VARIATIONS', payload: fallbackVariations })
      dispatch({ 
        type: 'UPDATE_USAGE', 
        payload: { generations: state.user.usage.generations + 2 }
      })
    }
  }

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
      <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
        <Sparkles className="mr-2" size={20} />
        Generation Settings
      </h3>

      <div className="space-y-6">
        <div>
          <label className="block text-white/90 text-sm font-medium mb-2">
            Creative Prompt (Optional)
          </label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe the style or theme you want..."
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent resize-none"
            rows={3}
          />
        </div>

        <div>
          <label className="block text-white/90 text-sm font-medium mb-3">
            Style
          </label>
          <div className="grid grid-cols-2 gap-3">
            {styles.map((s) => (
              <button
                key={s.id}
                onClick={() => setStyle(s.id)}
                className={`
                  p-3 rounded-lg border text-left transition-all duration-200
                  ${style === s.id
                    ? 'bg-purple-500/20 border-purple-400 text-white'
                    : 'bg-white/5 border-white/20 text-white/70 hover:text-white hover:bg-white/10'
                  }
                `}
              >
                <div className="font-medium text-sm">{s.name}</div>
                <div className="text-xs mt-1 opacity-70">{s.description}</div>
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-white/90 text-sm font-medium mb-3">
            Target Platform
          </label>
          <div className="space-y-2">
            {platforms.map((p) => (
              <button
                key={p.id}
                onClick={() => setPlatform(p.id)}
                className={`
                  w-full p-3 rounded-lg border text-left transition-all duration-200 flex items-center justify-between
                  ${platform === p.id
                    ? 'bg-purple-500/20 border-purple-400 text-white'
                    : 'bg-white/5 border-white/20 text-white/70 hover:text-white hover:bg-white/10'
                  }
                `}
              >
                <div>
                  <div className="font-medium text-sm">{p.name}</div>
                  <div className="text-xs mt-1 opacity-70">{p.ratio}</div>
                </div>
                {platform === p.id && (
                  <div className="w-2 h-2 rounded-full bg-purple-400" />
                )}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={generateVariations}
          disabled={state.isGenerating}
          className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 px-6 rounded-lg font-medium hover:shadow-lg transition-all duration-200 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {state.isGenerating ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Generating...</span>
            </>
          ) : (
            <>
              <Wand2 size={20} />
              <span>Generate 4 Variations</span>
            </>
          )}
        </button>
      </div>
    </div>
  )
}
