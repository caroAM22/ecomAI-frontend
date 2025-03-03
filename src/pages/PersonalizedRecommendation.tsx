import { useState, useEffect } from "react"
import { Loader2, ImageOff } from "lucide-react"

interface Product {
  index: number
  name: string
  image: string
  ratings: number
  no_of_ratings: number
  discount_price: string
  actual_price: string
  main_category: string
  sub_category: string
  link: string
  desc: string
  score: number
}

interface ProductImageProps {
  src: string
  alt: string
  className?: string
}

const ProductImage = ({ src, alt, className = "" }: ProductImageProps) => {
  const [imageLoaded, setImageLoaded] = useState(false)
  const [imageError, setImageError] = useState(false)
  
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (!imageLoaded) {
        setImageError(true)
      }
    }, 5000) 

    return () => clearTimeout(timeoutId)
  }, [imageLoaded])

  if (imageError) {
    return (
      <div className={`bg-gray-100 flex items-center justify-center ${className}`}>
        <ImageOff className="w-8 h-8 text-gray-400" />
      </div>
    )
  }

  return (
    <div className={`relative bg-gray-100 ${className}`}>
      {!imageLoaded && (
        <div className="absolute inset-0 flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-gray-400 animate-spin" />
        </div>
      )}
      <img 
        src={src} 
        alt={alt}
        className={`w-full h-full object-contain transition-opacity duration-300 ${
          imageLoaded ? 'opacity-100' : 'opacity-0'
        }`}
        onLoad={() => setImageLoaded(true)}
        onError={() => setImageError(true)}
      />
    </div>
  )
}

interface ProductCardProps {
  product: Product
  isSelected: boolean
  onClick: () => void
  similarProducts?: Product[]
  isLoadingSimilar?: boolean
  onSimilarProductSelect?: (product: Product) => void
}

