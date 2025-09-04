import { supabase } from './supabase'

export const authService = {
  /**
   * Sign up a new user
   * @param {string} email - User email
   * @param {string} password - User password
   * @returns {Promise<Object>} User data
   */
  async signUp(email, password) {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`
        }
      })

      if (error) throw error

      // Create user profile in our users table
      if (data.user) {
        await this.createUserProfile(data.user.id, email)
      }

      return {
        user: data.user,
        session: data.session,
        needsEmailConfirmation: !data.session
      }
    } catch (error) {
      console.error('Sign up error:', error)
      throw new Error(error.message)
    }
  },

  /**
   * Sign in an existing user
   * @param {string} email - User email
   * @param {string} password - User password
   * @returns {Promise<Object>} User data and session
   */
  async signIn(email, password) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (error) throw error

      return {
        user: data.user,
        session: data.session
      }
    } catch (error) {
      console.error('Sign in error:', error)
      throw new Error(error.message)
    }
  },

  /**
   * Sign out the current user
   * @returns {Promise<void>}
   */
  async signOut() {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
    } catch (error) {
      console.error('Sign out error:', error)
      throw new Error(error.message)
    }
  },

  /**
   * Get the current user session
   * @returns {Promise<Object|null>} Current session or null
   */
  async getCurrentSession() {
    try {
      const { data: { session }, error } = await supabase.auth.getSession()
      if (error) throw error
      return session
    } catch (error) {
      console.error('Get session error:', error)
      return null
    }
  },

  /**
   * Get the current user
   * @returns {Promise<Object|null>} Current user or null
   */
  async getCurrentUser() {
    try {
      const { data: { user }, error } = await supabase.auth.getUser()
      if (error) throw error
      return user
    } catch (error) {
      console.error('Get user error:', error)
      return null
    }
  },

  /**
   * Reset password
   * @param {string} email - User email
   * @returns {Promise<void>}
   */
  async resetPassword(email) {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`
      })

      if (error) throw error
    } catch (error) {
      console.error('Reset password error:', error)
      throw new Error(error.message)
    }
  },

  /**
   * Update password
   * @param {string} newPassword - New password
   * @returns {Promise<void>}
   */
  async updatePassword(newPassword) {
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      })

      if (error) throw error
    } catch (error) {
      console.error('Update password error:', error)
      throw new Error(error.message)
    }
  },

  /**
   * Create user profile in our database
   * @param {string} userId - Supabase user ID
   * @param {string} email - User email
   * @returns {Promise<Object>} Created user profile
   */
  async createUserProfile(userId, email) {
    try {
      const userData = {
        userId,
        email,
        createdAt: new Date().toISOString(),
        subscriptionTier: 'basic',
        usage: {
          generations: 0,
          posts: 0,
          limit: 100
        }
      }

      const { data, error } = await supabase
        .from('users')
        .insert([userData])
        .select()

      if (error) throw error
      return data[0]
    } catch (error) {
      console.error('Create user profile error:', error)
      throw error
    }
  },

  /**
   * Get user profile from our database
   * @param {string} userId - User ID
   * @returns {Promise<Object|null>} User profile or null
   */
  async getUserProfile(userId) {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('userId', userId)
        .single()

      if (error) {
        if (error.code === 'PGRST116') {
          // User profile doesn't exist, create it
          const user = await this.getCurrentUser()
          if (user) {
            return await this.createUserProfile(userId, user.email)
          }
        }
        throw error
      }

      return data
    } catch (error) {
      console.error('Get user profile error:', error)
      return null
    }
  },

  /**
   * Update user profile
   * @param {string} userId - User ID
   * @param {Object} updates - Profile updates
   * @returns {Promise<Object>} Updated profile
   */
  async updateUserProfile(userId, updates) {
    try {
      const { data, error } = await supabase
        .from('users')
        .update(updates)
        .eq('userId', userId)
        .select()

      if (error) throw error
      return data[0]
    } catch (error) {
      console.error('Update user profile error:', error)
      throw error
    }
  },

  /**
   * Listen to auth state changes
   * @param {Function} callback - Callback function to handle auth changes
   * @returns {Function} Unsubscribe function
   */
  onAuthStateChange(callback) {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        let userProfile = null
        
        if (session?.user) {
          userProfile = await this.getUserProfile(session.user.id)
        }

        callback(event, session, userProfile)
      }
    )

    return () => subscription.unsubscribe()
  }
}

export default authService
