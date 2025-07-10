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

export function ProductImageCarousel({ images, productName, inStock, className = "" }: ProductImageCarouselProps) {
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

  if (images.length === 0) {
    return (
      <div className={`relative ${className}`}>
        <Image
          src="/placeholder.svg?height=400&width=400"
          alt={productName}
          width={400}
          height={400}
          className="w-full h-full object-cover rounded-lg"
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
    <div className={`relative ${className}`}>
      {/* Main Image */}
      <div className="relative">
        <Image
          src={images[currentImage] || "/placeholder.svg"}
          alt={`${productName} - Imagen ${currentImage + 1}`}
          width={600}
          height={600}
          className="w-full h-96 lg:h-[500px] object-cover rounded-lg"
        />
        {!inStock && (
          <div className="absolute inset-0 bg-black bg-opacity-75 flex items-center justify-center rounded-lg">
            <Badge variant="destructive" className="text-xl px-6 py-3">
              SIN EXISTENCIAS
            </Badge>
          </div>
        )}

        {/* Navigation Arrows - Only show if more than 1 image */}
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

        {/* Image Counter */}
        {images.length > 1 && (
          <div className="absolute top-2 right-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-sm">
            {currentImage + 1} / {images.length}
          </div>
        )}
      </div>

      {/* Thumbnail Navigation - Only show if more than 1 image */}
      {images.length > 1 && (
        <div className="flex space-x-2 mt-4 overflow-x-auto">
          {images.map((image, index) => (
            <button
              key={index}
              className={`flex-shrink-0 w-16 h-16 rounded border-2 overflow-hidden ${
                index === currentImage ? "border-red-600" : "border-gray-300"
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
