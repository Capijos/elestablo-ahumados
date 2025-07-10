"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { X, Plus, Minus, ShoppingCart } from "lucide-react"
import { useState } from "react"
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

interface ProductDetailProps {
  product: Product
  onClose: () => void
  onAddToCart: (product: Product, quantity: number) => void
}

export function ProductDetail({ product, onClose, onAddToCart }: ProductDetailProps) {
  const [quantity, setQuantity] = useState(1)

  const handleAddToCart = () => {
    onAddToCart(product, quantity)
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-4xl bg-white text-black max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-xl">Detalles del producto</CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Carrusel de imágenes del producto */}
            <ProductImageCarousel
              images={product.images}
              productName={product.name}
              inStock={product.inStock}
              className="w-full h-full"
            />

            {/* Información del producto */}
            <div className="space-y-4">
              <div>
                <h2 className="text-2xl font-bold mb-2">{product.name}</h2>
                <p className="text-3xl font-bold text-green-600 mb-4">$ {product.price.toFixed(2)}</p>
              </div>

              <div className="space-y-3">
                <div>
                  <span className="font-semibold">SKU: </span>
                  <span className="text-gray-600">{product.sku}</span>
                </div>

                <div>
                  <span className="font-semibold">Categoría: </span>
                  <Badge variant="outline" className="ml-2">
                    {product.category}
                  </Badge>
                </div>

                <div>
                  <span className="font-semibold">Etiquetas: </span>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {product.tags.map((tag, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <span className="font-semibold">Descripción:</span>
                  <p className="text-gray-600 mt-1">{product.description}</p>
                </div>
              </div>

              {/* Selector de cantidad y botón agregar */}
              {product.inStock && (
                <div className="space-y-4 pt-4 border-t">
                  <div className="flex items-center space-x-4">
                    <span className="font-semibold">Cantidad:</span>
                    <div className="flex items-center space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        disabled={quantity <= 1}
                      >
                        <Minus className="w-3 h-3" />
                      </Button>
                      <span className="w-12 text-center font-semibold">{quantity}</span>
                      <Button size="sm" variant="outline" onClick={() => setQuantity(quantity + 1)}>
                        <Plus className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>

                  <Button onClick={handleAddToCart} className="w-full bg-red-600 hover:bg-red-700 text-white" size="lg">
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    Agregar al carrito - $ {(product.price * quantity).toFixed(2)}
                  </Button>
                </div>
              )}

              {!product.inStock && (
                <div className="pt-4 border-t">
                  <Button disabled className="w-full" size="lg">
                    Producto no disponible
                  </Button>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
