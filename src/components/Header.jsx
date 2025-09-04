import React from 'react'
import { Menu, Bell, User, Zap } from 'lucide-react'
import { useApp } from '../context/AppContext'

export default function Header({ onMenuClick }) {
  const { state } = useApp()

  return (
    <header className="bg-white/10 backdrop-blur-md border-b border-white/20 px-4 sm:px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button 
            onClick={onMenuClick}
            className="lg:hidden p-2 rounded-md text-white hover:bg-white/10"
          >
            <Menu size={20} />
          </button>
          <div className="hidden sm:block">
            <h1 className="text-xl font-bold text-white">AdSpin AI</h1>
          </div>
        </div>

        <div className="flex items-center space-x-2 sm:space-x-4">
          <div className="hidden sm:flex items-center space-x-2 bg-white/10 rounded-lg px-3 py-2">
            <Zap size={16} className="text-yellow-300" />
            <span className="text-white text-sm">
              {state.user.usage.generations}/{state.user.usage.limit}
            </span>
          </div>
          
          <button className="p-2 rounded-lg text-white hover:bg-white/10">
            <Bell size={20} />
          </button>
          
          <div className="flex items-center space-x-2 bg-white/10 rounded-lg px-3 py-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 flex items-center justify-center">
              <User size={16} className="text-white" />
            </div>
            <span className="hidden sm:block text-white text-sm font-medium">
              {state.user.email.split('@')[0]}
            </span>
          </div>
        </div>
      </div>
    </header>
  )
}