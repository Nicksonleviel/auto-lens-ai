"use client"

import { useState } from "react"
import { Search, ArrowRight } from "lucide-react"
import { Input } from "@/components/ui/input"
import Link from "next/link"

const popularCars = [
  { name: "BMW M3 Coupe", year: "2012", slug: "bmw-m3-coupe-2012" },
  { name: "Audi R8", year: "2008", slug: "audi-r8-2008" },
  { name: "Chevrolet Corvette", year: "2012", slug: "chevrolet-corvette-2012" },
  { name: "Ferrari 458 Italia", year: "2012", slug: "ferrari-458-italia-2012" },
  { name: "Porsche 911 Turbo", year: "2012", slug: "porsche-911-turbo-2012" },
]

const allCars = [
  { name: "BMW M3 Coupe", year: "2012", slug: "bmw-m3-coupe-2012" },
  { name: "BMW 335i Coupe", year: "2012", slug: "bmw-335i-coupe-2012" },
  { name: "Audi R8", year: "2008", slug: "audi-r8-2008" },
  { name: "Audi S5 Coupe", year: "2012", slug: "audi-s5-coupe-2012" },
  { name: "Audi TT RS", year: "2012", slug: "audi-tt-rs-2012" },
  { name: "Chevrolet Corvette ZR1", year: "2012", slug: "chevrolet-corvette-zr1-2012" },
  { name: "Chevrolet Camaro SS", year: "2010", slug: "chevrolet-camaro-ss-2010" },
  { name: "Ferrari 458 Italia", year: "2012", slug: "ferrari-458-italia-2012" },
  { name: "Ferrari California", year: "2012", slug: "ferrari-california-2012" },
  { name: "Porsche 911 Turbo", year: "2012", slug: "porsche-911-turbo-2012" },
  { name: "Porsche Panamera", year: "2012", slug: "porsche-panamera-2012" },
  { name: "Mercedes-Benz SL63 AMG", year: "2012", slug: "mercedes-benz-sl63-amg-2012" },
  { name: "Lamborghini Gallardo", year: "2012", slug: "lamborghini-gallardo-2012" },
  { name: "Ford Mustang GT", year: "2012", slug: "ford-mustang-gt-2012" },
  { name: "Dodge Challenger SRT8", year: "2011", slug: "dodge-challenger-srt8-2011" },
  { name: "Nissan GT-R", year: "2012", slug: "nissan-gt-r-2012" },
  { name: "Toyota Supra", year: "2002", slug: "toyota-supra-2002" },
  { name: "Honda NSX", year: "2005", slug: "honda-nsx-2005" },
]

interface CarSearchProps {
  variant?: "default" | "compact"
}

export function CarSearch({ variant = "default" }: CarSearchProps) {
  const [query, setQuery] = useState("")
  const [isFocused, setIsFocused] = useState(false)

  const filteredCars =
    query.length > 0
      ? allCars
          .filter((car) => car.name.toLowerCase().includes(query.toLowerCase()) || car.year.includes(query))
          .slice(0, 5)
      : []

  const isCompact = variant === "compact"

  return (
    <div className="relative">
      <div className="relative">
        <Search
          className={`absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground ${isCompact ? "h-4 w-4" : "h-5 w-5"}`}
        />
        <Input
          type="text"
          placeholder={isCompact ? "Search cars..." : "Search for a car model..."}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setTimeout(() => setIsFocused(false), 200)}
          className={`pl-10 pr-4 bg-zinc-900/80 border-border ring-1 ring-white/10 focus:ring-primary/50 ${
            isCompact ? "h-10 text-sm rounded-lg" : "h-14 text-base rounded-xl"
          }`}
        />
      </div>

      {/* Search Results Dropdown */}
      {isFocused && filteredCars.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-zinc-900 border border-border rounded-xl overflow-hidden shadow-xl shadow-black/20 z-50">
          {filteredCars.map((car) => (
            <Link
              key={car.slug}
              href={`/car/${car.slug}`}
              className={`flex items-center justify-between hover:bg-zinc-800 transition-colors ${
                isCompact ? "px-3 py-2" : "px-4 py-3"
              }`}
            >
              <div>
                <p className={`font-medium text-foreground ${isCompact ? "text-sm" : ""}`}>{car.name}</p>
                <p className={`text-muted-foreground ${isCompact ? "text-xs" : "text-sm"}`}>{car.year}</p>
              </div>
              <ArrowRight className="h-4 w-4 text-muted-foreground" />
            </Link>
          ))}
        </div>
      )}

      {/* Popular Cars - only show in default variant */}
      {!isCompact && !query && (
        <div className="mt-4">
          <p className="text-xs text-muted-foreground mb-2">Popular searches:</p>
          <div className="flex flex-wrap gap-2">
            {popularCars.map((car) => (
              <Link
                key={car.slug}
                href={`/car/${car.slug}`}
                className="px-3 py-1.5 text-xs bg-zinc-800/50 hover:bg-zinc-800 border border-border rounded-full text-muted-foreground hover:text-foreground transition-colors"
              >
                {car.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
