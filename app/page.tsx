"use client"

import { useState } from "react"
import { ImageUploader } from "@/components/image-uploader"
import { ResultDashboard } from "@/components/result-dashboard"
import { ScanningAnimation } from "@/components/scanning-animation"
import { CarSearch } from "@/components/car-search"
import { Sparkles, Zap, Eye, Car } from "lucide-react"
import Link from "next/link"

export type PredictionResult = {
  carName: string
  year: string
  make: string
  model: string
  bodyType: string
  confidence: number
  topPredictions: Array<{ name: string; confidence: number }>
  specs: {
    horsepower: string
    acceleration: string
    fuelType: string
    origin: string
  }
}

export default function HomePage() {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [result, setResult] = useState<PredictionResult | null>(null)

  const handleImageUpload = (imageUrl: string) => {
    setUploadedImage(imageUrl)
    setIsAnalyzing(true)
    setResult(null)

    // Simulate AI analysis
    setTimeout(() => {
      setIsAnalyzing(false)
      setResult({
        carName: "BMW M3 Coupe",
        year: "2012",
        make: "BMW",
        model: "M3 Coupe",
        bodyType: "Coupe",
        confidence: 92,
        topPredictions: [
          { name: "BMW M3 Coupe 2012", confidence: 92 },
          { name: "BMW 335i Coupe 2012", confidence: 5 },
          { name: "Audi S5 Coupe 2012", confidence: 3 },
        ],
        specs: {
          horsepower: "414 HP",
          acceleration: "4.1s (0-60 mph)",
          fuelType: "Gasoline",
          origin: "Germany",
        },
      })
    }, 3000)
  }

  const handleReset = () => {
    setUploadedImage(null)
    setResult(null)
    setIsAnalyzing(false)
  }

  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between gap-4">
            <Link href="/" className="flex items-center gap-3 shrink-0">
              <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center overflow-hidden">
                <img src="/car-lens-logo-minimal.jpg" alt="AutoLens Logo" className="w-full h-full object-cover" />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl font-bold text-foreground">AutoLens</h1>
                <p className="text-xs text-muted-foreground">Intelligent Car Recognition</p>
              </div>
            </Link>

            <div className="flex-1 max-w-md">
              <CarSearch variant="compact" />
            </div>

            <div className="flex items-center gap-4 shrink-0">
              <Link
                href="/browse"
                className="hidden md:flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Browse Cars
              </Link>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  <span className="hidden sm:inline">AI Active</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 md:py-12">
        {!result && !isAnalyzing && (
          <>
            {/* Hero Section */}
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm mb-6">
                <Sparkles className="h-4 w-4" />
                American, European & Asian Cars • 2000–2013
              </div>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4 text-balance">
                Know Every Car <span className="text-primary">In Seconds</span>
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
                Upload a photo of any car and instantly discover its make, model, year, and detailed specifications with
                precision accuracy.
              </p>
            </div>

            {/* Features - English */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto mb-12">
              <div className="flex items-center gap-3 p-4 rounded-xl bg-card border border-border">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Zap className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-foreground text-sm">Fast Analysis</p>
                  <p className="text-xs text-muted-foreground">{"< 3 seconds"}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 rounded-xl bg-card border border-border">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Eye className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-foreground text-sm">Explainable AI</p>
                  <p className="text-xs text-muted-foreground">Visual Heatmap</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 rounded-xl bg-card border border-border">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Car className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-foreground text-sm">Full Specs</p>
                  <p className="text-xs text-muted-foreground">Complete Details</p>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Upload / Result Area */}
        {isAnalyzing && uploadedImage ? (
          <ScanningAnimation imageUrl={uploadedImage} />
        ) : result && uploadedImage ? (
          <ResultDashboard imageUrl={uploadedImage} result={result} onReset={handleReset} />
        ) : (
          <ImageUploader onImageUpload={handleImageUpload} />
        )}
      </div>

      {/* Footer */}
      <footer className="border-t border-border/50 mt-auto">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
            <p>AutoLens - Intelligent Car Recognition</p>
            <p className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-primary" />
              USA • Europe • Asia
            </p>
          </div>
        </div>
      </footer>
    </main>
  )
}
