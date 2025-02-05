import { useState } from "react";

const ProductClassification = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [classification, setClassification] = useState<string>("");

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setSelectedFile(file);

      const fileReader = new FileReader();
      fileReader.onloadend = () => {
        setPreviewUrl(fileReader.result as string);
      };
      fileReader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append("image", selectedFile);

    try {
      const response = await fetch("/api/product-classification", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      setClassification(data.classification);
    } catch (error) {
      console.error("Error classifying product:", error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4 text-center">Clasificación de Productos</h1>
        <form onSubmit={handleSubmit} className="mb-4">
          <input
            type="file"
            onChange={handleFileChange}
            accept="image/*"
            className="mb-4 w-full p-2 border border-gray-300 rounded"
          />
          {previewUrl && (
            <div className="mt-4 text-center">
              <h2 className="text-xl font-semibold">Imagen:</h2>
              <img
                src={previewUrl}
                alt="Previsualización"
                className="mt-2 mx-auto max-w-full h-auto max-h-48 rounded"
              />
            </div>
          )}
          <button
            type="submit"
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mt-4 w-full"
          >
            Clasificar Producto
          </button>
        </form>
        {classification && (
          <div className="mt-4 text-center">
            <h2 className="text-xl font-semibold">Resultado de la clasificación:</h2>
            <p className="text-lg">{classification}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductClassification;