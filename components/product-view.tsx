"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, ShoppingCart, Check, Search, MessageCircle } from "lucide-react"
import { useState, useEffect } from "react"
import { ProductImageCarousel } from "@/components/product-image-carousel"
import { Input } from "@/components/ui/input"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import Image from "next/image"
import CustomerForm from "@/components/customer-form"

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



interface CartItem {
  id: number
  name: string
  price: number
  quantity: number
  image: string
}

interface ProductViewProps {
  product: Product
  onBack: () => void
  onAddToCart: (product: Product, quantity: number) => void
  cart?: CartItem[]
  cartTotal?: number
  cartItemsCount?: number
  onUpdateCartQuantity?: (id: number, newQuantity: number) => void
  onContinueOrder?: () => void
  onGoToProduct?: (product: Product) => void
  products?: Product[]
  formatPrice?: (price: number) => string
  showCustomerForm?: boolean
  onCloseCustomerForm?: () => void
  onSubmitOrder?: (customerData: any) => void
}

export function ProductView({
  product,
  onBack,
  onAddToCart,
  cart = [],
  cartTotal = 0,
  cartItemsCount = 0,
  onUpdateCartQuantity = () => { },
  onContinueOrder = () => { },
  onGoToProduct = () => { },
  products = [],
  formatPrice = (price: number) => price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","),
  showCustomerForm = false,
  onCloseCustomerForm = () => { },
  onSubmitOrder = () => { },
}: ProductViewProps) {
  const [quantity, setQuantity] = useState(1)
  const [showSuccess, setShowSuccess] = useState(false)
  const [isMobile, setIsMobile] = useState<boolean | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [cartOpen, setCartOpen] = useState(false)
  const [showSearchResults, setShowSearchResults] = useState(false)
  const [localShowCustomerForm, setLocalShowCustomerForm] = useState(false)

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkIsMobile()
    window.addEventListener("resize", checkIsMobile)
    return () => window.removeEventListener("resize", checkIsMobile)
  }, [])

  // Sincronizar el estado del formulario
  useEffect(() => {
    setLocalShowCustomerForm(showCustomerForm)
  }, [showCustomerForm])

  const handleAddToCart = () => {
    onAddToCart(product, quantity)
    setShowSuccess(true)
  }

  // Función local para manejar continuar pedido
  const handleLocalContinueOrder = () => {
    setCartOpen(false)
    setLocalShowCustomerForm(true)
    onContinueOrder() // También llamar la función del padre
  }

  // Función para cerrar el formulario
  const handleCloseCustomerForm = () => {
    setLocalShowCustomerForm(false)
    onCloseCustomerForm()
  }

  useEffect(() => {
    if (showSuccess) {
      const timer = setTimeout(() => {
        setShowSuccess(false)
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [showSuccess])

  const searchResults = products.filter((p) => p.name.toLowerCase().includes(searchTerm.toLowerCase())).slice(0, 5)

  if (isMobile === null) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-lg">LP</span>
          </div>
          <p className="text-gray-400">Cargando...</p>
        </div>
      </div>
    )
  }

  if (isMobile) {
    return (
      <div className="min-h-screen bg-black text-white">
        <header className="bg-black border-b border-gray-800 sticky top-0 z-40">
          <div className="px-4 py-3">
            <div className="flex items-center justify-between">
              <Button onClick={onBack} variant="ghost" size="sm" className="p-2">
                <ArrowLeft className="w-5 h-5 text-white" />
              </Button>

              <div className="flex items-center space-x-3">
                <a href="/">
                  <img
                    src="/logo.png"
                    alt="Logo El Establo Ahumados"
                    className="h-12 rounded-full object-cover"
                  />
                </a>

              </div>


              <Sheet open={cartOpen} onOpenChange={setCartOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" className="relative p-2">
                    <ShoppingCart className="w-5 h-5 text-white" />
                    {cartItemsCount > 0 && (
                      <Badge className="absolute -top-1 -right-1 bg-red-600 text-white text-xs px-1.5 py-0.5 min-w-[1.25rem] h-5">
                        {cartItemsCount}
                      </Badge>
                    )}
                  </Button>
                </SheetTrigger>
                <SheetContent className="w-full bg-white text-black">
                  <SheetHeader>
                    <SheetTitle>Carrito de Compras</SheetTitle>
                  </SheetHeader>
                  <div className="mt-6 space-y-4">
                    {cart.length === 0 ? (
                      <p className="text-gray-500 text-center py-8">Tu carrito está vacío</p>
                    ) : (
                      <>
                        {cart.map((item) => (
                          <div key={item.id} className="flex items-center space-x-3 p-3 border rounded-lg">
                            <Image
                              src={item.image || "/placeholder.svg"}
                              alt={item.name}
                              width={50}
                              height={50}
                              className="rounded"
                            />
                            <div className="flex-1">
                              <p className="font-medium text-sm">{item.name}</p>
                              <p className="text-green-600 font-bold">${formatPrice(item.price)}</p>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => onUpdateCartQuantity(item.id, item.quantity - 1)}
                              >
                                -
                              </Button>
                              <span className="w-8 text-center">{item.quantity}</span>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => onUpdateCartQuantity(item.id, item.quantity + 1)}
                              >
                                +
                              </Button>
                            </div>
                          </div>
                        ))}
                        <div className="border-t pt-4">
                          <div className="flex justify-between items-center mb-4">
                            <span className="font-bold text-lg">Total: ${formatPrice(cartTotal)}</span>
                          </div>
                          <Button onClick={handleLocalContinueOrder} className="w-full bg-green-600 hover:bg-green-700">
                            <MessageCircle className="w-4 h-4 mr-2" />
                            Continuar con pedido
                          </Button>
                        </div>
                      </>
                    )}
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </header>

        <div className="bg-gray-100 px-4 py-2 relative">
          <div className="flex items-center space-x-2">
            <Input
              type="text"
              placeholder="Buscar otros productos..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value)
                setShowSearchResults(e.target.value.length > 0)
              }}
              className="flex-1 bg-white text-black border-0 h-10"
            />
            <Button className="bg-red-600 hover:bg-red-700 px-3 py-2 h-10">
              <Search className="w-4 h-4" />
            </Button>
          </div>

          {showSearchResults && searchResults.length > 0 && (
            <div className="absolute top-full left-4 right-4 bg-white text-black mt-1 rounded-md shadow-lg z-50 max-h-60 overflow-y-auto">
              {searchResults.map((searchProduct) => (
                <div
                  key={searchProduct.id}
                  className="p-3 hover:bg-gray-100 cursor-pointer border-b border-gray-200 flex items-center space-x-3"
                  onClick={() => {
                    onGoToProduct(searchProduct)
                    setShowSearchResults(false)
                    setSearchTerm("")
                  }}
                >
                  <Image
                    src={searchProduct.images[0] || "/placeholder.svg"}
                    alt={searchProduct.name}
                    width={35}
                    height={35}
                    className="rounded"
                  />
                  <div className="flex-1">
                    <p className="font-medium text-xs">{searchProduct.name}</p>
                    <p className="text-green-600 font-bold text-sm">${formatPrice(searchProduct.price)}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {showSuccess && (
          <div className="fixed top-32 left-4 right-4 bg-gradient-to-r from-green-600 to-green-500 text-white px-4 py-3 rounded-xl shadow-2xl z-50 flex items-center space-x-2">
            <Check className="w-4 h-4" />
            <span className="text-sm font-medium">¡Agregado al carrito!</span>
          </div>
        )}

        {/* Contenido principal con padding bottom para el overlay */}
        <div className="p-4 space-y-4 pb-32">
          <div className="bg-gradient-to-br from-gray-800/30 to-gray-900/30 rounded-2xl p-3 backdrop-blur-sm border border-gray-700/30">
            <ProductImageCarousel
              images={product.images}
              productName={product.name}
              inStock={product.inStock}
              className="w-full h-64"
            />
          </div>

          <div className="bg-gradient-to-br from-gray-800/40 to-gray-900/40 rounded-2xl p-4 backdrop-blur-sm border border-gray-700/30 space-y-4">
            {/* Cabecera */}
            <div className="text-left space-y-3">
              <Badge className="bg-red-500/20 text-red-400 border-red-500/30 text-xs">{product.category}</Badge>
              <h2 className="text-lg font-bold text-white leading-tight">{product.name}</h2>
              <div className="flex items-center space-x-3">
                <span className="text-2xl font-bold bg-gradient-to-r from-green-400 to-green-300 bg-clip-text text-transparent">
                  ${formatPrice(product.price)}
                </span>
                {product.inStock && (
                  <Badge className="bg-green-500/20 text-green-400 border-green-500/30 text-xs">En Stock</Badge>
                )}
              </div>
            </div>


            {/* Detalles */}
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
              <span className="text-gray-400 block mb-2">Características</span>
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
              <span className="text-gray-400 block mb-2">Descripción</span>
              <p className="text-white text-sm leading-relaxed">{product.description}</p>
            </div>
          </div>

        </div>

        {/* Overlay fijo en la parte inferior para agregar al carrito */}
        {product.inStock && (
          <div className="fixed bottom-0 left-0 right-0 bg-black/95 backdrop-blur-sm border-t border-gray-700 p-4 z-50">
            <div className="flex flex-wrap items-center justify-between gap-4">
              {/* Selector de cantidad */}
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

              {/* Botón agregar al carrito */}
              <Button
                onClick={handleAddToCart}
                className="flex-1 min-w-[150px] bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 text-white h-12 text-base font-bold rounded-xl shadow-lg transition-all duration-300"
              >
                <ShoppingCart className="w-4 h-4 mr-2" />
                AÑADIR AL CARRITO
              </Button>
            </div>

            {/* Precio total */}
            <div className="text-center mt-2">
              <span className="text-white text-sm">
                Total: <span className="font-bold text-green-400">${formatPrice(product.price * quantity)}</span>
              </span>
            </div>
          </div>

        )}

        {/* Mensaje cuando no hay stock */}
        {!product.inStock && (
          <div className="fixed bottom-0 left-0 right-0 bg-black/95 backdrop-blur-sm border-t border-gray-700 p-4 z-50">
            <Button disabled className="w-full h-12 rounded-xl bg-gray-700 text-gray-400">
              Producto no disponible
            </Button>
          </div>
        )}

        {/* Botón flotante de WhatsApp - siempre visible */}
        <div className="fixed bottom-[7.2rem] right-4 z-50">
          <Button
            onClick={() => window.open("https://wa.me/573003408474", "_blank")}
            className="bg-green-500 hover:bg-green-600 rounded-full w-16 h-16 shadow-lg flex items-center justify-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 32 32"
              className="w-10 h-10 fill-white"
            >
              <path d="M16 2.933C8.82 2.933 2.933 8.82 2.933 16c0 2.767.738 5.428 2.137 7.778L2 30l6.423-2.016A13.007 13.007 0 0016 29.067C23.18 29.067 29.067 23.18 29.067 16S23.18 2.933 16 2.933zm0 23.467c-2.233 0-4.418-.638-6.302-1.85l-.45-.284-3.812 1.196 1.21-3.71-.294-.475C5.467 19.013 4.933 17.532 4.933 16c0-6.106 4.96-11.067 11.067-11.067S27.067 9.894 27.067 16 22.106 26.4 16 26.4zm6.098-8.19c-.33-.165-1.95-.96-2.254-1.07-.303-.11-.524-.165-.744.165s-.855 1.07-1.05 1.29-.39.248-.72.082c-.33-.165-1.398-.513-2.664-1.635-1-0.89-1.675-1.99-1.87-2.32s-.02-.495.146-.66c.15-.15.33-.39.495-.585.165-.198.22-.33.33-.55.11-.22.055-.413-.028-.578-.082-.165-.744-1.797-1.02-2.465-.27-.646-.544-.558-.744-.568l-.63-.012c-.22 0-.578.082-.88.385-.3.303-1.154 1.125-1.154 2.745s1.18 3.18 1.345 3.402c.165.22 2.32 3.542 5.63 4.964.788.34 1.403.544 1.882.696.79.252 1.51.217 2.077.132.633-.094 1.95-.795 2.227-1.563.275-.77.275-1.43.192-1.562-.082-.135-.3-.22-.63-.385z" />
            </svg>
          </Button>


        </div>

        {showSearchResults && <div className="fixed inset-0 z-40" onClick={() => setShowSearchResults(false)} />}

        {/* Formulario de datos del cliente */}
        {(showCustomerForm || localShowCustomerForm) && (
          <CustomerForm
            cart={cart}
            cartTotal={cartTotal}
            onClose={handleCloseCustomerForm}
            onSubmit={onSubmitOrder}
            formatPrice={formatPrice}
          />
        )}
      </div>
    )
  }

  // Vista desktop (sin cambios)
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
        <header className="bg-black border-b border-gray-800">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-8">
                <div className="flex items-center space-x-3">
                  <a href="/">
                    <img
                      src="/logo.png"
                      alt="Logo El Establo Ahumados"
                      className="h-12 rounded-full object-cover"
                    />
                  </a>

                </div>

                <nav className="flex space-x-8">
                  <button onClick={onBack} className="hover:text-red-500 transition-colors text-lg">
                    TIENDA
                  </button>
                  <button className="hover:text-red-500 transition-colors text-lg">CONTACTO</button>
                </nav>
              </div>

              <div className="flex items-center space-x-4">
                <div className="relative">
                  <div className="flex items-center">
                    <Input
                      type="text"
                      placeholder="Buscar productos..."
                      value={searchTerm}
                      onChange={(e) => {
                        setSearchTerm(e.target.value)
                        setShowSearchResults(e.target.value.length > 0)
                      }}
                      onFocus={() => setShowSearchResults(searchTerm.length > 0)}
                      className="w-64 bg-white text-black"
                    />
                    <Button size="sm" className="ml-2 bg-red-600 hover:bg-red-700">
                      <Search className="w-4 h-4" />
                    </Button>
                  </div>

                  {showSearchResults && searchResults.length > 0 && (
                    <div className="absolute top-full left-0 right-0 bg-white text-black mt-1 rounded-md shadow-lg z-50 max-h-80 overflow-y-auto">
                      {searchResults.map((searchProduct) => (
                        <div
                          key={searchProduct.id}
                          className="p-3 hover:bg-gray-100 cursor-pointer border-b border-gray-200 flex items-center space-x-3"
                          onClick={() => {
                            onGoToProduct(searchProduct)
                            setShowSearchResults(false)
                            setSearchTerm("")
                          }}
                        >
                          <Image
                            src={searchProduct.images[0] || "/placeholder.svg"}
                            alt={searchProduct.name}
                            width={40}
                            height={40}
                            className="rounded"
                          />
                          <div className="flex-1">
                            <p className="font-medium text-sm">{searchProduct.name}</p>
                            <p className="text-green-600 font-bold">${formatPrice(searchProduct.price)}</p>
                          </div>
                          {!searchProduct.inStock && (
                            <Badge variant="destructive" className="text-xs">
                              Sin stock
                            </Badge>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <Sheet open={cartOpen} onOpenChange={setCartOpen}>
                  <SheetTrigger asChild>
                    <Button variant="outline" className="relative bg-transparent">
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      CARRITO / ${formatPrice(cartTotal)}
                      {cartItemsCount > 0 && (
                        <Badge className="absolute -top-2 -right-2 bg-red-600 text-xs px-1 min-w-[1.25rem] h-5">
                          {cartItemsCount}
                        </Badge>
                      )}
                    </Button>
                  </SheetTrigger>
                  <SheetContent className="w-96">
                    <SheetHeader>
                      <SheetTitle>Carrito de Compras</SheetTitle>
                    </SheetHeader>
                    <div className="mt-6 space-y-4">
                      {cart.length === 0 ? (
                        <p className="text-gray-500 text-center py-8">Tu carrito está vacío</p>
                      ) : (
                        <>
                          {cart.map((item) => (
                            <div key={item.id} className="flex items-center space-x-3 p-3 border rounded-lg">
                              <Image
                                src={item.image || "/placeholder.svg"}
                                alt={item.name}
                                width={50}
                                height={50}
                                className="rounded"
                              />
                              <div className="flex-1">
                                <p className="font-medium text-sm">{item.name}</p>
                                <p className="text-green-600 font-bold">${formatPrice(item.price)}</p>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => onUpdateCartQuantity(item.id, item.quantity - 1)}
                                >
                                  -
                                </Button>
                                <span className="w-8 text-center">{item.quantity}</span>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => onUpdateCartQuantity(item.id, item.quantity + 1)}
                                >
                                  +
                                </Button>
                              </div>
                            </div>
                          ))}
                          <div className="border-t pt-4">
                            <div className="flex justify-between items-center mb-4">
                              <span className="font-bold text-lg">Total: ${formatPrice(cartTotal)}</span>
                            </div>
                            <Button
                              onClick={handleLocalContinueOrder}
                              className="w-full bg-green-600 hover:bg-green-700"
                            >
                              <MessageCircle className="w-4 h-4 mr-2" />
                              Continuar con pedido
                            </Button>
                          </div>
                        </>
                      )}
                    </div>
                  </SheetContent>
                </Sheet>
              </div>
            </div>
          </div>
        </header>

        <div className="container mx-auto px-4 py-4">
          <Button onClick={onBack} variant="outline" className="bg-transparent border-gray-600 hover:bg-gray-800/50">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver a la tienda
          </Button>
        </div>

        {showSuccess && (
          <div className="fixed top-20 right-6 bg-gradient-to-r from-green-600 to-green-500 text-white px-6 py-3 rounded-xl shadow-2xl z-50 flex items-center space-x-2">
            <Check className="w-5 h-5" />
            <span className="font-medium">¡Producto agregado al carrito!</span>
          </div>
        )}

        <div className="container mx-auto px-4 py-8">
          <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
            <div className="bg-gradient-to-br from-gray-900/40 to-black/40 rounded-2xl p-6 backdrop-blur-sm border border-gray-700/30">
              <ProductImageCarousel images={product.images} productName={product.name} inStock={product.inStock} className="h-full" />
            </div>

            <div className="space-y-6">
              <div className="bg-gradient-to-br from-gray-900/40 to-black/40 rounded-2xl p-6 backdrop-blur-sm border border-gray-700/30">
                <div className="space-y-4">
                  <Badge className="bg-red-500/20 text-red-400 border-red-500/30">{product.category}</Badge>
                  <h2 className="text-3xl font-bold text-white leading-tight">{product.name}</h2>
                  <div className="flex items-center space-x-4">
                    <span className="text-4xl font-bold bg-gradient-to-r from-green-400 to-green-300 bg-clip-text text-transparent">
                      ${formatPrice(product.price)}
                    </span>
                    {product.inStock && (
                      <Badge className="bg-green-500/20 text-green-400 border-green-500/30">En Stock</Badge>
                    )}
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-gray-900/40 to-black/40 rounded-2xl p-6 backdrop-blur-sm border border-gray-700/30 space-y-4">
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

                <div>
                  <span className="text-gray-400 block mb-2">Descripción</span>
                  <p className="text-white leading-relaxed">{product.description}</p>
                </div>
              </div>

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
                    Agregar al carrito - ${formatPrice(product.price * quantity)}
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

        {showSearchResults && <div className="fixed inset-0 z-40" onClick={() => setShowSearchResults(false)} />}
      </div>

      {/* Formulario de datos del cliente */}
      {(showCustomerForm || localShowCustomerForm) && (
        <CustomerForm
          cart={cart}
          cartTotal={cartTotal}
          onClose={handleCloseCustomerForm}
          onSubmit={onSubmitOrder}
          formatPrice={formatPrice}
        />
      )}
    </div>
  )
}
