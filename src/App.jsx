import React, { useState } from 'react'
import Header from './components/Header'
import Sidebar from './components/Sidebar'
import MainContent from './components/MainContent'
import { AppProvider } from './context/AppContext'

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <AppProvider>
      <div className="min-h-screen gradient-bg">
        <div className="w-full max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row h-screen">
            <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
            <div className="flex-1 flex flex-col lg:ml-64">
              <Header onMenuClick={() => setSidebarOpen(true)} />
              <MainContent />
            </div>
          </div>
        </div>
      </div>
    </AppProvider>
  )
}

export default App