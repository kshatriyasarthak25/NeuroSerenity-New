"use client"

import { useEffect, useRef } from "react"
import { Chart, registerables } from "chart.js"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useTheme } from "next-themes"

Chart.register(...registerables)

interface HistoryPanelProps {
  data: number[]
  labels: number[]
}

export default function HistoryPanel({ data, labels }: HistoryPanelProps) {
  const chartRef = useRef<HTMLCanvasElement>(null)
  const chartInstance = useRef<Chart | null>(null)
  const { theme } = useTheme()

  // Calculate statistics
  const average = data.length > 0 ? data.reduce((a, b) => a + b, 0) / data.length : 0
  const max = data.length > 0 ? Math.max(...data) : 0
  const min = data.length > 0 ? Math.min(...data) : 0

  // Count states
  const seizureCount = data.filter((val) => val > 60).length
  const engagedCount = data.filter((val) => val > 40 && val <= 60).length
  const relaxedCount = data.filter((val) => val <= 40).length

  useEffect(() => {
    if (!chartRef.current || data.length === 0) return

    const isDarkMode = theme === "dark"
    const gridColor = isDarkMode ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)"
    const textColor = isDarkMode ? "rgba(255, 255, 255, 0.8)" : "rgba(0, 0, 0, 0.8)"

    // Destroy previous chart if it exists
    if (chartInstance.current) {
      chartInstance.current.destroy()
    }

    // Create new chart
    const ctx = chartRef.current.getContext("2d")
    if (ctx) {
      chartInstance.current = new Chart(ctx, {
        type: "bar",
        data: {
          labels: ["Relaxed (≤40)", "Engaged (41-60)", "Seizure (>60)"],
          datasets: [
            {
              label: "Count",
              data: [relaxedCount, engagedCount, seizureCount],
              backgroundColor: [
                "rgba(16, 185, 129, 0.7)", // Green for relaxed
                "rgba(59, 130, 246, 0.7)", // Blue for engaged
                "rgba(239, 68, 68, 0.7)", // Red for seizure
              ],
              borderColor: ["rgb(16, 185, 129)", "rgb(59, 130, 246)", "rgb(239, 68, 68)"],
              borderWidth: 1,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              beginAtZero: true,
              title: {
                display: true,
                text: "Frequency",
                color: textColor,
              },
              grid: {
                color: gridColor,
              },
              ticks: {
                color: textColor,
              },
            },
            x: {
              grid: {
                color: gridColor,
              },
              ticks: {
                color: textColor,
              },
            },
          },
          plugins: {
            legend: {
              display: false,
            },
          },
        },
      })
    }
  }, [data, labels, relaxedCount, engagedCount, seizureCount, theme])

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-2">
            <div className="text-sm">
              <span className="text-muted-foreground">Average:</span>
              <span className="font-medium ml-2">{average.toFixed(2)}</span>
            </div>
            <div className="text-sm">
              <span className="text-muted-foreground">Max:</span>
              <span className="font-medium ml-2">{max.toFixed(2)}</span>
            </div>
            <div className="text-sm">
              <span className="text-muted-foreground">Min:</span>
              <span className="font-medium ml-2">{min.toFixed(2)}</span>
            </div>
            <div className="text-sm">
              <span className="text-muted-foreground">Samples:</span>
              <span className="font-medium ml-2">{data.length}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">State Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[200px]">
            {data.length > 0 ? (
              <canvas ref={chartRef}></canvas>
            ) : (
              <div className="flex items-center justify-center h-full text-muted-foreground">No data available</div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
