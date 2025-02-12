import type React from "react"
import { useState } from "react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

interface PredictionData {
  date: string
  sales: number
}

interface FormData {
  Temperature: number
  Fuel_Price: number
  MarkDown1: number
  MarkDown2: number
  MarkDown3: number
  MarkDown4: number
  MarkDown5: number
  CPI: number
  Unemployment: number
  Size: number
  IsHoliday: boolean
}

const DemandPrediction: React.FC = () => {
  const [singleDayPrediction, setSingleDayPrediction] = useState<number | null>(null)
  const [multipleDaysPrediction, setMultipleDaysPrediction] = useState<PredictionData[]>([])
  const [formData, setFormData] = useState<FormData>({
    Temperature: 55.3,
    Fuel_Price: 2.75,
    MarkDown1: 1500.0,
    MarkDown2: 500.0,
    MarkDown3: 100.0,
    MarkDown4: 50.0,
    MarkDown5: 200.0,
    CPI: 220.5,
    Unemployment: 6.2,
    Size: 151315,
    IsHoliday: false,
  })
  const [days, setDays] = useState<number>(30)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : name === "Size" ? Number.parseInt(value) : Number.parseFloat(value),
    }))
  }

  const predictSingleDay = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch("https://predicciones-9fuy.onrender.com/predict_day", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          IsHoliday: formData.IsHoliday ? 1 : 0,
        }),
      })
      const data = await response.json()
      setSingleDayPrediction(data.predicted_sales)
    } catch (error) {
      console.error("Error predicting single day sales:", error)
    }
  }

  const predictMultipleDays = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch("https://predicciones-9fuy.onrender.com/predict_days", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ days }),
      })
      const data = await response.json()
      const currentDate = new Date()
      const predictionData = data.predicted_sales.map((sales: number, index: number) => {
        const date = new Date(currentDate)
        date.setDate(currentDate.getDate() + index)
        return {
          date: date.toISOString().split("T")[0],
          sales,
        }
      })
      setMultipleDaysPrediction(predictionData)
    } catch (error) {
      console.error("Error predicting multiple days sales:", error)
    }
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Predicción de Demanda</h1>

      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-xl font-semibold mb-4">Predicción para un día</h2>
          <form onSubmit={predictSingleDay} className="space-y-4">
            {Object.entries(formData).map(([key, value]) =>
              key !== "IsHoliday" ? (
                <div key={key} className="flex flex-col">
                  <label htmlFor={key} className="mb-1">
                    {key}
                  </label>
                  <input
                    type="number"
                    id={key}
                    name={key}
                    value={value}
                    onChange={handleInputChange}
                    step={key === "Size" ? 1 : 0.1}
                    className="border rounded p-2"
                  />
                </div>
              ) : null,
            )}
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="IsHoliday"
                name="IsHoliday"
                checked={formData.IsHoliday}
                onChange={handleInputChange}
                className="form-checkbox"
              />
              <label htmlFor="IsHoliday">Is Holiday</label>
            </div>
            <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
              Predecir ventas del día
            </button>
          </form>
          {singleDayPrediction !== null && (
            <p className="mt-4">Para este día tus ventas serán de: ${singleDayPrediction.toFixed(2)}</p>
          )}
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">Predicción para múltiples días</h2>
          <form onSubmit={predictMultipleDays} className="space-y-4">
            <div className="flex flex-col">
              <label htmlFor="days" className="mb-1">
                Número de días
              </label>
              <input
                type="number"
                id="days"
                value={days}
                onChange={(e) => setDays(Number.parseInt(e.target.value))}
                min={1}
                max={30}
                className="border rounded p-2"
              />
            </div>
            <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
              Predecir ventas
            </button>
          </form>
          {multipleDaysPrediction.length > 0 && (
            <div className="mt-4">
              <div className="h-[300px] mb-4">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={multipleDaysPrediction}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip 
                      formatter={(value) => {
                        const numValue = Number(value); // Convertir a número
                        return [`$${numValue.toFixed(2)}`, "Ventas"];
                      }} 
                    />
                    <Legend />
                    <Line type="monotone" dataKey="sales" stroke="#8884d8" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white">
                  <thead>
                    <tr>
                      <th className="px-4 py-2 text-left">Fecha</th>
                      <th className="px-4 py-2 text-left">Ventas Predichas</th>
                    </tr>
                  </thead>
                  <tbody>
                    {multipleDaysPrediction.map((day, index) => (
                      <tr key={index} className={index % 2 === 0 ? "bg-gray-100" : ""}>
                        <td className="px-4 py-2">{day.date}</td>
                        <td className="px-4 py-2">${day.sales.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DemandPrediction;

