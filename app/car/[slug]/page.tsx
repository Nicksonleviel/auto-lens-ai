"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation" // <--- FIX 1: Import useParams
import { ArrowLeft, MapPin, Gauge, Fuel, Zap, Car } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { db } from "@/lib/firebase"
import { doc, getDoc } from "firebase/firestore"
import { Skeleton } from "@/components/ui/skeleton"

// --- FIX 2: Manual Map for Demo Images ---
// Since Firestore doesn't have images yet, we map the IDs to your local public folder files.
const LOCAL_IMAGE_MAP: Record<string, string> = {
  "Acura RL Sedan 2012": "/placeholder.jpg", 
  "Audi R8 Coupe 2012": "/audi-r8-2008-red.jpg",
  "Audi S5 Coupe 2012": "/audi-s5-coupe-2012-white.jpg",
  "Audi TT RS Coupe 2012": "/audi-tt-rs-2012-blue.jpg",
  "BMW M3 Coupe 2012": "/bmw-m3-coupe-2012-silver.jpg",
  "BMW 335i Coupe 2012": "/bmw-335i-coupe-2012-black.jpg",
  "Chevrolet Camaro SS 2010": "/chevrolet-camaro-ss-2010-orange.jpg",
  "Chevrolet Corvette ZR1 2012": "/chevrolet-corvette-zr1-2012-yellow.jpg",
  "Dodge Challenger SRT8 2011": "/dodge-challenger-srt8-2011-black.jpg",
  "Ferrari 458 Italia Coupe 2012": "/ferrari-458-italia-2012-red.jpg",
  "Ferrari California Convertible 2012": "/ferrari-california-2012-red-convertible.jpg",
  "Ford Mustang GT Coupe 2012": "/ford-mustang-gt-2012-blue.jpg",
  "Honda NSX Coupe 2005": "/honda-nsx-2005-red.jpg", 
  "Lamborghini Gallardo Coupe 2012": "/lamborghini-gallardo-2012-orange.jpg",
  "Mercedes-Benz SL63 AMG Convertible 2012": "/mercedes-benz-sl63-amg-2012-silver.jpg",
  "Nissan GT-R Coupe 2012": "/nissan-gt-r-2012-silver.jpg",
  "Porsche 911 Turbo Coupe 2012": "/porsche-911-turbo-2012-silver.jpg",
  "Porsche Panamera Sedan 2012": "/porsche-panamera-2012-black.jpg",
  "Toyota Supra Coupe 2002": "/toyota-supra-2002-orange.jpg"
}

