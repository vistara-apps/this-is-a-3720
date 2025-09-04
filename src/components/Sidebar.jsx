import React from 'react'
import { 
  X, 
  Upload, 
  Sparkles, 
  Share, 
  Settings, 
  CreditCard,
  Home,
  BarChart3
} from 'lucide-react'
import { useApp } from '../context/AppContext'

export default function Sidebar({ isOpen, onClose }) {
  const { state, dispatch } = useApp()

  const navigation = [
    { name: 'Dashboard', icon: Home, current: true },
    { name: 'Generate Ads', icon: Sparkles, current: false },
    { name: 'Analytics', icon: BarChart3, current: false },
    { name: 'Social Accounts', icon: Share, current: false },
    { name: 'Settings', icon: Settings, current: false },
    { name: 'Billing', icon: CreditCard, current: false },
  ]

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed lg:static inset-y-0 left-0 z-50 w-64 
        bg-white/10 backdrop-blur-md border-r border-white/20
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="flex items-center justify-between p-6">
          <h2 className="text-2xl font-bold text-white">AdSpin AI</h2>
          <button 
            onClick={onClose}
            className="lg:hidden p-2 rounded-md text-white hover:bg-white/10"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="px-4 space-y-2">
          {navigation.map((item) => (
            <a
              key={item.name}
              href="#"
              className={`
                flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium
                transition-colors duration-200
                ${item.current 
                  ? 'bg-white/20 text-white' 
                  : 'text-white/70 hover:text-white hover:bg-white/10'
                }
              `}
            >
              <item.icon size={20} />
              <span>{item.name}</span>
            </a>
          ))}
        </nav>

        <div className="absolute bottom-6 left-4 right-4">
          <div className="bg-white/10 rounded-lg p-4">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 flex items-center justify-center">
                <Upload size={20} className="text-white" />
              </div>
              <div>
                <div className="text-white font-medium text-sm">Quick Upload</div>
                <div className="text-white/70 text-xs">Drag & drop images</div>
              </div>
            </div>
            <button 
              onClick={() => dispatch({ type: 'SET_CURRENT_STEP', payload: 'upload' })}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-2 px-4 rounded-lg text-sm font-medium hover:shadow-lg transition-all duration-200"
            >
              Start Creating
            </button>
          </div>
        </div>
      </div>
    </>
  )
}