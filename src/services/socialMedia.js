// Social Media Integration Service
// Handles posting to Instagram and TikTok APIs

export const socialMediaService = {
  /**
   * Post content to Instagram using Instagram Graph API
   * @param {Object} params - Post parameters
   * @param {string} params.accessToken - Instagram access token
   * @param {string} params.imageUrl - URL of the image to post
   * @param {string} params.caption - Post caption
   * @param {string} params.accountId - Instagram account ID
   * @returns {Promise<Object>} Post result
   */
  async postToInstagram({ accessToken, imageUrl, caption, accountId }) {
    try {
      // Step 1: Create media object
      const mediaResponse = await fetch(
        `https://graph.facebook.com/v18.0/${accountId}/media`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            image_url: imageUrl,
            caption: caption,
            access_token: accessToken,
          }),
        }
      )

      const mediaData = await mediaResponse.json()

      if (mediaData.error) {
        throw new Error(mediaData.error.message)
      }

      // Step 2: Publish the media
      const publishResponse = await fetch(
        `https://graph.facebook.com/v18.0/${accountId}/media_publish`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            creation_id: mediaData.id,
            access_token: accessToken,
          }),
        }
      )

      const publishData = await publishResponse.json()

      if (publishData.error) {
        throw new Error(publishData.error.message)
      }

      return {
        success: true,
        postId: publishData.id,
        platform: 'instagram',
        message: 'Successfully posted to Instagram'
      }
    } catch (error) {
      console.error('Instagram Post Error:', error)
      return {
        success: false,
        error: error.message,
        platform: 'instagram'
      }
    }
  },

  /**
   * Post content to TikTok using TikTok API
   * @param {Object} params - Post parameters
   * @param {string} params.accessToken - TikTok access token
   * @param {string} params.videoUrl - URL of the video to post
   * @param {string} params.caption - Post caption
   * @param {string} params.accountId - TikTok account ID
   * @returns {Promise<Object>} Post result
   */
  async postToTikTok({ accessToken, videoUrl, caption, accountId }) {
    try {
      // Note: TikTok API requires video content, not images
      // For demo purposes, we'll simulate the API call
      
      const response = await fetch('https://open-api.tiktok.com/share/video/upload/', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          video_url: videoUrl,
          text: caption,
          privacy_level: 'MUTUAL_FOLLOW_FRIENDS', // Test account setting
          disable_duet: false,
          disable_comment: false,
          disable_stitch: false,
        }),
      })

      const data = await response.json()

      if (data.error) {
        throw new Error(data.error.message)
      }

      return {
        success: true,
        postId: data.data?.share_id || 'demo_post_id',
        platform: 'tiktok',
        message: 'Successfully posted to TikTok'
      }
    } catch (error) {
      console.error('TikTok Post Error:', error)
      return {
        success: false,
        error: error.message,
        platform: 'tiktok'
      }
    }
  },

  /**
   * Simulate posting for demo purposes
   * @param {Object} params - Post parameters
   * @returns {Promise<Object>} Simulated post result
   */
  async simulatePost({ platform, imageUrl, caption, accountHandle }) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 2000))

    // Simulate random success/failure for demo
    const success = Math.random() > 0.1 // 90% success rate

    if (success) {
      return {
        success: true,
        postId: `demo_${platform}_${Date.now()}`,
        platform,
        message: `Successfully posted to ${platform} account ${accountHandle}`,
        url: `https://${platform}.com/p/demo_post_${Date.now()}`
      }
    } else {
      return {
        success: false,
        error: 'Simulated API error for demo purposes',
        platform
      }
    }
  },

  /**
   * Get Instagram account information
   * @param {string} accessToken - Instagram access token
   * @returns {Promise<Object>} Account information
   */
  async getInstagramAccountInfo(accessToken) {
    try {
      const response = await fetch(
        `https://graph.facebook.com/v18.0/me?fields=id,username&access_token=${accessToken}`
      )

      const data = await response.json()

      if (data.error) {
        throw new Error(data.error.message)
      }

      return {
        id: data.id,
        username: data.username,
        platform: 'instagram'
      }
    } catch (error) {
      console.error('Instagram Account Info Error:', error)
      throw error
    }
  },

  /**
   * Get TikTok account information
   * @param {string} accessToken - TikTok access token
   * @returns {Promise<Object>} Account information
   */
  async getTikTokAccountInfo(accessToken) {
    try {
      const response = await fetch(
        'https://open-api.tiktok.com/user/info/',
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          },
        }
      )

      const data = await response.json()

      if (data.error) {
        throw new Error(data.error.message)
      }

      return {
        id: data.data?.user?.open_id,
        username: data.data?.user?.display_name,
        platform: 'tiktok'
      }
    } catch (error) {
      console.error('TikTok Account Info Error:', error)
      throw error
    }
  },

  /**
   * Initiate OAuth flow for social media platform
   * @param {string} platform - Platform to connect ('instagram' or 'tiktok')
   * @returns {string} OAuth URL
   */
  getOAuthUrl(platform) {
    const baseUrls = {
      instagram: 'https://api.instagram.com/oauth/authorize',
      tiktok: 'https://www.tiktok.com/auth/authorize/'
    }

    const clientIds = {
      instagram: import.meta.env.VITE_INSTAGRAM_CLIENT_ID,
      tiktok: import.meta.env.VITE_TIKTOK_CLIENT_ID
    }

    const scopes = {
      instagram: 'user_profile,user_media',
      tiktok: 'user.info.basic,video.upload'
    }

    const redirectUri = `${window.location.origin}/auth/callback/${platform}`

    const params = new URLSearchParams({
      client_id: clientIds[platform],
      redirect_uri: redirectUri,
      scope: scopes[platform],
      response_type: 'code',
      state: `${platform}_${Date.now()}` // CSRF protection
    })

    return `${baseUrls[platform]}?${params.toString()}`
  },

  /**
   * Exchange authorization code for access token
   * @param {string} platform - Platform ('instagram' or 'tiktok')
   * @param {string} code - Authorization code from OAuth callback
   * @returns {Promise<Object>} Token response
   */
  async exchangeCodeForToken(platform, code) {
    try {
      const response = await fetch('/api/oauth/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          platform,
          code,
          redirect_uri: `${window.location.origin}/auth/callback/${platform}`
        }),
      })

      const data = await response.json()

      if (data.error) {
        throw new Error(data.error)
      }

      return data
    } catch (error) {
      console.error('Token Exchange Error:', error)
      throw error
    }
  }
}

export default socialMediaService
