import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface ResultCardProps {
  time: string
  amplitude: number
  feedback: string
}

export default function ResultCard({ time, amplitude, feedback }: ResultCardProps) {
  const getBadgeVariant = () => {
    if (feedback.includes("Seizure")) return "destructive"
    if (feedback.includes("engaged")) return "default"
    return "secondary"
  }

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-4">
        <div className="flex justify-between items-center mb-2">
          <Badge variant={getBadgeVariant()}>
            {feedback.includes("Seizure") ? "Seizure" : feedback.includes("engaged") ? "Engaged" : "Relaxed"}
          </Badge>
          <span className="text-sm text-muted-foreground">{time}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Amplitude:</span>
          <span className="font-bold">{amplitude.toFixed(2)}</span>
        </div>
        <p className="text-sm mt-2 text-muted-foreground">{feedback}</p>
      </CardContent>
    </Card>
  )
}
