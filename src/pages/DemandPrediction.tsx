import { useState } from "react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts"

const DemandPrediction = () => {
  const [predictionData, setPredictionData] = useState<{ date: string; sales: number }[]>([])

  const fetchPrediction = async () => {
    try {
      const response = await fetch("/api/demand-prediction")
      const data = await response.json()
      setPredictionData(data)
    } catch (error) {
      console.error("Error fetching prediction data:", error)
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Predicción de Demanda</h1>
      <button
        onClick={fetchPrediction}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4"
      >
        Obtener Predicción
      </button>
      {predictionData.length > 0 && (
        <LineChart width={600} height={300} data={predictionData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="sales" stroke="#8884d8" />
        </LineChart>
      )}
    </div>
  )
}

export default DemandPrediction

