"use client"

import { useState } from "react"
import type { PredictionResult } from "@/app/page" // Ensure this import matches your page.tsx export
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { RotateCcw, Gauge, Fuel, Flag, Car, Eye, EyeOff, CheckCircle2, AlertCircle, AlertTriangle } from "lucide-react"

interface ResultDashboardProps {
  imageUrl: string
  result: PredictionResult
  onReset: () => void
}

export function ResultDashboard({ imageUrl, result, onReset }: ResultDashboardProps) {
  const [showHeatmap, setShowHeatmap] = useState(false)

  // --- NEW: Dynamic Confidence Logic ---
  const getConfidenceLevel = (confidence: number) => {
    if (confidence >= 90) {
      return {
        label: "Excellent Match",
        text: "AI is extremely confident in this identification.",
        color: "text-green-400",
        bgColor: "bg-green-400",
        icon: CheckCircle2
      }
    }
    if (confidence >= 75) {
      return {
        label: "High Confidence",
        text: "AI is highly confident in this result.",
        color: "text-emerald-400",
        bgColor: "bg-emerald-400",
        icon: CheckCircle2
      }
    }
    if (confidence >= 50) {
      return {
        label: "Medium Confidence",
        text: "Likely match, but check visual details.",
        color: "text-yellow-400",
        bgColor: "bg-yellow-400",
        icon: AlertCircle
      }
    }
    return {
      label: "Low Confidence",
      text: "Unsure. Results may be inaccurate.",
      color: "text-red-400",
      bgColor: "bg-red-400",
      icon: AlertTriangle
    }
  }

  const confLevel = getConfidenceLevel(result.confidence)
  const StatusIcon = confLevel.icon

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
            </CardContent>
          </Card>

          {/* Top Predictions */}
          <Card className="border-border bg-zinc-900/80 shadow-lg shadow-primary/10 ring-1 ring-white/10">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Top 3 Predictions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {result.topPredictions.map((pred, index) => {
                 const predLevel = getConfidenceLevel(pred.confidence)
                 return (
                    <div key={index} className="space-y-1.5">
                      <div className="flex items-center justify-between text-sm">
                        <span className={index === 0 ? "font-medium text-foreground" : "text-muted-foreground"}>
                          {index + 1}. {pred.name}
                        </span>
                        <span className={predLevel.color}>{pred.confidence.toFixed(2)}%</span>
                      </div>
                      <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${predLevel.bgColor}`}
                          style={{ width: `${pred.confidence}%` }}
                        />
                      </div>
                    </div>
                 )
              })}
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Data */}
        <div className="space-y-4">
          {/* Main Result */}
          <Card className={`border-primary/40 bg-zinc-900/80 shadow-xl shadow-primary/20 ring-1 ${confLevel.color.replace('text', 'ring')}`}>
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
                  <div className={`text-4xl font-bold font-mono ${confLevel.color}`}>
                    {result.confidence.toFixed(2)}%
                  </div>
                  <p className="text-xs text-muted-foreground">Confidence</p>
                </div>
              </div>

              {/* Dynamic Confidence Indicator */}
              <div className="flex items-center gap-3 p-3 rounded-lg bg-black/40 border border-white/5">
                <StatusIcon className={`h-5 w-5 ${confLevel.color}`} />
                <div>
                    <p className={`text-sm font-medium ${confLevel.color}`}>{confLevel.label}</p>
                    <p className="text-xs text-muted-foreground">{confLevel.text}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Specs Grid */}
          <div className="grid grid-cols-2 gap-3">
            <SpecItem icon={Gauge} label="Horsepower" value={result.specs.horsepower} />
            <SpecItem icon={Car} label="Acceleration" value={result.specs.acceleration} />
            <SpecItem icon={Fuel} label="Fuel Type" value={result.specs.fuelType} />
            <SpecItem icon={Flag} label="Origin" value={result.specs.origin} />
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
              identify this vehicle as a <span className="text-foreground font-medium">{result.carName}</span>.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

function SpecItem({ icon: Icon, label, value }: any) {
    return (
        <Card className="border-border bg-zinc-900/80 shadow-lg shadow-primary/10 ring-1 ring-white/10">
            <CardContent className="p-4">
            <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/20">
                <Icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                <p className="text-xs text-muted-foreground">{label}</p>
                <p className="font-semibold text-foreground truncate">{value || "N/A"}</p>
                </div>
            </div>
            </CardContent>
        </Card>
    )
}