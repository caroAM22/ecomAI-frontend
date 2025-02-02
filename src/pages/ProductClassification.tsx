import { useState } from "react"

const ProductClassification = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [classification, setClassification] = useState<string>("")

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setSelectedFile(event.target.files[0])
    }
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!selectedFile) return

    const formData = new FormData()
    formData.append("image", selectedFile)

    try {
      const response = await fetch("/api/product-classification", {
        method: "POST",
        body: formData,
      })
      const data = await response.json()
      setClassification(data.classification)
    } catch (error) {
      console.error("Error classifying product:", error)
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Clasificación de Productos</h1>
      <form onSubmit={handleSubmit} className="mb-4">
        <input type="file" onChange={handleFileChange} accept="image/*" className="mb-2" />
        <button type="submit" className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
          Clasificar Producto
        </button>
      </form>
      {classification && (
        <div className="mt-4">
          <h2 className="text-xl font-semibold">Resultado de la clasificación:</h2>
          <p className="text-lg">{classification}</p>
        </div>
      )}
    </div>
  )
}

export default ProductClassification

