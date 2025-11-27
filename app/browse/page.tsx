"use client"

import { useState } from "react"
import { Search, ArrowLeft } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import Link from "next/link"

const carDatabase = [
  {
    name: "BMW M3 Coupe",
    year: "2012",
    make: "BMW",
    origin: "Germany",
    slug: "bmw-m3-coupe-2012",
    image: "/bmw-m3-coupe-2012-silver.jpg",
  },
  {
    name: "BMW 335i Coupe",
    year: "2012",
    make: "BMW",
    origin: "Germany",
    slug: "bmw-335i-coupe-2012",
    image: "/bmw-335i-coupe-2012-black.jpg",
  },
  {
    name: "Audi R8",
    year: "2008",
    make: "Audi",
    origin: "Germany",
    slug: "audi-r8-2008",
    image: "/audi-r8-2008-red.jpg",
  },
  {
    name: "Audi S5 Coupe",
    year: "2012",
    make: "Audi",
    origin: "Germany",
    slug: "audi-s5-coupe-2012",
    image: "/audi-s5-coupe-2012-white.jpg",
  },
  {
    name: "Audi TT RS",
    year: "2012",
    make: "Audi",
    origin: "Germany",
    slug: "audi-tt-rs-2012",
    image: "/audi-tt-rs-2012-blue.jpg",
  },
  {
    name: "Chevrolet Corvette ZR1",
    year: "2012",
    make: "Chevrolet",
    origin: "USA",
    slug: "chevrolet-corvette-zr1-2012",
    image: "/chevrolet-corvette-zr1-2012-yellow.jpg",
  },
  {
    name: "Chevrolet Camaro SS",
    year: "2010",
    make: "Chevrolet",
    origin: "USA",
    slug: "chevrolet-camaro-ss-2010",
    image: "/chevrolet-camaro-ss-2010-orange.jpg",
  },
  {
    name: "Ferrari 458 Italia",
    year: "2012",
    make: "Ferrari",
    origin: "Italy",
    slug: "ferrari-458-italia-2012",
    image: "/ferrari-458-italia-2012-red.jpg",
  },
  {
    name: "Ferrari California",
    year: "2012",
    make: "Ferrari",
    origin: "Italy",
    slug: "ferrari-california-2012",
    image: "/ferrari-california-2012-red-convertible.jpg",
  },
  {
    name: "Porsche 911 Turbo",
    year: "2012",
    make: "Porsche",
    origin: "Germany",
    slug: "porsche-911-turbo-2012",
    image: "/porsche-911-turbo-2012-silver.jpg",
  },
  {
    name: "Porsche Panamera",
    year: "2012",
    make: "Porsche",
    origin: "Germany",
    slug: "porsche-panamera-2012",
    image: "/porsche-panamera-2012-black.jpg",
  },
  {
    name: "Mercedes-Benz SL63 AMG",
    year: "2012",
    make: "Mercedes-Benz",
    origin: "Germany",
    slug: "mercedes-benz-sl63-amg-2012",
    image: "/mercedes-benz-sl63-amg-2012-silver.jpg",
  },
  {
    name: "Lamborghini Gallardo",
    year: "2012",
    make: "Lamborghini",
    origin: "Italy",
    slug: "lamborghini-gallardo-2012",
    image: "/lamborghini-gallardo-2012-orange.jpg",
  },
  {
    name: "Ford Mustang GT",
    year: "2012",
    make: "Ford",
    origin: "USA",
    slug: "ford-mustang-gt-2012",
    image: "/ford-mustang-gt-2012-blue.jpg",
  },
  {
    name: "Dodge Challenger SRT8",
    year: "2011",
    make: "Dodge",
    origin: "USA",
    slug: "dodge-challenger-srt8-2011",
    image: "/dodge-challenger-srt8-2011-black.jpg",
  },
  {
    name: "Nissan GT-R",
    year: "2012",
    make: "Nissan",
    origin: "Japan",
    slug: "nissan-gt-r-2012",
    image: "/nissan-gt-r-2012-silver.jpg",
  },
  {
    name: "Toyota Supra",
    year: "2002",
    make: "Toyota",
    origin: "Japan",
    slug: "toyota-supra-2002",
    image: "/toyota-supra-2002-orange.jpg",
  },
  {
    name: "Honda NSX",
    year: "2005",
    make: "Honda",
    origin: "Japan",
    slug: "honda-nsx-2005",
    image: "/honda-nsx-2005-red.jpg",
  },
]

const regions = ["All", "USA", "Germany", "Italy", "Japan"]

export default function BrowsePage() {
  const [query, setQuery] = useState("")
  const [selectedRegion, setSelectedRegion] = useState("All")

  const filteredCars = carDatabase.filter((car) => {
    const matchesQuery =
      car.name.toLowerCase().includes(query.toLowerCase()) ||
      car.make.toLowerCase().includes(query.toLowerCase()) ||
      car.year.includes(query)
    const matchesRegion = selectedRegion === "All" || car.origin === selectedRegion
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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredCars.map((car) => (
            <Link
              key={car.slug}
              href={`/car/${car.slug}`}
              className="group bg-zinc-900/80 border border-border rounded-xl overflow-hidden shadow-lg shadow-primary/10 ring-1 ring-white/10 hover:ring-primary/30 hover:shadow-xl hover:shadow-primary/20 transition-all"
            >
              <div className="aspect-[3/2] overflow-hidden bg-black/40">
                <img
                  src={car.image || "/placeholder.svg"}
                  alt={car.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">{car.name}</h3>
                <div className="flex items-center justify-between mt-2">
                  <p className="text-sm text-muted-foreground">{car.year}</p>
                  <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary ring-1 ring-primary/20">
                    {car.origin}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  )
}
