import { useState } from "react"

const PersonalizedRecommendation = () => {
  const [userId, setUserId] = useState("")
  const [recommendations, setRecommendations] = useState<string[]>([])

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    try {
      const response = await fetch(`/api/personalized-recommendation?userId=${userId}`)
      const data = await response.json()
      setRecommendations(data.recommendations)
    } catch (error) {
      console.error("Error fetching recommendations:", error)
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Recomendaciones Personalizadas</h1>
      <form onSubmit={handleSubmit} className="mb-4">
        <input
          type="text"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          placeholder="Ingrese ID de usuario"
          className="border p-2 mr-2"
        />
        <button type="submit" className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded">
          Obtener Recomendaciones
        </button>
      </form>
      {recommendations.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-2">Productos recomendados:</h2>
          <ul className="list-disc pl-5">
            {recommendations.map((product, index) => (
              <li key={index}>{product}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

export default PersonalizedRecommendation

