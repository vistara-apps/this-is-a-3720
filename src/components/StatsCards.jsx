import React from 'react'
import { TrendingUp, Zap, Share, Target } from 'lucide-react'
import { useApp } from '../context/AppContext'

export default function StatsCards() {
  const { state } = useApp()

  const stats = [
    {
      name: 'Generated Today',
      value: '12',
      change: '+2.5%',
      icon: Zap,
      color: 'from-blue-500 to-cyan-500'
    },
    {
      name: 'Posts Published',
      value: '8',
      change: '+5.2%', 
      icon: Share,
      color: 'from-green-500 to-emerald-500'
    },
    {
      name: 'Avg. Engagement',
      value: '4.2%',
      change: '+1.8%',
      icon: TrendingUp,
      color: 'from-purple-500 to-pink-500'
    },
    {
      name: 'Best Performer',
      value: '12.5%',
      change: '+8.1%',
      icon: Target,
      color: 'from-orange-500 to-red-500'
    }
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <div key={stat.name} className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 card-hover">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/70 text-sm font-medium">{stat.name}</p>
              <p className="text-2xl font-bold text-white mt-1">{stat.value}</p>
              <p className="text-green-300 text-sm mt-1">{stat.change}</p>
            </div>
            <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${stat.color} flex items-center justify-center`}>
              <stat.icon size={24} className="text-white" />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}