const ProductCard = ({ 
  product, 
  isSelected, 
  onClick,
}: ProductCardProps) => {
  return (
    <div className="flex flex-col gap-4">
      <div 
        onClick={onClick}
        className={`p-4 border rounded transition-all duration-200 ${
          isSelected ? 'border-purple-500 bg-purple-50' : 'hover:border-gray-400'
        } cursor-pointer flex flex-col`}
      >
        <ProductImage 
          src={product.image} 
          alt={product.name}
          className="w-full h-48 mb-4"
        />
        <h3 className="font-medium text-sm mb-2 line-clamp-2 min-h-[2.5rem]">
          {product.name}
        </h3>
        <div className="mt-auto">
          <div className="flex items-center mb-2">
            <span className="text-yellow-400 mr-1">★</span>
            <span className="text-sm text-gray-600">
              {product.ratings} ({product.no_of_ratings})
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold">{product.discount_price}</span>
            {product.actual_price && (
              <span className="text-sm text-gray-500 line-through">
                {product.actual_price}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

const PersonalizedRecommendation = () => {
  const [topRatedProducts, setTopRatedProducts] = useState<Product[]>([])
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [similarProducts, setSimilarProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [loadingSimilar, setLoadingSimilar] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    fetchTopRatedProducts()
  }, [])

  const fetchTopRatedProducts = async () => {
    setLoading(true)
    setError("")
    try {
      const response = await fetch('https://amazon-recommendation-system-production.up.railway.app/top-rated-products')
      const data = await response.json()
      setTopRatedProducts(data)
    } catch (error) {
      setError("Error al cargar los productos mejor calificados")
      console.error("Error:", error)
    }
    setLoading(false)
  }

  const handleProductSelect = async (product: Product) => {
    if (selectedProduct?.index === product.index) {
      setSelectedProduct(null)
      setSimilarProducts([])
      return
    }

    setSelectedProduct(product)
    setLoadingSimilar(true)
    setError("")
    
    try {
      const indexResponse = await fetch(`https://amazon-recommendation-system-production.up.railway.app/product-index/${product.name}`)
      const { index } = await indexResponse.json()
      
      const recommendResponse = await fetch(`https://amazon-recommendation-system-production.up.railway.app/recommend/${index}?n=10`)
      const recommendedProducts = await recommendResponse.json()
      
      setSimilarProducts(Array.isArray(recommendedProducts) ? recommendedProducts : [])
    } catch (error) {
      setError("Error al obtener productos similares")
      console.error("Error:", error)
    }
    setLoadingSimilar(false)
  }

  const LoadingSkeleton = () => (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {[...Array(8)].map((_, i) => (
        <div key={i} className="p-4 border rounded animate-pulse">
          <div className="w-full h-48 bg-gray-200 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
      ))}
    </div>
  )

  return (
    <div className="relative min-h-screen">
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Recomendaciones Personalizadas</h1>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Productos Mejor Calificados</h2>
          {loading ? (
            <LoadingSkeleton />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {topRatedProducts.map((product) => (
                <ProductCard
                  key={product.index}
                  product={product}
                  isSelected={selectedProduct?.index === product.index}
                  onClick={() => handleProductSelect(product)}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      <div 
        className={`fixed top-0 right-0 h-full w-96 bg-white shadow-xl transform transition-transform duration-300 ease-in-out overflow-hidden ${
          selectedProduct ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {selectedProduct && (
          <div className="h-full flex flex-col">
            <div className="p-4 border-b sticky top-0 bg-white z-10">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold">Productos Similares</h3>
                <button 
                  onClick={() => setSelectedProduct(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>
              <p className="text-sm text-gray-600 line-clamp-2">
                Basado en: {selectedProduct.name}
              </p>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
              {loadingSimilar ? (
                <div className="flex items-center justify-center h-32">
                  <Loader2 className="w-6 h-6 animate-spin text-purple-500" />
                </div>
              ) : similarProducts.length > 0 ? (
                <div className="grid gap-4">
                  {similarProducts.map((product) => (
                    <div
                      key={product.index}
                      onClick={() => handleProductSelect(product)}
                      className="p-3 border rounded hover:border-purple-400 cursor-pointer transition-colors duration-200"
                    >
                      <div className="flex gap-3">
                        <ProductImage 
                          src={product.image}
                          alt={product.name}
                          className="w-24 h-24"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-sm mb-1 line-clamp-2">
                            {product.name}
                          </h4>
                          <div className="flex items-center text-sm text-gray-600 mb-1">
                            <span className="text-yellow-400 mr-1">★</span>
                            {product.ratings} ({product.no_of_ratings})
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-base font-bold">
                              {product.discount_price}
                            </span>
                            {product.actual_price && (
                              <span className="text-sm text-gray-500 line-through">
                                {product.actual_price}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div>
                  <h4 className="font-semibold mb-2">Top Productos Mejor Calificados</h4>
                  <div className="grid gap-4">
                  {topRatedProducts.slice(0, 5).map((product) => (
                    <div
                    key={product.index}
                    onClick={() => handleProductSelect(product)}
                    className="p-3 border rounded hover:border-purple-400 cursor-pointer transition-colors duration-200"
                    >
                    <div className="flex gap-3">
                      <ProductImage 
                      src={product.image}
                      alt={product.name}
                      className="w-24 h-24"
                      />
                      <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm mb-1 line-clamp-2">
                        {product.name}
                      </h4>
                      <div className="flex items-center text-sm text-gray-600 mb-1">
                        <span className="text-yellow-400 mr-1">★</span>
                        {product.ratings} ({product.no_of_ratings})
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-base font-bold">
                        {product.discount_price}
                        </span>
                        {product.actual_price && (
                        <span className="text-sm text-gray-500 line-through">
                          {product.actual_price}
                        </span>
                        )}
                      </div>
                      </div>
                    </div>
                    </div>
                  ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {selectedProduct && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-25 md:hidden"
          onClick={() => setSelectedProduct(null)}
        />
      )}
    </div>
  )
}

export default PersonalizedRecommendation