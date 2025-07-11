"use client"

import { useState } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface ProductImageCarouselProps {
  images: string[]
  productName: string
  inStock: boolean
  className?: string
}

export function ProductImageCarousel({
  images,
  productName,
  inStock,
  className = "",
}: ProductImageCarouselProps) {
  const [currentImage, setCurrentImage] = useState(0)

  const nextImage = () => {
    setCurrentImage((prev) => (prev + 1) % images.length)
  }

  const prevImage = () => {
    setCurrentImage((prev) => (prev - 1 + images.length) % images.length)
  }

  const goToImage = (index: number) => {
    setCurrentImage(index)
  }

  // Mostrar placeholder si no hay imágenes
  if (images.length === 0) {
    return (
      <div className={`relative w-full h-full rounded-lg overflow-hidden ${className}`}>
        <Image
          src="/placeholder.svg"
          alt={productName}
          fill
          className="object-cover"
        />
        {!inStock && (
          <div className="absolute inset-0 bg-black bg-opacity-75 flex items-center justify-center rounded-lg">
            <Badge variant="destructive" className="text-xl px-6 py-3">
              SIN EXISTENCIAS
            </Badge>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className={`relative flex flex-col ${className}`}>
      {/* Imagen principal (reserva espacio para miniaturas abajo) */}
      <div className="relative w-full h-full md:h-[calc(100%-80px)] rounded-lg overflow-hidden">

        <Image
          src={images[currentImage] || "/placeholder.svg"}
          alt={`${productName} - Imagen ${currentImage + 1}`}
          fill
          className="object-cover rounded-lg"
        />

        {!inStock && (
          <div className="absolute inset-0 bg-black bg-opacity-75 flex items-center justify-center rounded-lg">
            <Badge variant="destructive" className="text-xl px-6 py-3">
              SIN EXISTENCIAS
            </Badge>
          </div>
        )}

        {images.length > 1 && (
          <>
            <Button
              variant="ghost"
              size="sm"
              className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-75 text-white"
              onClick={prevImage}
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-75 text-white"
              onClick={nextImage}
            >
              <ChevronRight className="w-5 h-5" />
            </Button>
          </>
        )}

        {images.length > 1 && (
          <div className="absolute top-2 right-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-sm">
            {currentImage + 1} / {images.length}
          </div>
        )}
      </div>

      {/* Miniaturas sin scroll */}
      {images.length > 1 && (
        <div className="hidden md:flex gap-2 mt-2 pt-2 flex-wrap justify-center">
          {images.map((image, index) => (
            <button
              key={index}
              className={`w-16 h-16 rounded border-2 overflow-hidden ${index === currentImage ? "border-red-600" : "border-gray-300"
                }`}
              onClick={() => goToImage(index)}
            >
              <Image
                src={image || "/placeholder.svg"}
                alt={`${productName} - Miniatura ${index + 1}`}
                width={64}
                height={64}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}

    </div>
  )
}
