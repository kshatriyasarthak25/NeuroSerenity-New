"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Loader2, Download, Moon, Sun, AlertTriangle } from "lucide-react"
import { useTheme } from "next-themes"
import EEGChart from "@/components/eeg-chart"
import ResultCard from "@/components/result-card"
import HistoryPanel from "@/components/history-panel"

export default function Home() {
  const [isSimulating, setIsSimulating] = useState(false)
  const [eegData, setEegData] = useState<number[]>([])
  const [timeLabels, setTimeLabels] = useState<number[]>([])
  const [feedback, setFeedback] = useState("Waiting for data...")
  const [feedbackColor, setFeedbackColor] = useState("text-gray-500")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [results, setResults] = useState<Array<{ time: string; amplitude: number; feedback: string }>>([])
  const [exportData, setExportData] = useState<any[]>([])
  const simulationInterval = useRef<NodeJS.Timeout | null>(null)
  const { theme, setTheme } = useTheme()

  useEffect(() => {
    return () => {
      if (simulationInterval.current) {
        clearInterval(simulationInterval.current)
      }
    }
  }, [])

  const startSimulation = () => {
    if (isSimulating) {
      if (simulationInterval.current) {
        clearInterval(simulationInterval.current)
        simulationInterval.current = null
      }
      setIsSimulating(false)
      setFeedback("Simulation stopped")
      setFeedbackColor("text-gray-500")
    } else {
      setIsSimulating(true)
      fetchEEGData()
      simulationInterval.current = setInterval(fetchEEGData, 1000)
    }
  }

  const fetchEEGData = async () => {
    try {
      setIsLoading(true)
      setError(null)

      const response = await fetch("http://127.0.0.1:5000/simulate_eeg")

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`)
      }

      const data = await response.json()

      // Update chart data
      setEegData((prevData) => {
        const newData = [...prevData, data.amplitude]
        // Keep only the last 30 data points for better visualization
        return newData.slice(-30)
      })

      setTimeLabels((prevLabels) => {
        const newLabels = [...prevLabels, prevLabels.length > 0 ? prevLabels[prevLabels.length - 1] + 1 : 0]
        return newLabels.slice(-30)
      })

      // Update feedback
      setFeedback(data.feedback)
      setFeedbackColor(
        data.feedback.includes("Seizure")
          ? "text-red-500 font-bold"
          : data.feedback.includes("engaged")
            ? "text-blue-500"
            : "text-green-500",
      )

      // Add to results history
      const timestamp = new Date().toLocaleTimeString()
      const newResult = {
        time: timestamp,
        amplitude: data.amplitude,
        feedback: data.feedback,
      }

      setResults((prev) => [newResult, ...prev].slice(0, 10))
      setExportData((prev) => [...prev, { ...newResult, date: new Date().toISOString() }])
    } catch (err) {
      console.error("Error fetching EEG data:", err)
      setError("Failed to fetch EEG data. Make sure the Flask backend is running.")
      if (simulationInterval.current) {
        clearInterval(simulationInterval.current)
        simulationInterval.current = null
      }
      setIsSimulating(false)
    } finally {
      setIsLoading(false)
    }
  }

  const exportToCSV = () => {
    if (exportData.length === 0) return

    const headers = ["date", "time", "amplitude", "feedback"]
    const csvContent = [
      headers.join(","),
      ...exportData.map((row) => [row.date, row.time, row.amplitude, `"${row.feedback}"`].join(",")),
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.setAttribute("href", url)
    link.setAttribute("download", `eeg_data_${new Date().toISOString().split("T")[0]}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">EEG Simulation Dashboard</h1>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Sun className="h-5 w-5" />
            <Switch checked={theme === "dark"} onCheckedChange={() => setTheme(theme === "dark" ? "light" : "dark")} />
            <Moon className="h-5 w-5" />
          </div>
          <Button variant={isSimulating ? "destructive" : "default"} onClick={startSimulation} disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isSimulating ? "Stop Simulation" : "Start Simulation"}
          </Button>
          <Button variant="outline" onClick={exportToCSV} disabled={exportData.length === 0}>
            <Download className="mr-2 h-4 w-4" />
            Export Data
          </Button>
        </div>
      </div>

      {error && (
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6 flex items-center"
          role="alert"
        >
          <AlertTriangle className="h-5 w-5 mr-2" />
          <span>{error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              <span>Real-time EEG Signal</span>
              {isLoading && <Loader2 className="h-5 w-5 animate-spin" />}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <EEGChart data={eegData} labels={timeLabels} />
            <div className={`mt-4 text-xl ${feedbackColor}`}>
              <strong>Feedback:</strong> {feedback}
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Tabs defaultValue="results">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="results">Recent Results</TabsTrigger>
              <TabsTrigger value="history">History</TabsTrigger>
            </TabsList>
            <TabsContent value="results" className="space-y-4">
              {results.length > 0 ? (
                results.map((result, index) => (
                  <ResultCard key={index} time={result.time} amplitude={result.amplitude} feedback={result.feedback} />
                ))
              ) : (
                <p className="text-center py-8 text-gray-500">No results yet. Start the simulation to see data.</p>
              )}
            </TabsContent>
            <TabsContent value="history">
              <HistoryPanel data={eegData} labels={timeLabels} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </main>
  )
}
