import React, { createContext, useContext, useReducer } from 'react'

const AppContext = createContext()

const initialState = {
  user: {
    email: 'demo@example.com',
    subscriptionTier: 'basic',
    usage: {
      generations: 15,
      posts: 3,
      limit: 100
    }
  },
  uploadedImage: null,
  generatedVariations: [],
  isGenerating: false,
  connectedAccounts: [
    { platform: 'tiktok', handle: '@testaccount', connected: true },
    { platform: 'instagram', handle: '@test_ads', connected: false }
  ],
  currentStep: 'upload' // upload, generate, preview, post
}

function appReducer(state, action) {
  switch (action.type) {
    case 'SET_UPLOADED_IMAGE':
      return { ...state, uploadedImage: action.payload, currentStep: 'generate' }
    case 'SET_GENERATING':
      return { ...state, isGenerating: action.payload }
    case 'SET_GENERATED_VARIATIONS':
      return { 
        ...state, 
        generatedVariations: action.payload, 
        isGenerating: false,
        currentStep: 'preview' 
      }
    case 'SET_CURRENT_STEP':
      return { ...state, currentStep: action.payload }
    case 'CONNECT_ACCOUNT':
      return {
        ...state,
        connectedAccounts: state.connectedAccounts.map(acc =>
          acc.platform === action.payload ? { ...acc, connected: true } : acc
        )
      }
    case 'UPDATE_USAGE':
      return {
        ...state,
        user: {
          ...state.user,
          usage: { ...state.user.usage, ...action.payload }
        }
      }
    case 'RESET_WORKFLOW':
      return {
        ...state,
        uploadedImage: null,
        generatedVariations: [],
        currentStep: 'upload'
      }
    default:
      return state
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState)

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error('useApp must be used within AppProvider')
  }
  return context
}