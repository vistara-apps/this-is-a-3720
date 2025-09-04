import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database operations for User entity
export const userService = {
  async createUser(userData) {
    const { data, error } = await supabase
      .from('users')
      .insert([userData])
      .select()
    
    if (error) throw error
    return data[0]
  },

  async getUserById(userId) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('userId', userId)
      .single()
    
    if (error) throw error
    return data
  },

  async updateUser(userId, updates) {
    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('userId', userId)
      .select()
    
    if (error) throw error
    return data[0]
  }
}

// Database operations for UploadedImage entity
export const imageService = {
  async uploadImage(userId, file, prompt = '') {
    // Upload file to Supabase Storage
    const fileName = `${userId}/${Date.now()}-${file.name}`
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('product-images')
      .upload(fileName, file)

    if (uploadError) throw uploadError

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('product-images')
      .getPublicUrl(fileName)

    // Save image metadata to database
    const imageData = {
      userId,
      imageUrl: publicUrl,
      uploadedAt: new Date().toISOString(),
      prompt
    }

    const { data, error } = await supabase
      .from('uploaded_images')
      .insert([imageData])
      .select()

    if (error) throw error
    return data[0]
  },

  async getUserImages(userId) {
    const { data, error } = await supabase
      .from('uploaded_images')
      .select('*')
      .eq('userId', userId)
      .order('uploadedAt', { ascending: false })

    if (error) throw error
    return data
  }
}

// Database operations for GeneratedAdVariation entity
export const variationService = {
  async saveVariations(variations) {
    const { data, error } = await supabase
      .from('generated_ad_variations')
      .insert(variations)
      .select()

    if (error) throw error
    return data
  },

  async getUserVariations(userId) {
    const { data, error } = await supabase
      .from('generated_ad_variations')
      .select('*')
      .eq('userId', userId)
      .order('createdAt', { ascending: false })

    if (error) throw error
    return data
  },

  async updatePostStatus(variationId, status) {
    const { data, error } = await supabase
      .from('generated_ad_variations')
      .update({ postStatus: status })
      .eq('variationId', variationId)
      .select()

    if (error) throw error
    return data[0]
  }
}

// Database operations for SocialAccount entity
export const socialAccountService = {
  async connectAccount(userId, platform, accountHandle, accessToken) {
    const accountData = {
      userId,
      platform,
      accountHandle,
      accessToken,
      connectedAt: new Date().toISOString()
    }

    const { data, error } = await supabase
      .from('social_accounts')
      .upsert([accountData])
      .select()

    if (error) throw error
    return data[0]
  },

  async getUserAccounts(userId) {
    const { data, error } = await supabase
      .from('social_accounts')
      .select('*')
      .eq('userId', userId)

    if (error) throw error
    return data
  },

  async disconnectAccount(userId, platform) {
    const { data, error } = await supabase
      .from('social_accounts')
      .delete()
      .eq('userId', userId)
      .eq('platform', platform)

    if (error) throw error
    return data
  }
}
