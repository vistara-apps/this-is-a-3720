import React from 'react'
import { useApp } from '../context/AppContext'
import UploadArea from './UploadArea'
import GenerationPanel from './GenerationPanel'
import PreviewPanel from './PreviewPanel'
import StatsCards from './StatsCards'

export default function MainContent() {
  const { state } = useApp()

  return (
    <main className="flex-1 overflow-auto p-4 sm:p-6">
      <div className="mb-6">
        <StatsCards />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <UploadArea />
          {state.uploadedImage && <GenerationPanel />}
        </div>
        
        <div>
          <PreviewPanel />
        </div>
      </div>
    </main>
  )
}