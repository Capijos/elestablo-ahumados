"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, ShoppingCart, Check } from "lucide-react"
import { useState, useEffect } from "react"
import { ProductImageCarousel } from "@/components/product-image-carousel"

interface Product {
  id: number
  name: string
  price: number
  category: string
  images: string[]
  inStock: boolean
  sku: string
  tags: string[]
  description: string
}

interface ProductViewProps {
  product: Product
  onBack: () => void
  onAddToCart: (product: Product, quantity: number) => void
}

export function ProductView({ product, onBack, onAddToCart }: ProductViewProps) {
  const [quantity, setQuantity] = useState(1)
  const [showSuccess, setShowSuccess] = useState(false)

  const handleAddToCart = () => {
    onAddToCart(product, quantity)
    setShowSuccess(true)
  }

  useEffect(() => {
    if (showSuccess) {
      const timer = setTimeout(() => {
        setShowSuccess(false)
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [showSuccess])

  return (
    <div className="min-h-screen text-white relative">
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: 'url("https://www.tienda.parriteca.com/wp-content/uploads/2024/06/fondo-parri-web-restaurante.webp")',
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: "fixed",
        }}
      />
      <div className="absolute inset-0 bg-black bg-opacity-60 z-10" />
      <div className="relative z-20">
        <div className="container mx-auto px-4 py-8">
          {/* Botón volver */}
          <Button onClick={onBack} variant="outline" className="mb-8 bg-transparent">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver a la tienda
          </Button>

          {/* Mensaje de éxito */}
          {showSuccess && (
            <div className="fixed top-20 right-4 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg z-50 flex items-center space-x-2">
              <Check className="w-5 h-5" />
              <span>¡Producto agregado al carrito correctamente!</span>
            </div>
          )}

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Carrusel de imágenes del producto */}
            <ProductImageCarousel images={product.images} productName={product.name} inStock={product.inStock} />

            {/* Información del producto */}
            <div className="space-y-6">
              <div>
                <h1 className="text-4xl font-bold mb-4 text-white">{product.name}</h1>
                <p className="text-5xl font-bold text-green-400 mb-6">$ {product.price.toFixed(2)}</p>
              </div>

              <div className="space-y-4 bg-gray-900 bg-opacity-50 p-6 rounded-lg">
                <div className="flex items-center space-x-4">
                  <span className="font-semibold text-lg text-white">SKU:</span>
                  <span className="text-gray-300 text-lg">{product.sku}</span>
                </div>

                <div className="flex items-center space-x-4">
                  <span className="font-semibold text-lg text-white">Categoría:</span>
                  <Badge variant="outline" className="text-sm px-3 py-1 text-white border-white">
                    {product.category}
                  </Badge>
                </div>

                <div>
                  <span className="font-semibold text-lg block mb-2 text-white">Etiquetas:</span>
                  <div className="flex flex-wrap gap-2">
                    {product.tags.map((tag, index) => (
                      <Badge key={index} variant="secondary" className="text-sm px-3 py-1 bg-gray-700 text-white">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>

              <div className="bg-gray-900 bg-opacity-50 p-6 rounded-lg">
                <h3 className="font-semibold text-xl mb-3 text-white">Descripción:</h3>
                <p className="text-gray-300 text-lg leading-relaxed">{product.description}</p>
              </div>

              {/* Selector de cantidad y botón agregar */}
              {product.inStock && (
                <div className="space-y-6 bg-gray-900 bg-opacity-50 p-6 rounded-lg">
                  <div className="flex items-center space-x-6">
                    <span className="font-semibold text-lg text-white">Cantidad:</span>
                    <div className="flex items-center space-x-3">
                      <Button
                        size="lg"
                        variant="outline"
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        disabled={quantity <= 1}
                        className="border-white text-white hover:bg-white hover:text-black w-12 h-12 text-xl font-bold"
                      >
                        -
                      </Button>
                      <span className="w-16 text-center font-bold text-xl text-white">{quantity}</span>
                      <Button
                        size="lg"
                        variant="outline"
                        onClick={() => setQuantity(quantity + 1)}
                        className="border-white text-white hover:bg-white hover:text-black w-12 h-12 text-xl font-bold"
                      >
                        +
                      </Button>
                    </div>
                  </div>

                  <Button onClick={handleAddToCart} className="w-full bg-red-600 hover:bg-red-700 text-white" size="lg">
                    <ShoppingCart className="w-5 h-5 mr-3" />
                    Agregar al carrito - $ {(product.price * quantity).toFixed(2)}
                  </Button>
                </div>
              )}

              {!product.inStock && (
                <div className="bg-gray-900 bg-opacity-50 p-6 rounded-lg">
                  <Button disabled className="w-full" size="lg">
                    Producto no disponible
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
