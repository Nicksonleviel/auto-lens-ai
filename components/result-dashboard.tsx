"use client"

import { useState } from "react"
import type { PredictionResult } from "@/app/page"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { RotateCcw, Gauge, Fuel, Flag, Car, Eye, EyeOff, CheckCircle2, AlertCircle } from "lucide-react"

interface ResultDashboardProps {
  imageUrl: string
  result: PredictionResult
  onReset: () => void
}

export function ResultDashboard({ imageUrl, result, onReset }: ResultDashboardProps) {
  const [showHeatmap, setShowHeatmap] = useState(false)

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return "text-green-400"
    if (confidence >= 50) return "text-yellow-400"
    return "text-red-400"
  }

  const getConfidenceBg = (confidence: number) => {
    if (confidence >= 80) return "bg-green-400"
    if (confidence >= 50) return "bg-yellow-400"
    return "bg-red-400"
  }

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <CheckCircle2 className="h-6 w-6 text-green-400" />
          <div>
            <h2 className="text-xl font-bold text-foreground">Analysis Complete</h2>
            <p className="text-sm text-muted-foreground">Car successfully identified</p>
          </div>
        </div>
        <Button variant="outline" onClick={onReset}>
          <RotateCcw className="h-4 w-4 mr-2" />
          New Analysis
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column - Image */}
        <div className="space-y-4">
          <Card className="border-border bg-zinc-900/80 overflow-hidden shadow-lg shadow-primary/10 ring-1 ring-white/10">
            <div className="relative">
              <img
                src={imageUrl || "/placeholder.svg"}
                alt="Analyzed car"
                className="w-full h-72 object-contain bg-black/40"
              />
              {/* Simulated heatmap overlay */}
              {showHeatmap && (
                <div className="absolute inset-0 pointer-events-none">
                  <div
                    className="absolute w-48 h-32 rounded-full opacity-60"
                    style={{
                      background:
                        "radial-gradient(ellipse, rgba(239,68,68,0.7) 0%, rgba(249,115,22,0.4) 40%, transparent 70%)",
                      top: "30%",
                      left: "20%",
                    }}
                  />
                  <div
                    className="absolute w-32 h-24 rounded-full opacity-50"
                    style={{
                      background:
                        "radial-gradient(ellipse, rgba(249,115,22,0.6) 0%, rgba(234,179,8,0.3) 50%, transparent 70%)",
                      top: "35%",
                      right: "25%",
                    }}
                  />
                  <div
                    className="absolute w-40 h-20 rounded-full opacity-40"
                    style={{
                      background: "radial-gradient(ellipse, rgba(234,179,8,0.5) 0%, transparent 60%)",
                      bottom: "25%",
                      left: "30%",
                    }}
                  />
                </div>
              )}
            </div>
            <CardContent className="p-4">
              <Button variant="outline" onClick={() => setShowHeatmap(!showHeatmap)} className="w-full">
                {showHeatmap ? (
                  <>
                    <EyeOff className="h-4 w-4 mr-2" />
                    Hide AI Vision
                  </>
                ) : (
                  <>
                    <Eye className="h-4 w-4 mr-2" />
                    Show AI Vision
                  </>
                )}
              </Button>
              {showHeatmap && (
                <p className="text-xs text-muted-foreground mt-3 text-center">
                  Red areas indicate regions the AI focused on most for identification
                </p>
              )}
            </CardContent>
          </Card>

          {/* Top Predictions */}
          <Card className="border-border bg-zinc-900/80 shadow-lg shadow-primary/10 ring-1 ring-white/10">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Top 3 Predictions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {result.topPredictions.map((pred, index) => (
                <div key={index} className="space-y-1.5">
                  <div className="flex items-center justify-between text-sm">
                    <span className={index === 0 ? "font-medium text-foreground" : "text-muted-foreground"}>
                      {index + 1}. {pred.name}
                    </span>
                    <span className={getConfidenceColor(pred.confidence)}>{pred.confidence}%</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${getConfidenceBg(pred.confidence)}`}
                      style={{ width: `${pred.confidence}%` }}
                    />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Data */}
        <div className="space-y-4">
          {/* Main Result */}
          <Card className="border-primary/40 bg-zinc-900/80 shadow-xl shadow-primary/20 ring-1 ring-primary/30">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Identification Result</p>
                  <h3 className="text-3xl font-bold text-foreground">
                    {result.year} {result.make}
                  </h3>
                  <p className="text-xl text-primary">{result.model}</p>
                </div>
                <div className="text-right">
                  <div className={`text-4xl font-bold font-mono ${getConfidenceColor(result.confidence)}`}>
                    {result.confidence}%
                  </div>
                  <p className="text-xs text-muted-foreground">Confidence</p>
                </div>
              </div>

              {/* Confidence indicator */}
              <div className="flex items-center gap-2 p-3 rounded-lg bg-black/40">
                {result.confidence >= 80 ? (
                  <>
                    <CheckCircle2 className="h-5 w-5 text-green-400" />
                    <span className="text-sm text-foreground">AI is highly confident in this result</span>
                  </>
                ) : (
                  <>
                    <AlertCircle className="h-5 w-5 text-yellow-400" />
                    <span className="text-sm text-foreground">Medium confidence, check other alternatives</span>
                  </>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Specs Grid */}
          <div className="grid grid-cols-2 gap-3">
            <Card className="border-border bg-zinc-900/80 shadow-lg shadow-primary/10 ring-1 ring-white/10">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/20">
                    <Gauge className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Horsepower</p>
                    <p className="font-semibold text-foreground">{result.specs.horsepower}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border bg-zinc-900/80 shadow-lg shadow-primary/10 ring-1 ring-white/10">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/20">
                    <Car className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Acceleration</p>
                    <p className="font-semibold text-foreground">{result.specs.acceleration}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border bg-zinc-900/80 shadow-lg shadow-primary/10 ring-1 ring-white/10">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/20">
                    <Fuel className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Fuel Type</p>
                    <p className="font-semibold text-foreground">{result.specs.fuelType}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border bg-zinc-900/80 shadow-lg shadow-primary/10 ring-1 ring-white/10">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/20">
                    <Flag className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Origin</p>
                    <p className="font-semibold text-foreground">{result.specs.origin}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Body Type Badge */}
          <Card className="border-border bg-zinc-900/80 shadow-lg shadow-primary/10 ring-1 ring-white/10">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Body Type</p>
                  <p className="font-semibold text-foreground">{result.bodyType}</p>
                </div>
                <div className="px-3 py-1.5 rounded-full bg-primary/20 border border-primary/30">
                  <span className="text-sm font-medium text-primary">{result.make}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* XAI Info */}
          <div className="p-4 rounded-xl bg-zinc-900/80 border border-border shadow-lg shadow-primary/10 ring-1 ring-white/10">
            <h4 className="font-medium text-foreground mb-2 flex items-center gap-2">
              <Eye className="h-4 w-4 text-primary" />
              Why Did AI Choose This?
            </h4>
            <p className="text-sm text-muted-foreground leading-relaxed">
              The AI analyzed visual features like the front grille shape, headlight design, and body proportions to
              identify this vehicle as a <span className="text-foreground font-medium">{result.carName}</span>. Click
              "Show AI Vision" to see the areas it focused on most.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
