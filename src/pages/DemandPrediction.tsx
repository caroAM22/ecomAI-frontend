import type React from "react"
import { useState } from "react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { Loader2 } from "lucide-react"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Checkbox } from "../components/ui/checkbox"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"

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

const formFields = [
  {
    name: "Temperature",
    label: "Temperatura",
    description: "Temperatura promedio del día en grados Fahrenheit",
    min: 7.46,
    max: 95.91,
  },
  {
    name: "Fuel_Price",
    label: "Precio del Combustible",
    description: "Precio promedio del combustible en la región",
    min: 3.03,
    max: 4.30,
  },
  {
    name: "MarkDown1",
    label: "Descuento 1",
    description: "Promoción para algunos productos",
    min: 32.5,
    max: 88646.76,
  },
  {
    name: "MarkDown2",
    label: "Descuento 2",
    description: "Promoción para algunos productos",
    min: -265.76,
    max: 104519.54,
  },
  {
    name: "MarkDown3",
    label: "Descuento 3",
    description: "Promoción para algunos productos",
    min: -29.1,
    max: 141630.61,
  },
  {
    name: "MarkDown4",
    label: "Descuento 4",
    description: "Promoción para algunos productos",
    min: 0.46,
    max: 67474.85,
  },
  {
    name: "MarkDown5",
    label: "Descuento 5",
    description: "Promoción para algunos productos",
    min: 170.64,
    max: 108519.28,
  },
  {
    name: "CPI",
    label: "Índice de Precios al Consumidor",
    description: "Medida de la inflación",
    min: 129.81,
    max: 227.037,
  },
  {
    name: "Unemployment",
    label: "Tasa de Desempleo",
    description: "Porcentaje de desempleo en la región",
    min: 4.08,
    max: 12.89,
  },
  {
    name: "Size",
    label: "Tamaño de la Tienda",
    description: "Tamaño de la tienda en pies cuadrados",
    min: 34875,
    max: 219622,
  },
]

const DemandPrediction: React.FC = () => {
  const [singleDayPrediction, setSingleDayPrediction] = useState<number | null>(null)
  const [multipleDaysPrediction, setMultipleDaysPrediction] = useState<PredictionData[]>([])
  const [formData, setFormData] = useState<FormData>({
    Temperature: 57.35,
    Fuel_Price: 3.62,
    MarkDown1: 8841.26,
    MarkDown2: 3693.53,
    MarkDown3: 1816.63,
    MarkDown4: 4025.92,
    MarkDown5: 5310.83,
    CPI: 174.77,
    Unemployment: 7.41,
    Size: 155229,
    IsHoliday: false,
  })
  const [days, setDays] = useState<number>(30)
  const [singleDayLoading, setSingleDayLoading] = useState(false)
  const [multipleDaysLoading, setMultipleDaysLoading] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    const field = formFields.find((f) => f.name === name)

    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
          : value === ""
            ? field?.min || 0
            : Math.min(
                Math.max(Number(value), field?.min || Number.NEGATIVE_INFINITY),
                field?.max || Number.POSITIVE_INFINITY,
              ),
    }))
  }

  const predictSingleDay = async (e: React.FormEvent) => {
    e.preventDefault()
    setSingleDayLoading(true)
    try {
      const dataToSend = Object.fromEntries(
        Object.entries(formData).map(([key, value]) => [key, value === "" ? 0 : value]),
      )
      const response = await fetch("https://predicciones-9fuy.onrender.com/predict_day", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...dataToSend,
          IsHoliday: formData.IsHoliday ? 1 : 0,
        }),
      })
      const data = await response.json()
      setSingleDayPrediction(data.predicted_sales)
    } catch (error) {
      console.error("Error predicting single day sales:", error)
    } finally {
      setSingleDayLoading(false)
    }
  }

  const predictMultipleDays = async (e: React.FormEvent) => {
    e.preventDefault()
    setMultipleDaysLoading(true)
    try {
      const daysToPredict = days || 1 // Si days es 0 o vacío, usamos 1 como valor por defecto
      const response = await fetch("https://predicciones-9fuy.onrender.com/predict_days", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ days: daysToPredict }),
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
    } finally {
      setMultipleDaysLoading(false)
    }
  }

  return (
    <div className="container mx-auto p-4 bg-gradient-to-r from-purple-100 to-pink-100 min-h-screen">
      <h1 className="text-4xl font-bold mb-8 text-center text-purple-800">Predicción de Demanda</h1>

      <div className="grid md:grid-cols-2 gap-8">
        <Card className="bg-white/80 backdrop-blur-sm shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl font-semibold text-purple-700">Predicción para un día</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={predictSingleDay} className="space-y-6">
            {formFields
              .filter((field) => field.name !== "IsHoliday") // Excluir IsHoliday de los inputs numéricos
              .map((field) => (
                <div key={field.name} className="space-y-2">
                  <label htmlFor={field.name} className="block text-sm font-medium text-gray-700">
                    {field.label}
                  </label>
                  <Input
                    type="number"
                    id={field.name}
                    name={field.name}
                    value={formData[field.name as keyof FormData] as number} // Ya no hay booleanos aquí
                    onChange={handleInputChange}
                    step={field.name === "Size" ? 1 : 0.01}
                    min={field.min}
                    max={field.max}
                    className="w-full border rounded p-2"
                  />
                  <p className="text-xs text-gray-500">{field.description}</p>
                </div>
              ))}
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="IsHoliday"
                  checked={formData.IsHoliday}
                  onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, IsHoliday: checked as boolean }))}
                />
                <label htmlFor="IsHoliday" className="text-sm font-medium text-gray-700">
                  Es día festivo
                </label>
              </div>
              <Button
                type="submit"
                className="w-full bg-purple-600 text-white hover:bg-purple-700"
                disabled={singleDayLoading}
              >
                {singleDayLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Prediciendo...
                  </>
                ) : (
                  "Predecir ventas del día"
                )}
              </Button>
            </form>
            {singleDayPrediction !== null && (
              <p className="mt-4 text-lg font-semibold text-purple-700">
                Para este día tus ventas serán de: ${singleDayPrediction.toFixed(2)}
              </p>
            )}
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-sm shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl font-semibold text-purple-700">Predicción para múltiples días</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={predictMultipleDays} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="days" className="block text-sm font-medium text-gray-700">
                  Número de días
                </label>
                <Input
                  type="number"
                  id="days"
                  value={days}
                  onChange={(e) => setDays(Number.parseInt(e.target.value) || 0)}
                  min={1}
                  max={30}
                  className="w-full border rounded p-2"
                />
                <p className="text-xs text-gray-500">
                  Ingrese el número de días para los que desea predecir las ventas (máximo 30)
                </p>
              </div>
              <Button
                type="submit"
                className="w-full bg-purple-600 text-white hover:bg-purple-700"
                disabled={multipleDaysLoading}
              >
                {multipleDaysLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Prediciendo...
                  </>
                ) : (
                  "Predecir ventas"
                )}
              </Button>
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
                          const numValue = Number(value)
                          return [`$${numValue.toFixed(2)}`, "Ventas"]
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
                        <th className="px-4 py-2 text-left text-purple-700">Fecha</th>
                        <th className="px-4 py-2 text-left text-purple-700">Ventas Predichas</th>
                      </tr>
                    </thead>
                    <tbody>
                      {multipleDaysPrediction.map((day, index) => (
                        <tr key={index} className={index % 2 === 0 ? "bg-purple-50" : ""}>
                          <td className="px-4 py-2">{day.date}</td>
                          <td className="px-4 py-2">${day.sales.toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default DemandPrediction;

