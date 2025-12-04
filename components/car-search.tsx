"use client"

import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"

interface CarSearchProps {
  variant?: "default" | "compact"
}

export function CarSearch({ variant = "default" }: CarSearchProps) {
  return (
    <div className="relative w-full max-w-sm mx-auto">
      {/* Search Icon */}
      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
        <Search className="h-4 w-4" />
      </div>
      
      {/* Input Field */}
      <Input 
        type="text" 
        placeholder="Search for a car (e.g. BMW X5)..." 
        className={`
          pl-10 pr-4 py-2 w-full
          bg-secondary/50 border-border/50 
          focus:bg-background focus:ring-2 focus:ring-primary/20
          transition-all duration-200
          ${variant === "compact" ? "h-10 text-sm" : "h-12 text-base"}
        `}
      />
    </div>
  )
}