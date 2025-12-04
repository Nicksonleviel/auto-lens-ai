"use client"

import { useState } from "react"
import { ImageUploader } from "@/components/image-uploader"
import { ResultDashboard } from "@/components/result-dashboard"
import { ScanningAnimation } from "@/components/scanning-animation"
import { CarSearch } from "@/components/car-search"
import { Sparkles, Zap, Eye, Car } from "lucide-react"
import Link from "next/link"
import { db } from "@/lib/firebase"
import { doc, getDoc } from "firebase/firestore"

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
  heatmapImage?: string
}

export default function HomePage() {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [result, setResult] = useState<PredictionResult | null>(null)

  const handleImageUpload = async (fileOrUrl: string | File) => {
    let previewUrl = "";
    let fileToSend: File | null = null;

    if (typeof fileOrUrl === 'string') {
        previewUrl = fileOrUrl;
        const response = await fetch(fileOrUrl);
        const blob = await response.blob();
        fileToSend = new File([blob], "image.jpg", { type: "image/jpeg" });
    } else {
        fileToSend = fileOrUrl;
        previewUrl = URL.createObjectURL(fileToSend);
    }

    setUploadedImage(previewUrl);
    setIsAnalyzing(true);
    setResult(null);

    try {
      const formData = new FormData();
      if(fileToSend) {
          formData.append('file', fileToSend);
      }

      // 1. Call Flask API
      const response = await fetch('http://127.0.0.1:5000/predict', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Prediction failed');

        const apiData = await response.json();

        // 1. Create the clean ID (Replace underscores with spaces, slashes with underscores)
      let dbId = apiData.carName.replace(/_/g, " "); 
      dbId = dbId.replace(/\//g, "_");
      dbId = dbId.trim(); // <--- ADD THIS LINE to remove hidden spaces

      console.log(`AI Says: '${apiData.carName}'`);
      console.log(`Fetching DB ID: '${dbId}'`);

        // --- 2. FETCH DYNAMIC DATA FROM FIREBASE ---
        
        const docRef = doc(db, "cars", dbId); 
        const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const firebaseData = docSnap.data();
        
        setResult({
            carName: apiData.carName,
            confidence: apiData.confidence,
            topPredictions: apiData.topPredictions,
            heatmapImage: apiData.heatmapImage,
            year: firebaseData.year,
            make: firebaseData.make,
            model: firebaseData.model,
            bodyType: firebaseData.bodyType,
            specs: firebaseData.specs
        });
      } else {
        console.warn(`Car not found in DB: "${dbId}". Falling back to manual parsing.`);
        
        // --- 3. SMART FALLBACK ---
        // If DB lookup fails, don't show "Unknown". Parse the name ourselves.
        // e.g. "Acura RL Sedan 2012" -> Make: Acura, Model: RL Sedan, Year: 2012
        const parts = dbId.split(" ");
        const fallbackYear = parts.length > 1 && !isNaN(Number(parts[parts.length-1])) 
            ? parts.pop() 
            : "----";
        const fallbackMake = parts[0] || "Car";
        const fallbackModel = parts.join(" ") || apiData.carName;

        setResult({
            carName: apiData.carName,
            confidence: apiData.confidence,
            topPredictions: apiData.topPredictions,
            
            // Use our manual parsing instead of "Unknown"
            heatmapImage: apiData.heatmapImage,
            year: fallbackYear,
            make: fallbackMake,
            model: fallbackModel,
            bodyType: "Car", // Default
            
            specs: {
                horsepower: "N/A",
                acceleration: "N/A",
                fuelType: "N/A",
                origin: "N/A"
            }
            
        });
      }

    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsAnalyzing(false);
    }
  }

  const handleReset = () => {
    setUploadedImage(null)
    setResult(null)
    setIsAnalyzing(false)
  }

  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/40 bg-background/80 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between gap-4">
          
          {/* Logo - Text hidden on small screens to save space */}
          <Link href="/" className="flex items-center gap-3 shrink-0">
            <div className="w-9 h-9 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center overflow-hidden">
              <img src="/car-lens-logo-minimal.jpg" alt="Logo" className="w-full h-full object-cover" />
            </div>
            <div className="hidden md:block">
              <h1 className="text-lg font-bold text-foreground leading-tight">AutoLens</h1>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider">AI Scanner</p>
            </div>
          </Link>

          {/* Search Bar - Flex grow to fill space, but limited width */}
          <div className="flex-1 max-w-md px-2 md:px-6">
            <CarSearch variant="compact" />
          </div>

          {/* Right Nav - Hidden on very small screens if needed */}
          <div className="flex items-center gap-4 shrink-0">
            <Link
              href="/browse"
              className="hidden sm:flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Browse
            </Link>
            
            {/* Status Indicator */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary/50 border border-border/50">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              <span className="text-xs font-medium text-muted-foreground hidden sm:inline">System Active</span>
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

            {/* Features */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto mb-12">
              <div className="flex items-center gap-3 p-4 rounded-xl bg-card border border-border">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Zap className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-foreground text-sm">Fast Analysis</p>
                  <p className="text-xs text-muted-foreground">{"< 5 seconds"}</p>
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