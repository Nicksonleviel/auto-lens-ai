"use client"

import { useState, useEffect } from "react"
import { Search, ArrowLeft } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { db } from "@/lib/firebase"
import { collection, getDocs } from "firebase/firestore"
import { Skeleton } from "@/components/ui/skeleton"

// Map of car IDs to local images for the demo
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

const regions = ["All", "USA", "Germany", "Italy", "Japan"]

export default function BrowsePage() {
  const [query, setQuery] = useState("")
  const [selectedRegion, setSelectedRegion] = useState("All")
  const [cars, setCars] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  // 1. Fetch Cars from Firebase on Load
  useEffect(() => {
    const fetchCars = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "cars"))
        const carList = querySnapshot.docs.map(doc => doc.data())
        setCars(carList)
      } catch (error) {
        console.error("Error fetching cars:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchCars()
  }, [])

  // 2. Filter Logic
  const filteredCars = cars.filter((car) => {
    // Basic null check for properties
    const carName = car.name || ""
    const carMake = car.make || ""
    const carYear = car.year ? car.year.toString() : ""
    
    // Note: Origin is inside 'specs' in your database structure
    const carOrigin = car.specs?.origin || "Unknown"

    const matchesQuery =
      carName.toLowerCase().includes(query.toLowerCase()) ||
      carMake.toLowerCase().includes(query.toLowerCase()) ||
      carYear.includes(query)
      
    const matchesRegion = selectedRegion === "All" || carOrigin === selectedRegion
    
    return matchesQuery && matchesRegion
  })

  return (
    <main className="min-h-screen bg-background">
      <header className="border-b border-border/50 bg-zinc-900/80 backdrop-blur-sm sticky top-0 z-50 shadow-lg shadow-primary/5">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link
                href="/"
                className="p-2 rounded-lg bg-zinc-800/80 hover:bg-zinc-700/80 transition-colors ring-1 ring-white/10"
              >
                <ArrowLeft className="h-5 w-5 text-muted-foreground" />
              </Link>
              <div>
                <h1 className="text-xl font-bold text-foreground">Browse Cars</h1>
                <p className="text-xs text-muted-foreground">Explore our car database</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search by name, make, or year..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-12 pr-4 h-12 bg-zinc-900/80 border-border shadow-lg shadow-primary/10 ring-1 ring-white/10 rounded-xl"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {regions.map((region) => (
              <Button
                key={region}
                variant={selectedRegion === region ? "default" : "outline"}
                onClick={() => setSelectedRegion(region)}
                className={`rounded-full ${selectedRegion !== region ? "bg-zinc-900/80 ring-1 ring-white/10 hover:ring-primary/30" : "shadow-lg shadow-primary/20"}`}
              >
                {region}
              </Button>
            ))}
          </div>
        </div>

        <div className="inline-block px-4 py-2 mb-6 rounded-lg bg-zinc-900/80 ring-1 ring-white/10 shadow-lg shadow-primary/10">
          <p className="text-sm text-muted-foreground">
            Showing <span className="text-primary font-medium">{filteredCars.length}</span> cars
          </p>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <Skeleton key={i} className="h-64 rounded-xl" />
            ))}
          </div>
        ) : (
          /* Car Grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredCars.map((car) => (
              <Link
                key={car.id}
                // FIX: Use encodeURIComponent for IDs with special chars
                href={`/car/${encodeURIComponent(car.id)}`}
                className="group bg-zinc-900/80 border border-border rounded-xl overflow-hidden shadow-lg shadow-primary/10 ring-1 ring-white/10 hover:ring-primary/30 hover:shadow-xl hover:shadow-primary/20 transition-all"
              >
                <div className="aspect-3/2 overflow-hidden bg-black/40 flex items-center justify-center">
                  <img
                    // FIX: Use the map for images, fallback to placeholder
                    src={LOCAL_IMAGE_MAP[car.id] || "/placeholder.svg"}
                    alt={car.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                        (e.target as HTMLImageElement).src = "/placeholder.svg"
                    }}
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-1">{car.name}</h3>
                  <div className="flex items-center justify-between mt-2">
                    <p className="text-sm text-muted-foreground">{car.year}</p>
                    <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary ring-1 ring-primary/20">
                      {car.specs?.origin || "Imported"}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}