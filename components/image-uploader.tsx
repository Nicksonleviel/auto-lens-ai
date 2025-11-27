"use client"

import type React from "react"

import { useState, useCallback } from "react"
import { Upload, ImageIcon, X } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ImageUploaderProps {
  onImageUpload: (imageUrl: string) => void
}

export function ImageUploader({ onImageUpload }: ImageUploaderProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [preview, setPreview] = useState<string | null>(null)

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    if (file && file.type.startsWith("image/")) {
      processFile(file)
    }
  }, [])

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      processFile(file)
    }
  }, [])

  const processFile = (file: File) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const result = e.target?.result as string
      setPreview(result)
    }
    reader.readAsDataURL(file)
  }

  const handleAnalyze = () => {
    if (preview) {
      onImageUpload(preview)
    }
  }

  const handleClear = () => {
    setPreview(null)
  }

  return (
    <div className="max-w-2xl mx-auto">
      {!preview ? (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`relative border-2 border-dashed rounded-2xl p-12 transition-all duration-300 ${
            isDragging
              ? "border-primary bg-primary/5 scale-[1.02]"
              : "border-border hover:border-primary/50 hover:bg-card/50"
          }`}
        >
          <input
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          <div className="flex flex-col items-center gap-4 text-center">
            <div
              className={`p-6 rounded-full transition-colors ${
                isDragging ? "bg-primary/20" : "bg-card border border-border"
              }`}
            >
              <Upload
                className={`h-10 w-10 transition-colors ${isDragging ? "text-primary" : "text-muted-foreground"}`}
              />
            </div>
            <div>
              <p className="text-lg font-medium text-foreground mb-1">
                {isDragging ? "Drop the image here" : "Upload a car photo"}
              </p>
              <p className="text-sm text-muted-foreground">Drag & drop or click to select a file</p>
              <p className="text-xs text-muted-foreground mt-2">Supports JPG, PNG, WEBP (max 10MB)</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="relative rounded-2xl overflow-hidden border border-border bg-card">
            <img src={preview || "/placeholder.svg"} alt="Preview" className="w-full h-80 object-contain bg-muted/20" />
            <button
              onClick={handleClear}
              className="absolute top-3 right-3 p-2 rounded-full bg-background/80 hover:bg-background border border-border transition-colors"
            >
              <X className="h-4 w-4 text-foreground" />
            </button>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={handleClear} className="flex-1 bg-transparent">
              <ImageIcon className="h-4 w-4 mr-2" />
              Change Image
            </Button>
            <Button onClick={handleAnalyze} className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90">
              <Upload className="h-4 w-4 mr-2" />
              Analyze Now
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
