import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true // Note: In production, this should be handled server-side
})

export const imageGenerationService = {
  /**
   * Generate ad variations using OpenAI DALL-E
   * @param {Object} params - Generation parameters
   * @param {string} params.baseImageUrl - URL of the base product image
   * @param {string} params.style - Style preference (modern, vibrant, luxury, playful)
   * @param {string} params.platform - Target platform (instagram, tiktok, both)
   * @param {string} params.customPrompt - Optional custom prompt
   * @returns {Promise<Array>} Array of generated image URLs
   */
  async generateVariations({ baseImageUrl, style, platform, customPrompt = '' }) {
    try {
      const variations = []
      const platforms = platform === 'both' ? ['instagram', 'tiktok'] : [platform]
      
      for (const targetPlatform of platforms) {
        // Generate 2 variations per platform
        for (let i = 0; i < 2; i++) {
          const prompt = this.buildPrompt({
            style,
            platform: targetPlatform,
            customPrompt,
            variationIndex: i
          })

          const response = await openai.images.generate({
            model: "dall-e-3",
            prompt,
            n: 1,
            size: targetPlatform === 'instagram' ? '1024x1024' : '1024x1792',
            quality: 'standard',
            style: 'vivid'
          })

          if (response.data && response.data[0]) {
            variations.push({
              url: response.data[0].url,
              platform: targetPlatform,
              style,
              prompt,
              aspectRatio: targetPlatform === 'instagram' ? '1:1' : '9:16'
            })
          }
        }
      }

      return variations
    } catch (error) {
      console.error('OpenAI Image Generation Error:', error)
      throw new Error(`Failed to generate variations: ${error.message}`)
    }
  },

  /**
   * Build optimized prompt for ad generation
   * @param {Object} params - Prompt parameters
   * @returns {string} Optimized prompt
   */
  buildPrompt({ style, platform, customPrompt, variationIndex }) {
    const stylePrompts = {
      modern: 'clean, minimalist, contemporary design with sleek typography',
      vibrant: 'bold, energetic colors with dynamic composition and high contrast',
      luxury: 'premium, sophisticated, elegant with gold accents and refined aesthetics',
      playful: 'fun, colorful, engaging with creative elements and youthful energy'
    }

    const platformPrompts = {
      instagram: 'square format, Instagram-style layout, social media optimized',
      tiktok: 'vertical format, TikTok-style design, mobile-first, engaging for Gen Z'
    }

    const variationPrompts = [
      'with prominent product placement and clear call-to-action',
      'with lifestyle context and emotional appeal',
      'with bold text overlay and promotional elements',
      'with artistic background and premium presentation'
    ]

    const basePrompt = `Create a professional advertising image featuring a product in ${stylePrompts[style]} style. `
    const platformContext = `Designed for ${platformPrompts[platform]}. `
    const variationContext = variationPrompts[variationIndex] || variationPrompts[0]
    const customContext = customPrompt ? ` Additional requirements: ${customPrompt}.` : ''

    return `${basePrompt}${platformContext}${variationContext}${customContext} High quality, professional advertising photography.`
  },

  /**
   * Generate ad copy using GPT
   * @param {Object} params - Copy generation parameters
   * @returns {Promise<string>} Generated ad copy
   */
  async generateAdCopy({ platform, style, productDescription, targetAudience = 'general' }) {
    try {
      const prompt = `Generate engaging ad copy for a ${platform} advertisement. 
      Style: ${style}
      Product: ${productDescription}
      Target Audience: ${targetAudience}
      
      Requirements:
      - ${platform === 'instagram' ? 'Instagram-appropriate with hashtags' : 'TikTok-style, trendy and engaging'}
      - Include call-to-action
      - Keep it concise and impactful
      - Match the ${style} style
      
      Generate only the ad copy text:`

      const response = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 150,
        temperature: 0.7
      })

      return response.choices[0]?.message?.content?.trim() || ''
    } catch (error) {
      console.error('OpenAI Copy Generation Error:', error)
      throw new Error(`Failed to generate ad copy: ${error.message}`)
    }
  }
}

export default imageGenerationService
