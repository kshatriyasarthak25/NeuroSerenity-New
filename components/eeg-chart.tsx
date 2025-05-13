"use client"

import { useEffect, useRef } from "react"
import { Chart, registerables } from "chart.js"
import { useTheme } from "next-themes"

Chart.register(...registerables)

interface EEGChartProps {
  data: number[]
  labels: number[]
}

export default function EEGChart({ data, labels }: EEGChartProps) {
  const chartRef = useRef<HTMLCanvasElement>(null)
  const chartInstance = useRef<Chart | null>(null)
  const { theme } = useTheme()

  useEffect(() => {
    if (!chartRef.current) return

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
        type: "line",
        data: {
          labels: labels,
          datasets: [
            {
              label: "EEG Amplitude",
              data: data,
              borderColor: "#10b981", // Emerald color
              backgroundColor: "rgba(16, 185, 129, 0.1)",
              borderWidth: 2,
              pointRadius: 3,
              pointBackgroundColor: "#10b981",
              tension: 0.4,
              fill: true,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          animation: {
            duration: 500,
          },
          scales: {
            x: {
              title: {
                display: true,
                text: "Time (seconds)",
                color: textColor,
              },
              grid: {
                color: gridColor,
              },
              ticks: {
                color: textColor,
              },
            },
            y: {
              title: {
                display: true,
                text: "Amplitude",
                color: textColor,
              },
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
              labels: {
                color: textColor,
              },
            },
            tooltip: {
              mode: "index",
              intersect: false,
            },
          },
        },
      })
    }
  }, [data, labels, theme])

  useEffect(() => {
    // Update chart when theme changes
    if (chartInstance.current) {
      const isDarkMode = theme === "dark"
      const gridColor = isDarkMode ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)"
      const textColor = isDarkMode ? "rgba(255, 255, 255, 0.8)" : "rgba(0, 0, 0, 0.8)"

      chartInstance.current.options.scales!.x!.grid!.color = gridColor
      chartInstance.current.options.scales!.y!.grid!.color = gridColor
      chartInstance.current.options.scales!.x!.ticks!.color = textColor
      chartInstance.current.options.scales!.y!.ticks!.color = textColor
      chartInstance.current.options.scales!.x!.title!.color = textColor
      chartInstance.current.options.scales!.y!.title!.color = textColor
      chartInstance.current.options.plugins!.legend!.labels!.color = textColor

      chartInstance.current.update()
    }
  }, [theme])

  return (
    <div className="w-full h-[400px]">
      <canvas ref={chartRef}></canvas>
    </div>
  )
}