export default function CarDetailPage() {
  const params = useParams() // <--- FIX 1: Use hook
  const [car, setCar] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  
  // Handle case where slug might be array or string
  const rawSlug = Array.isArray(params?.slug) ? params.slug[0] : params?.slug
  const carId = rawSlug ? decodeURIComponent(rawSlug) : ""

  useEffect(() => {
    const fetchCar = async () => {
      if (!carId) return

      try {
        const docRef = doc(db, "cars", carId)
        const docSnap = await getDoc(docRef)
        
        if (docSnap.exists()) {
          setCar(docSnap.data())
        } else {
          console.error("No such car found in Firestore!")
        }
      } catch (e) {
        console.error("Error fetching car:", e)
      } finally {
        setLoading(false)
      }
    }

    fetchCar()
  }, [carId])

  // --- LOADING STATE ---
  if (loading) {
    return (
      <main className="min-h-screen bg-background">
        <header className="border-b border-border/50 bg-zinc-900/80 backdrop-blur-sm sticky top-0 z-50 p-4">
           <div className="container mx-auto flex items-center gap-3">
             <Skeleton className="h-10 w-10 rounded-lg" />
             <div className="space-y-2">
               <Skeleton className="h-6 w-48" />
               <Skeleton className="h-4 w-24" />
             </div>
           </div>
        </header>
        <div className="container mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
           <Skeleton className="w-full aspect-4/3 rounded-2xl" />
           <div className="space-y-6">
             <Skeleton className="h-32 w-full rounded-2xl" />
             <div className="grid grid-cols-2 gap-4">
               <Skeleton className="h-24 w-full rounded-xl" />
               <Skeleton className="h-24 w-full rounded-xl" />
             </div>
           </div>
        </div>
      </main>
    )
  }

  // --- NOT FOUND STATE ---
  if (!car) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center p-8 bg-zinc-900/80 rounded-2xl ring-1 ring-white/10 shadow-lg shadow-primary/10">
          <h1 className="text-2xl font-bold text-foreground mb-4">Car Not Found</h1>
          <p className="text-muted-foreground mb-6">Could not find specs for: {carId}</p>
          <Link href="/browse">
            <Button className="shadow-lg shadow-primary/20">Browse All Cars</Button>
          </Link>
        </div>
      </main>
    )
  }

  // --- MAIN UI ---
  const specs = car.specs || {}
  
  // FIX 2: Resolve Image - Check Firestore, then Local Map, then Placeholder
  const displayImage = car.image || LOCAL_IMAGE_MAP[car.id] || "/placeholder.svg"

  return (
    <main className="min-h-screen bg-background">
      <header className="border-b border-border/50 bg-zinc-900/80 backdrop-blur-sm sticky top-0 z-50 shadow-lg shadow-primary/5">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <Link
              href="/browse"
              className="p-2 rounded-lg bg-zinc-800/80 hover:bg-zinc-700/80 transition-colors ring-1 ring-white/10"
            >
              <ArrowLeft className="h-5 w-5 text-muted-foreground" />
            </Link>
            <div>
              <h1 className="text-xl font-bold text-foreground">{car.name}</h1>
              <p className="text-xs text-muted-foreground">
                {car.year} • {specs.origin || "Unknown Origin"}
              </p>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Image Section */}
          <div className="bg-zinc-900/80 rounded-2xl overflow-hidden border border-border shadow-xl shadow-primary/10 ring-1 ring-white/10">
            <div className="aspect-4/3 overflow-hidden bg-black/20 flex items-center justify-center">
              <img 
                src={displayImage} 
                alt={car.name} 
                className="w-full h-full object-cover"
                onError={(e) => {
                    (e.target as HTMLImageElement).src = "/placeholder.svg"
                }} 
              />
            </div>
          </div>

          {/* Details Section */}
          <div className="space-y-6">
            <div className="bg-zinc-900/80 rounded-2xl p-6 border border-primary/40 shadow-xl shadow-primary/20 ring-1 ring-primary/30">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-3xl font-bold text-foreground">{car.name}</h2>
                  <p className="text-lg text-muted-foreground">
                    {car.make} • {car.bodyType}
                  </p>
                </div>
                <span className="px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium ring-1 ring-primary/20">
                  {car.year}
                </span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>{specs.origin || "Imported"}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-zinc-900/80 rounded-xl p-4 border border-border shadow-lg shadow-primary/10 ring-1 ring-white/10">
                <div className="flex items-center gap-2 text-primary mb-2">
                  <Zap className="h-5 w-5" />
                  <span className="text-sm font-medium">Horsepower</span>
                </div>
                <p className="text-2xl font-bold text-foreground">{specs.horsepower || "N/A"}</p>
              </div>
              <div className="bg-zinc-900/80 rounded-xl p-4 border border-border shadow-lg shadow-primary/10 ring-1 ring-white/10">
                <div className="flex items-center gap-2 text-primary mb-2">
                  <Gauge className="h-5 w-5" />
                  <span className="text-sm font-medium">0-60 mph</span>
                </div>
                <p className="text-2xl font-bold text-foreground">{specs.acceleration || "N/A"}</p>
              </div>
              <div className="bg-zinc-900/80 rounded-xl p-4 border border-border shadow-lg shadow-primary/10 ring-1 ring-white/10">
                <div className="flex items-center gap-2 text-primary mb-2">
                  <Car className="h-5 w-5" />
                  <span className="text-sm font-medium">Body Style</span>
                </div>
                <p className="text-2xl font-bold text-foreground">{car.bodyType || "N/A"}</p>
              </div>
              <div className="bg-zinc-900/80 rounded-xl p-4 border border-border shadow-lg shadow-primary/10 ring-1 ring-white/10">
                <div className="flex items-center gap-2 text-primary mb-2">
                  <Fuel className="h-5 w-5" />
                  <span className="text-sm font-medium">Fuel Type</span>
                </div>
                <p className="text-2xl font-bold text-foreground">{specs.fuelType || "Gasoline"}</p>
              </div>
            </div>

            <div className="bg-zinc-900/80 rounded-xl p-6 border border-border shadow-lg shadow-primary/10 ring-1 ring-white/10">
              <h3 className="text-lg font-semibold text-foreground mb-3">Vehicle Details</h3>
              <p className="text-muted-foreground leading-relaxed">
                The {car.year} {car.name} is a {car.bodyType?.toLowerCase()} from {car.make}, originating from {specs.origin}.
                {specs.horsepower !== "N/A" && ` It features a powerful engine producing ${specs.horsepower}.`}
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}