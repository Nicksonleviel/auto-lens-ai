"use client"

import { useEffect, useState } from "react"
import { Gauge } from "lucide-react"

interface ScanningAnimationProps {
  imageUrl: string
}

export function ScanningAnimation({ imageUrl }: ScanningAnimationProps) {
  const [scanProgress, setScanProgress] = useState(0)
  const [statusText, setStatusText] = useState("Starting analysis...")

  useEffect(() => {
    const statuses = [
      "Starting analysis...",
      "Detecting car object...",
      "Analyzing visual features...",
      "Matching with database...",
      "Calculating confidence score...",
      "Preparing results...",
    ]

    let progress = 0
    const interval = setInterval(() => {
      progress += Math.random() * 15 + 5
      if (progress > 95) progress = 95
      setScanProgress(progress)
      setStatusText(statuses[Math.floor((progress / 100) * statuses.length)])
    }, 400)

    return () => clearInterval(interval)
  }, [])

  const rotation = (scanProgress / 100) * 270 - 135

  return (
    <div className="max-w-2xl mx-auto">
      <div className="relative rounded-2xl overflow-hidden border border-border bg-card">
        {/* Image with scan overlay */}
        <div className="relative">
          <img
            src={imageUrl || "/placeholder.svg"}
            alt="Analyzing"
            className="w-full h-80 object-contain bg-muted/20"
          />
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div
              className="absolute inset-0 animate-shimmer"
              style={{
                background:
                  "linear-gradient(90deg, transparent 0%, rgba(96, 165, 250, 0.1) 20%, rgba(255, 255, 255, 0.2) 50%, rgba(96, 165, 250, 0.1) 80%, transparent 100%)",
              }}
            />
          </div>
          {/* Scanning line animation */}
          <div
            className="absolute left-0 right-0 h-1 bg-primary shadow-[0_0_20px_rgba(96,165,250,0.8)]"
            style={{
              top: `${scanProgress % 100}%`,
              transition: "top 0.3s ease-out",
            }}
          />
          {/* Corner brackets for scan effect */}
          <div className="absolute inset-4 pointer-events-none">
            <div className="absolute top-0 left-0 w-8 h-8 border-l-2 border-t-2 border-primary animate-pulse" />
            <div className="absolute top-0 right-0 w-8 h-8 border-r-2 border-t-2 border-primary animate-pulse" />
            <div className="absolute bottom-0 left-0 w-8 h-8 border-l-2 border-b-2 border-primary animate-pulse" />
            <div className="absolute bottom-0 right-0 w-8 h-8 border-r-2 border-b-2 border-primary animate-pulse" />
          </div>
          {/* Overlay grid */}
          <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-primary/5 pointer-events-none" />
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage: `linear-gradient(rgba(96,165,250,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(96,165,250,0.1) 1px, transparent 1px)`,
              backgroundSize: "40px 40px",
            }}
          />
        </div>

        {/* Status Panel */}
        <div className="p-6 border-t border-border bg-card/80 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              {/* Speedometer-style indicator */}
              <div className="relative w-16 h-16">
                <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="8"
                    className="text-muted"
                    strokeDasharray="188.5"
                    strokeDashoffset="62.8"
                    strokeLinecap="round"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="8"
                    className="text-primary"
                    strokeDasharray="188.5"
                    strokeDashoffset={188.5 - (scanProgress / 100) * 125.7}
                    strokeLinecap="round"
                    style={{ transition: "stroke-dashoffset 0.3s ease-out" }}
                  />
                </svg>
                <div
                  className="absolute inset-0 flex items-center justify-center"
                  style={{
                    transform: `rotate(${rotation}deg)`,
                    transition: "transform 0.3s ease-out",
                  }}
                >
                  <div className="w-1 h-6 bg-primary rounded-full origin-bottom translate-y-[-25%]" />
                </div>
                <Gauge className="absolute inset-0 m-auto h-5 w-5 text-muted-foreground" />
              </div>
              <div>
                <p className="font-medium text-foreground">Analyzing...</p>
                <p className="text-sm text-muted-foreground">{statusText}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-primary font-mono">{Math.round(scanProgress)}%</p>
              <p className="text-xs text-muted-foreground">Progress</p>
            </div>
          </div>

          {/* Progress bar */}
          <div className="h-2 rounded-full bg-muted overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-300 ease-out rounded-full"
              style={{ width: `${scanProgress}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
