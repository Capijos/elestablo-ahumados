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
  subcategory: string
  images: string[]
  inStock: boolean
  sku: string
  tags: string[]
  rating: number
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
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkIsMobile()
    window.addEventListener("resize", checkIsMobile)
    return () => window.removeEventListener("resize", checkIsMobile)
  }, [])

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

  // Vista móvil optimizada y compacta
  if (isMobile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white">
        {/* Header móvil compacto */}
        <header className="sticky top-0 z-50 bg-black/95 backdrop-blur-md border-b border-gray-800/50">
          <div className="flex items-center justify-between px-4 py-3">
            <Button onClick={onBack} variant="ghost" size="sm" className="p-2 hover:bg-gray-800/50">
              <ArrowLeft className="w-5 h-5 text-white" />
            </Button>
            <h1 className="text-sm font-semibold text-white text-center flex-1 mx-4 truncate">{product.name}</h1>
            <div className="w-9"></div> {/* Spacer para centrar */}
          </div>
        </header>

        {/* Mensaje de éxito compacto */}
        {showSuccess && (
          <div className="fixed top-16 left-4 right-4 bg-gradient-to-r from-green-600 to-green-500 text-white px-4 py-3 rounded-xl shadow-2xl z-50 flex items-center space-x-2">
            <Check className="w-4 h-4" />
            <span className="text-sm font-medium">¡Agregado al carrito!</span>
          </div>
        )}

        <div className="p-4 space-y-4">
          {/* Carrusel de imágenes compacto */}
          <div className="bg-gradient-to-br from-gray-800/30 to-gray-900/30 rounded-2xl p-3 backdrop-blur-sm">
            <ProductImageCarousel
              images={product.images}
              productName={product.name}
              inStock={product.inStock}
              className="w-full h-full object-cover rounded-xl"
            />
          </div>

          {/* Información principal compacta */}
          <div className="bg-gradient-to-br from-gray-800/40 to-gray-900/40 rounded-2xl p-4 backdrop-blur-sm border border-gray-700/30">
            <div className="text-center space-y-3">
              <Badge className="bg-red-500/20 text-red-400 border-red-500/30 text-xs">{product.category}</Badge>
              <h2 className="text-lg font-bold text-white leading-tight">{product.name}</h2>
              <div className="flex items-center justify-center space-x-3">
                <span className="text-2xl font-bold bg-gradient-to-r from-green-400 to-green-300 bg-clip-text text-transparent">
                  $ {product.price.toFixed(2)}
                </span>
                {product.inStock && (
                  <Badge className="bg-green-500/20 text-green-400 border-green-500/30 text-xs">En Stock</Badge>
                )}
              </div>
            </div>
          </div>

          {/* Información detallada en una sola card */}
          <div className="bg-gradient-to-br from-gray-800/40 to-gray-900/40 rounded-2xl p-4 backdrop-blur-sm border border-gray-700/30 space-y-4">
            {/* SKU y disponibilidad */}
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-400 block">SKU</span>
                <span className="text-white font-medium">{product.sku}</span>
              </div>
              <div>
                <span className="text-gray-400 block">Estado</span>
                <span className={`font-medium ${product.inStock ? "text-green-400" : "text-red-400"}`}>
                  {product.inStock ? "Disponible" : "Agotado"}
                </span>
              </div>
            </div>

            {/* Características */}
            <div>
              <span className="text-gray-400 text-sm block mb-2">Características</span>
              <div className="flex flex-wrap gap-1">
                {product.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-2 py-0.5 bg-gray-700/50 text-white text-xs rounded border border-gray-600/30"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Descripción */}
            <div>
              <span className="text-gray-400 text-sm block mb-2">Descripción</span>
              <p className="text-white text-sm leading-relaxed">{product.description}</p>
            </div>
          </div>

          {/* Selector de cantidad y botón - compacto */}
          {product.inStock && (
            <div className="bg-gradient-to-br from-gray-800/40 to-gray-900/40 rounded-2xl p-4 backdrop-blur-sm border border-gray-700/30 space-y-4">
              <div className="flex items-center justify-center space-x-4">
                <span className="text-gray-400 text-sm">Cantidad:</span>
                <div className="flex items-center space-x-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                    className="border-gray-600 text-white hover:bg-gray-700 w-10 h-10 text-lg font-bold rounded-xl bg-gray-800/50"
                  >
                    -
                  </Button>
                  <div className="w-12 h-10 bg-gray-800/50 rounded-xl flex items-center justify-center border border-gray-600">
                    <span className="text-lg font-bold text-white">{quantity}</span>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setQuantity(quantity + 1)}
                    className="border-gray-600 text-white hover:bg-gray-700 w-10 h-10 text-lg font-bold rounded-xl bg-gray-800/50"
                  >
                    +
                  </Button>
                </div>
              </div>

              <Button
                onClick={handleAddToCart}
                className="w-full bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 text-white h-12 font-bold rounded-xl shadow-lg transition-all duration-300"
              >
                <ShoppingCart className="w-4 h-4 mr-2" />
                Agregar $ {(product.price * quantity).toFixed(2)}
              </Button>
            </div>
          )}

          {!product.inStock && (
            <div className="bg-gradient-to-br from-gray-800/40 to-gray-900/40 rounded-2xl p-4 backdrop-blur-sm border border-gray-700/30">
              <Button disabled className="w-full h-12 rounded-xl bg-gray-700 text-gray-400">
                Producto no disponible
              </Button>
            </div>
          )}
        </div>
      </div>
    )
  }

  // Vista desktop compacta
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
      <div className="absolute inset-0 bg-black bg-opacity-10 z-10" />
      <div className="relative z-20">
        {/* Header desktop compacto */}
        <header className="bg-black/95 backdrop-blur-md border-b border-gray-800/50 sticky top-0 z-50">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <Button
                onClick={onBack}
                variant="outline"
                className="bg-transparent border-gray-600 hover:bg-gray-800/50"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Volver a la tienda
              </Button>
              <h1 className="text-lg font-semibold text-white">{product.name}</h1>
              <div className="w-32"></div> {/* Spacer */}
            </div>
          </div>
        </header>

        {/* Mensaje de éxito desktop */}
        {showSuccess && (
          <div className="fixed top-20 right-6 bg-gradient-to-r from-green-600 to-green-500 text-white px-6 py-3 rounded-xl shadow-2xl z-50 flex items-center space-x-2">
            <Check className="w-5 h-5" />
            <span className="font-medium">¡Producto agregado al carrito!</span>
          </div>
        )}

        <div className="container mx-auto px-4 py-8">
          <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
            {/* Carrusel de imágenes desktop */}
            <div className="bg-gradient-to-br from-gray-900/40 to-black/40 rounded-2xl p-6 backdrop-blur-sm border border-gray-700/30">
              <ProductImageCarousel images={product.images} productName={product.name} inStock={product.inStock} />
            </div>

            {/* Información del producto desktop */}
            <div className="space-y-6">
              {/* Header del producto compacto */}
              <div className="bg-gradient-to-br from-gray-900/40 to-black/40 rounded-2xl p-6 backdrop-blur-sm border border-gray-700/30">
                <div className="space-y-4">
                  <Badge className="bg-red-500/20 text-red-400 border-red-500/30">{product.category}</Badge>
                  <h2 className="text-3xl font-bold text-white leading-tight">{product.name}</h2>
                  <div className="flex items-center space-x-4">
                    <span className="text-4xl font-bold bg-gradient-to-r from-green-400 to-green-300 bg-clip-text text-transparent">
                      $ {product.price.toFixed(2)}
                    </span>
                    {product.inStock && (
                      <Badge className="bg-green-500/20 text-green-400 border-green-500/30">En Stock</Badge>
                    )}
                  </div>
                </div>
              </div>

              {/* Información detallada */}
              <div className="bg-gradient-to-br from-gray-900/40 to-black/40 rounded-2xl p-6 backdrop-blur-sm border border-gray-700/30 space-y-4">
                {/* SKU y disponibilidad */}
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <span className="text-gray-400 block mb-1">SKU</span>
                    <span className="text-white text-lg font-semibold">{product.sku}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block mb-1">Disponibilidad</span>
                    <span className={`text-lg font-semibold ${product.inStock ? "text-green-400" : "text-red-400"}`}>
                      {product.inStock ? "Disponible" : "Agotado"}
                    </span>
                  </div>
                </div>

                {/* Características */}
                <div>
                  <span className="text-gray-400 block mb-2">Características</span>
                  <div className="flex flex-wrap gap-2">
                    {product.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-gray-700/50 text-white text-xs rounded border border-gray-600/30"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Descripción */}
                <div>
                  <span className="text-gray-400 block mb-2">Descripción</span>
                  <p className="text-white leading-relaxed">{product.description}</p>
                </div>
              </div>

              {/* Selector de cantidad y botón desktop */}
              {product.inStock && (
                <div className="bg-gradient-to-br from-gray-900/40 to-black/40 rounded-2xl p-6 backdrop-blur-sm border border-gray-700/30 space-y-6">
                  <div className="flex items-center space-x-6">
                    <span className="text-gray-400">Cantidad:</span>
                    <div className="flex items-center space-x-3">
                      <Button
                        variant="outline"
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        disabled={quantity <= 1}
                        className="border-gray-600 text-white hover:bg-gray-700 w-12 h-12 text-xl font-bold rounded-xl bg-gray-800/50"
                      >
                        -
                      </Button>
                      <div className="w-16 h-12 bg-gray-800/50 rounded-xl flex items-center justify-center border border-gray-600">
                        <span className="text-xl font-bold text-white">{quantity}</span>
                      </div>
                      <Button
                        variant="outline"
                        onClick={() => setQuantity(quantity + 1)}
                        className="border-gray-600 text-white hover:bg-gray-700 w-12 h-12 text-xl font-bold rounded-xl bg-gray-800/50"
                      >
                        +
                      </Button>
                    </div>
                  </div>

                  <Button
                    onClick={handleAddToCart}
                    className="w-full bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 text-white h-14 text-lg font-bold rounded-xl shadow-lg transition-all duration-300"
                  >
                    <ShoppingCart className="w-5 h-5 mr-3" />
                    Agregar al carrito - $ {(product.price * quantity).toFixed(2)}
                  </Button>
                </div>
              )}

              {!product.inStock && (
                <div className="bg-gradient-to-br from-gray-900/40 to-black/40 rounded-2xl p-6 backdrop-blur-sm border border-gray-700/30">
                  <Button disabled className="w-full h-14 rounded-xl bg-gray-700 text-gray-400">
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
