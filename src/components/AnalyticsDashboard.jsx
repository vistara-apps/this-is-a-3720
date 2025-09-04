import React, { useState } from 'react'
import { BarChart3, TrendingUp, Eye, Heart, Share, Calendar, Filter, Download } from 'lucide-react'
import { useApp } from '../context/AppContext'

export default function AnalyticsDashboard() {
  const { state } = useApp()
  const [timeRange, setTimeRange] = useState('7d')
  const [selectedPlatform, setSelectedPlatform] = useState('all')

  // Mock analytics data
  const analyticsData = {
    overview: {
      totalGenerations: 156,
      totalPosts: 42,
      avgEngagement: 4.2,
      bestPerformer: 12.5,
      totalReach: 125000,
      totalImpressions: 450000
    },
    platformBreakdown: {
      instagram: {
        posts: 24,
        engagement: 3.8,
        reach: 75000,
        impressions: 280000
      },
      tiktok: {
        posts: 18,
        engagement: 4.7,
        reach: 50000,
        impressions: 170000
      }
    },
    topPerformers: [
      {
        id: 1,
        platform: 'tiktok',
        style: 'vibrant',
        engagement: 12.5,
        reach: 25300,
        impressions: 85000,
        date: '2024-12-01'
      },
      {
        id: 2,
        platform: 'instagram',
        style: 'luxury',
        engagement: 8.9,
        reach: 18700,
        impressions: 62000,
        date: '2024-11-28'
      },
      {
        id: 3,
        platform: 'instagram',
        style: 'modern',
        engagement: 7.2,
        reach: 15200,
        impressions: 48000,
        date: '2024-11-25'
      }
    ],
    engagementTrend: [
      { date: '2024-11-25', instagram: 3.2, tiktok: 4.1 },
      { date: '2024-11-26', instagram: 3.8, tiktok: 4.5 },
      { date: '2024-11-27', instagram: 4.1, tiktok: 5.2 },
      { date: '2024-11-28', instagram: 4.5, tiktok: 4.8 },
      { date: '2024-11-29', instagram: 3.9, tiktok: 5.1 },
      { date: '2024-11-30', instagram: 4.2, tiktok: 4.9 },
      { date: '2024-12-01', instagram: 4.0, tiktok: 5.3 }
    ]
  }

  const timeRanges = [
    { value: '7d', label: 'Last 7 days' },
    { value: '30d', label: 'Last 30 days' },
    { value: '90d', label: 'Last 90 days' }
  ]

  const platforms = [
    { value: 'all', label: 'All Platforms' },
    { value: 'instagram', label: 'Instagram' },
    { value: 'tiktok', label: 'TikTok' }
  ]

  const formatNumber = (num) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M'
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K'
    return num.toString()
  }

  const getPlatformIcon = (platform) => {
    return platform === 'instagram' ? '📷' : '🎵'
  }

  const getPlatformColor = (platform) => {
    return platform === 'instagram' 
      ? 'from-pink-500 to-orange-500' 
      : 'from-black to-gray-700'
  }

  return (
    <div className="space-y-6">
      {/* Header with Filters */}
      <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-white flex items-center">
              <BarChart3 className="mr-3" size={28} />
              Analytics Dashboard
            </h2>
            <p className="text-white/70 text-sm mt-1">
              Track performance of your generated ad variations
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
            >
              {timeRanges.map(range => (
                <option key={range.value} value={range.value} className="bg-gray-800">
                  {range.label}
                </option>
              ))}
            </select>

            <select
              value={selectedPlatform}
              onChange={(e) => setSelectedPlatform(e.target.value)}
              className="px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
            >
              {platforms.map(platform => (
                <option key={platform.value} value={platform.value} className="bg-gray-800">
                  {platform.label}
                </option>
              ))}
            </select>

            <button className="p-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors">
              <Download size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/70 text-sm font-medium">Total Generations</p>
              <p className="text-2xl font-bold text-white mt-1">{analyticsData.overview.totalGenerations}</p>
              <p className="text-green-300 text-sm mt-1">+12% vs last period</p>
            </div>
            <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center">
              <BarChart3 size={24} className="text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/70 text-sm font-medium">Posts Published</p>
              <p className="text-2xl font-bold text-white mt-1">{analyticsData.overview.totalPosts}</p>
              <p className="text-green-300 text-sm mt-1">+8% vs last period</p>
            </div>
            <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center">
              <Share size={24} className="text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/70 text-sm font-medium">Avg Engagement</p>
              <p className="text-2xl font-bold text-white mt-1">{analyticsData.overview.avgEngagement}%</p>
              <p className="text-green-300 text-sm mt-1">+0.3% vs last period</p>
            </div>
            <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
              <Heart size={24} className="text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/70 text-sm font-medium">Total Reach</p>
              <p className="text-2xl font-bold text-white mt-1">{formatNumber(analyticsData.overview.totalReach)}</p>
              <p className="text-green-300 text-sm mt-1">+15% vs last period</p>
            </div>
            <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-orange-500 to-red-500 flex items-center justify-center">
              <Eye size={24} className="text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Platform Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
          <h3 className="text-lg font-semibold text-white mb-4">Platform Performance</h3>
          
          <div className="space-y-4">
            {Object.entries(analyticsData.platformBreakdown).map(([platform, data]) => (
              <div key={platform} className="bg-white/5 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{getPlatformIcon(platform)}</span>
                    <div>
                      <h4 className="text-white font-medium capitalize">{platform}</h4>
                      <p className="text-white/70 text-sm">{data.posts} posts</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-white font-medium">{data.engagement}%</p>
                    <p className="text-white/70 text-sm">engagement</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-white/70">Reach:</span>
                    <span className="text-white ml-2">{formatNumber(data.reach)}</span>
                  </div>
                  <div>
                    <span className="text-white/70">Impressions:</span>
                    <span className="text-white ml-2">{formatNumber(data.impressions)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Engagement Trend Chart */}
        <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
          <h3 className="text-lg font-semibold text-white mb-4">Engagement Trend</h3>
          
          <div className="space-y-4">
            {analyticsData.engagementTrend.map((day, index) => (
              <div key={day.date} className="flex items-center space-x-4">
                <div className="w-16 text-white/70 text-xs">
                  {new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </div>
                
                <div className="flex-1 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-white/80 text-sm">Instagram</span>
                    <span className="text-white text-sm">{day.instagram}%</span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-pink-500 to-orange-500 h-2 rounded-full"
                      style={{ width: `${(day.instagram / 6) * 100}%` }}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-white/80 text-sm">TikTok</span>
                    <span className="text-white text-sm">{day.tiktok}%</span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-black to-gray-600 h-2 rounded-full"
                      style={{ width: `${(day.tiktok / 6) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Performers */}
      <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
          <TrendingUp className="mr-2" size={20} />
          Top Performing Ads
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left text-white/70 text-sm font-medium py-3">Platform</th>
                <th className="text-left text-white/70 text-sm font-medium py-3">Style</th>
                <th className="text-left text-white/70 text-sm font-medium py-3">Engagement</th>
                <th className="text-left text-white/70 text-sm font-medium py-3">Reach</th>
                <th className="text-left text-white/70 text-sm font-medium py-3">Impressions</th>
                <th className="text-left text-white/70 text-sm font-medium py-3">Date</th>
              </tr>
            </thead>
            <tbody>
              {analyticsData.topPerformers.map((ad, index) => (
                <tr key={ad.id} className="border-b border-white/5">
                  <td className="py-4">
                    <div className="flex items-center space-x-2">
                      <span className="text-lg">{getPlatformIcon(ad.platform)}</span>
                      <span className="text-white capitalize">{ad.platform}</span>
                    </div>
                  </td>
                  <td className="py-4">
                    <span className="text-white/80 capitalize">{ad.style}</span>
                  </td>
                  <td className="py-4">
                    <div className="flex items-center space-x-2">
                      <span className="text-white font-medium">{ad.engagement}%</span>
                      {index === 0 && <span className="text-xs bg-green-500/20 text-green-300 px-2 py-1 rounded">Best</span>}
                    </div>
                  </td>
                  <td className="py-4">
                    <span className="text-white/80">{formatNumber(ad.reach)}</span>
                  </td>
                  <td className="py-4">
                    <span className="text-white/80">{formatNumber(ad.impressions)}</span>
                  </td>
                  <td className="py-4">
                    <span className="text-white/70 text-sm">
                      {new Date(ad.date).toLocaleDateString()}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
