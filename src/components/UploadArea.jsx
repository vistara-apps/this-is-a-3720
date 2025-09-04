import React, { useState, useRef } from 'react'
import { Upload, Image, X } from 'lucide-react'
import { useApp } from '../context/AppContext'

export default function UploadArea() {
  const { state, dispatch } = useApp()
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef(null)

  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    const files = e.dataTransfer.files
    if (files && files[0]) {
      handleFile(files[0])
    }
  }

  const handleFileInput = (e) => {
    const files = e.target.files
    if (files && files[0]) {
      handleFile(files[0])
    }
  }

  const handleFile = (file) => {
    if (file.type.startsWith('image/')) {
      const reader = new FileReader()
      reader.onload = (e) => {
        dispatch({
          type: 'SET_UPLOADED_IMAGE',
          payload: {
            file,
            url: e.target.result,
            name: file.name
          }
        })
      }
      reader.readAsDataURL(file)
    }
  }

  const removeImage = () => {
    dispatch({ type: 'RESET_WORKFLOW' })
  }

  if (state.uploadedImage) {
    return (
      <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white flex items-center">
            <Image className="mr-2" size={20} />
            Product Image
          </h3>
          <button
            onClick={removeImage}
            className="p-2 rounded-lg text-white/70 hover:text-white hover:bg-white/10"
          >
            <X size={16} />
          </button>
        </div>
        
        <div className="relative aspect-square rounded-lg overflow-hidden bg-white/5">
          <img
            src={state.uploadedImage.url}
            alt={state.uploadedImage.name}
            className="w-full h-full object-cover"
          />
        </div>
        
        <div className="mt-4 p-3 bg-white/5 rounded-lg">
          <p className="text-white/70 text-sm">{state.uploadedImage.name}</p>
          <p className="text-green-300 text-xs mt-1">✓ Ready for generation</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
      <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
        <Upload className="mr-2" size={20} />
        Upload Product Image
      </h3>
      
      <div
        className={`
          relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200
          ${dragActive 
            ? 'border-purple-400 bg-purple-500/10' 
            : 'border-white/30 hover:border-white/50'
          }
        `}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileInput}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        
        <div className="space-y-4">
          <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
            <Upload size={24} className="text-white" />
          </div>
          
          <div>
            <p className="text-white font-medium">
              Drop your product image here
            </p>
            <p className="text-white/70 text-sm mt-1">
              or click to browse files
            </p>
          </div>
          
          <div className="flex flex-wrap justify-center gap-2 text-xs text-white/60">
            <span className="bg-white/10 px-2 py-1 rounded">JPG</span>
            <span className="bg-white/10 px-2 py-1 rounded">PNG</span>
            <span className="bg-white/10 px-2 py-1 rounded">WEBP</span>
          </div>
        </div>
      </div>
    </div>
  )
}