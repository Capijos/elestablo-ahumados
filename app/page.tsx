"use client"

import { useState, useMemo, useEffect } from "react"
import Image from "next/image"
import { Search, ShoppingCart, MessageCircle, Plus, Minus, Menu, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { ContactSection } from "@/components/contact-section"
import { ProductView } from "@/components/product-view"
import { HeroCarousel } from "@/components/hero-carousel"
import { Footer } from "@/components/footer"
import CustomerForm from "@/components/customer-form"

// Cambiar la función formatPrice para usar coma como separador de miles
const formatPrice = (price: number): string => {
  return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
}

// Datos de productos
const products = [
  {
    id: 1,
    name: "CHULETA AHUMADA DE CERDO X LIBRA",
    price: 16500.0,
    category: "CARNES",
    subcategory: "ANGUS USA",
    images: [
      "/chuleta.jpg",
     ],

    inStock: true,
    sku: "CAR001",
    tags: ["Chuleta", "Ahumada", "Cerdo", "Premium"],
    rating: 5,
    description:
      "Nuestra chuleta de cerdo ahumada por 72 horas es un corte de carne de cerdo que ha sido sometido a un proceso de ahumado prolongado para intensificar su sabor y textura, este tipo de chuleta proviene de la costilla del cerdo y, tras el ahumado, adquiere un color rosado característico y un sabor ahumado unico con nuestra salmuera.",

  },
  {
    id: 2,
    name: "LOMO DE CERDO AHUMADO IMPORTADO X LIBRA",
    price: 16500.0,
    category: "CARNES",
    subcategory: "ARGENTINA",
    images: [
      "/lomo.jpg",
     ],

    inStock: true,
    sku: "CAR003",
    tags: ["Lomo", "Cerdo", "Ahumado", "Importado"],
    rating: 5,
    description:
      "Nuestra lomo de cerdo ahumado por 72 horas es un corte de carne de cerdo que ha sido sometido a un proceso de ahumado prolongado para intensificar su sabor y textura, este tipo de carne proviene  de la parte superior de la espalda justo debajo de las costillas, tras el ahumado, adquiere un color rosado característico y un sabor ahumado único con nuestra salmuera.",
  },
  {
    id: 3,
    name: "CHORIZO DE CERDO AHUMADO X LIBRA",
    price: 14500.0,
    category: "EMBUTIDOS Y FIAMBRES",
    subcategory: "CHORIZOS",
    images: [
      "/chorizo.jpg",

    ],

    inStock: true,
    sku: "EMB002",
    tags: ["Chorizo", "Cerdo", "Ahumado", "Artesanal"],
    rating: 4,
    description:
      "Nuestro chorizo cerdo ahumado por 72 horas es un producto que ha sido sometido a un proceso de ahumado prolongado para intensificar su sabor y textura, que le da este color y sabor único.",

  },
 
  {
    id: 5,
    name: "COSTILLAS AHUMADAS DE CERDO X LIBRA",
    price: 16500.0,
    category: "CARNES",
    subcategory: "NACIONALES",
    images: [
      "/costillas.jpg",
    ],

    inStock: true,
    sku: "CAR005",
    tags: ["Costillas", "Cerdo", "Ahumadas", "BBQ"],
    rating: 4,
    description:
      "Nuestra costillas de cerdo ahumada por 72 horas es un corte de carne de cerdo que ha sido sometido a un proceso de ahumado prolongado para intensificar su sabor y textura, este tipo de carne proviene de la costilla del cerdo y, tras el ahumado, adquiere un color rosado característico y un sabor ahumado unico con nuestra salmuera.",

  },

  {
    id: 6,
    name: "TOCINETA AHUMADA X LIBRA",
    price: 14000.0,
    category: "CARNES",
    subcategory: "NACIONALES",
    images: [
      "/tocino.jpg",
    ],

    inStock: true,
    sku: "CAR006",
    tags: ["Tocino", "Cerdo", "Ahumadas"],
    rating: 4,
    description:
      "Nuestro tocino a sido sometido a un proceso de ahumado prolongado para intensificar su sabor y textura.",

  },

  {
    id: 7,
    name: "JAMON AHUMADO X LIBRA",
    price: 15000.0,
    category: "JAMON",
    subcategory: "NACIONALES",
    images: [
      "/jamon.jpg",
    ],

    inStock: true,
    sku: "CAR007",
    tags: ["Jamon", "Cerdo", "Ahumadas", "BBQ"],
    rating: 4,
    description:
      "Nuestra jamon ahumado por 72 horas es un corte que ha sido sometido a un proceso de ahumado prolongado para intensificar su sabor y textura.",

  },

]

const categories = [
  { name: "CARNES", count: 19, image: "/placeholder.svg?height=300&width=300" },
  { name: "EMBUTIDOS Y FIAMBRES", count: 14, image: "/placeholder.svg?height=300&width=300" },
  { name: "ACHURAS", count: 4, image: "/placeholder.svg?height=300&width=300" },
  { name: "CARBON, SAL Y SALSAS", count: 15, image: "/placeholder.svg?height=300&width=300" },
]

interface CartItem {
  id: number
  name: string
  price: number
  quantity: number
  image: string
}

export default function LaParritecaStore() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [cart, setCart] = useState<CartItem[]>([])
  const [showSearchResults, setShowSearchResults] = useState(false)
  const [showContactForm, setShowContactForm] = useState(false)
  const [showCustomerForm, setShowCustomerForm] = useState(false)
  const [showAllSearchResults, setShowAllSearchResults] = useState(false)
  const [cartOpen, setCartOpen] = useState(false)
  const [sortBy, setSortBy] = useState("popularity")
  const [isMobile, setIsMobile] = useState(false)
  const [customerData, setCustomerData] = useState({
    name: "",
    phone: "",
    region: "",
    comuna: "",
    address: "",
    notes: "",
  })
  const [selectedProduct, setSelectedProduct] = useState<(typeof products)[0] | null>(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  // Detectar si es móvil

  useEffect(() => {
    const mql = window.matchMedia("(max-width: 767px)")

    const handleResize = () => {
      const mobile = mql.matches
      setIsMobile(mobile)

      // Reset solo si cambia el modo
      setMobileMenuOpen(false)
      setCartOpen(false)
      setShowSearchResults(false)
      setShowAllSearchResults(false)
      setShowContactForm(false)
      setShowCustomerForm(false)
    }

    handleResize() // Inicial

    mql.addEventListener("change", handleResize)

    return () => {
      mql.removeEventListener("change", handleResize)
    }
  }, [])
  const handleCloseCustomerForm = () => {
    setShowCustomerForm(false)
  }

  // Limpiar estados cuando cambia entre móvil y desktop
  useEffect(() => {
    setMobileMenuOpen(false)
    setCartOpen(false)
    setShowSearchResults(false)
    setShowAllSearchResults(false)
  }, [isMobile])

  // Filtrar productos basado en búsqueda y categoría
  const filteredProducts = useMemo(() => {
    let filtered = products

    if (searchTerm) {
      filtered = filtered.filter((product) => product.name.toLowerCase().includes(searchTerm.toLowerCase()))
    }

    if (selectedCategory) {
      filtered = filtered.filter((product) => product.category === selectedCategory)
    }

    // Ordenar productos
    if (sortBy === "price-low") {
      filtered = filtered.sort((a, b) => a.price - b.price)
    } else if (sortBy === "price-high") {
      filtered = filtered.sort((a, b) => b.price - a.price)
    } else if (sortBy === "name") {
      filtered = filtered.sort((a, b) => a.name.localeCompare(b.name))
    }

    return filtered
  }, [searchTerm, selectedCategory, sortBy])

  // Productos para mostrar en búsqueda (máximo 5)
  const searchResults = useMemo(() => {
    if (!searchTerm) return []
    return filteredProducts.slice(0, 5)
  }, [filteredProducts, searchTerm])

  // Calcular total del carrito
  const cartTotal = cart.reduce((total, item) => total + item.price * item.quantity, 0)
  const cartItemsCount = cart.reduce((total, item) => total + item.quantity, 0)

  // Agregar producto al carrito
  const addToCart = (product: (typeof products)[0]) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === product.id)
      if (existingItem) {
        return prevCart.map((item) => (item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item))
      } else {
        return [
          ...prevCart,
          {
            id: product.id,
            name: product.name,
            price: product.price,
            quantity: 1,
            image: product.images[0],
          },
        ]
      }
    })
  }

  // Agregar producto al carrito con cantidad específica
  const addToCartWithQuantity = (product: (typeof products)[0], quantity: number) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === product.id)
      if (existingItem) {
        return prevCart.map((item) => (item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item))
      } else {
        return [
          ...prevCart,
          {
            id: product.id,
            name: product.name,
            price: product.price,
            quantity: quantity,
            image: product.images[0],
          },
        ]
      }
    })
  }

  // Actualizar cantidad en carrito
  const updateCartQuantity = (id: number, newQuantity: number) => {
    if (newQuantity === 0) {
      setCart((prevCart) => prevCart.filter((item) => item.id !== id))
    } else {
      setCart((prevCart) => prevCart.map((item) => (item.id === id ? { ...item, quantity: newQuantity } : item)))
    }
  }

  // Generar mensaje de WhatsApp
  const generateWhatsAppMessage = (customerData: any) => {
    let message = `¡Hola! Soy ${customerData.name} y me gustaría hacer el siguiente pedido:\n\n`
    message += `📍 *Dirección:* ${customerData.address}\n`
    message += `🏙️ *Región:* ${customerData.region}\n`
    message += `📍 *Comuna:* ${customerData.comuna}\n`
    message += `📱 *Teléfono:* ${customerData.phone}\n\n`
    message += `*PRODUCTOS:*\n`
    cart.forEach((item) => {
      message += `• ${item.name} - Cantidad: ${item.quantity} - $${formatPrice(item.price * item.quantity)}\n`
    })
    message += `\n💰 *Total: $${formatPrice(cartTotal)}*`
    if (customerData.notes) {
      message += `\n\n📝 *Notas:* ${customerData.notes}`
    }
    return encodeURIComponent(message)
  }

  // Enviar pedido por WhatsApp
  const sendWhatsAppOrder = (customerData: any) => {
    const message = generateWhatsAppMessage(customerData)
    const whatsappUrl = `https://wa.me/573003408474?text=${message}`
    window.open(whatsappUrl, "_blank")
    setShowCustomerForm(false)
    setCart([]) // Limpiar carrito después del pedido
  }

  // Continuar con pedido - asegurar que siempre funcione
  const handleContinueOrder = () => {
    setCartOpen(false)
    setShowCustomerForm(true)
    // Asegurar que otros overlays no interfieran
    setShowSearchResults(false)
    setShowAllSearchResults(false)
    setShowContactForm(false)
    setMobileMenuOpen(false)

    // Forzar actualización del estado
    setTimeout(() => {
      setShowCustomerForm(true)
    }, 100)
  }


  // Función para ir a producto desde búsqueda
  const goToProduct = (product: (typeof products)[0]) => {
    setSelectedProduct(product)
    setShowSearchResults(false)
    setSearchTerm("")
  }

  // Si hay un producto seleccionado, mostrar la vista del producto
  if (selectedProduct) {
    return (
      <ProductView
        product={selectedProduct}
        onBack={() => setSelectedProduct(null)}
        onAddToCart={addToCartWithQuantity}
        cart={cart}
        cartTotal={cartTotal}
        cartItemsCount={cartItemsCount}
        onUpdateCartQuantity={updateCartQuantity}
        onContinueOrder={handleContinueOrder}
        onGoToProduct={goToProduct}
        products={products}
        formatPrice={formatPrice}
        showCustomerForm={showCustomerForm}
        onCloseCustomerForm={() => setShowCustomerForm(false)}
        onSubmitOrder={sendWhatsAppOrder}
      />
    )
  }

  // Vista móvil
  if (isMobile) {
    return (
      <div className="min-h-screen bg-black text-white">
        {/* Header Mobile */}
        <header className="bg-black border-b border-gray-800 sticky top-0 z-40">
          <div className="px-4 py-4">
            <div className="flex items-center justify-between">
              {/* Menu hamburguesa */}
              <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="sm" className="p-2">
                    <Menu className="w-6 h-6 text-white" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="bg-black text-white">
                  <div className="flex flex-col space-y-6 mt-8">
                    <button
                      onClick={() => {
                        setSelectedCategory(null)
                        setMobileMenuOpen(false)
                      }}
                      className="text-left hover:text-red-500 transition-colors text-lg"
                    >
                      INICIO
                    </button>
                   
                    
                    <button
                      onClick={() => {
                        setShowContactForm(true)
                        setMobileMenuOpen(false)
                      }}
                      className="text-left hover:text-red-500 transition-colors text-lg"
                    >
                      CONTACTO
                    </button>
                  </div>
                </SheetContent>
              </Sheet>

              {/* Logo centrado */}
              <div className="absolute left-1/2 transform -translate-x-1/2 flex items-center space-x-3">
                <div className="flex items-center space-x-3">
                  <a href="/">
                    <img
                      src="/logo.png"
                      alt="Logo El Establo Ahumados"
                      className="h-12 rounded-full object-cover"
                    />
                  </a>

                </div>

              </div>

              {/* Carrito */}
              <Sheet open={cartOpen} onOpenChange={setCartOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" className="relative p-2">
                    <ShoppingCart className="w-6 h-6 text-white" />
                    {cartItemsCount > 0 && (
                      <Badge className="absolute -top-1 -right-1 bg-red-600 text-white text-xs px-2 py-1 min-w-[1.5rem] h-6">
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
                                onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                              >
                                <Minus className="w-3 h-3" />
                              </Button>
                              <span className="w-8 text-center">{item.quantity}</span>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                              >
                                <Plus className="w-3 h-3" />
                              </Button>
                            </div>
                          </div>
                        ))}
                        <div className="border-t pt-4">
                          <div className="flex justify-between items-center mb-4">
                            <span className="font-bold text-lg">Total: ${formatPrice(cartTotal)}</span>
                          </div>
                          <Button onClick={handleContinueOrder} className="w-full bg-green-600 hover:bg-green-700">
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
        {/* Barra de búsqueda separada */}
        <div className="bg-gray-100 px-4 py-3 relative">
          <div className="flex items-center space-x-2">
            <Input
              type="text"
              placeholder="Buscar..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value)
                setShowSearchResults(e.target.value.length > 0)
                setShowAllSearchResults(false)
              }}
              onFocus={() => setShowSearchResults(searchTerm.length > 0)}
              className="flex-1 bg-white text-black border-0 rounded-none h-12"
            />
            <Button
              className="bg-red-600 hover:bg-red-700 px-4 py-3 rounded-none h-12"
              onClick={() => {
                if (searchTerm) {
                  setShowAllSearchResults(true)
                  setShowSearchResults(false)
                }
              }}
            >
              <Search className="w-5 h-5" />
            </Button>
          </div>

          {/* Resultados de búsqueda móvil */}
          {showSearchResults && searchResults.length > 0 && (
            <div className="absolute top-full left-4 right-4 bg-white text-black mt-1 rounded-md shadow-lg z-50 max-h-80 overflow-y-auto">
              {searchResults.map((product) => (
                <div
                  key={product.id}
                  className="p-3 hover:bg-gray-100 cursor-pointer border-b border-gray-200 flex items-center space-x-3"
                  onClick={() => goToProduct(product)}
                >
                  <Image
                    src={product.images[0] || "/placeholder.svg"}
                    alt={product.name}
                    width={40}
                    height={40}
                    className="rounded"
                  />
                  <div className="flex-1">
                    <p className="font-medium text-sm">{product.name}</p>
                    <p className="text-green-600 font-bold">${formatPrice(product.price)}</p>
                  </div>
                  {!product.inStock && (
                    <Badge variant="destructive" className="text-xs">
                      Sin stock
                    </Badge>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
        {/* Hero Section Mobile */}
        <HeroCarousel />



        {/* Breadcrumb y filtros 
        <div className="bg-black px-4 py-4 border-b border-gray-800">
          <div className="text-center mb-4">
            <span className="text-gray-400">INICIO</span>
            {selectedCategory && (
              <>
                <span className="text-gray-400 mx-2">/</span>
                <span className="text-white font-bold">{selectedCategory}</span>
              </>
            )}
          </div>

          <div className="flex items-center justify-center mb-4">
            <Filter className="w-4 h-4 mr-2" />
            <span className="font-bold">BUSCAR</span>
          </div>

          <div className="max-w-xs mx-auto">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full bg-white text-black px-4 py-3 border-0 text-center"
            >
              <option value="popularity">Ordenar por popularidad</option>
              <option value="price-low">Precio: menor a mayor</option>
              <option value="price-high">Precio: mayor a menor</option>
              <option value="name">Ordenar por nombre</option>
            </select>
          </div>
        </div>
        */}
        {/* Productos */}
        <div className="px-4 py-6">
          <div className="grid grid-cols-2 gap-4">
            {(showAllSearchResults ? filteredProducts : selectedCategory ? filteredProducts : products).map(
              (product) => (
                <Card key={product.id} className="bg-black border-gray-800 overflow-hidden">
                  <CardContent className="p-0">
                    <div className="cursor-pointer" onClick={() => setSelectedProduct(product)}>
                      <div className="relative">
                        <Image
                          src={product.images[0] || "/placeholder.svg"}
                          alt={product.name}
                          width={200}
                          height={200}
                          className="w-full h-40 object-cover"
                        />
                        {!product.inStock && (
                          <div className="absolute inset-0 bg-black bg-opacity-10 flex items-center justify-center">
                            <div className="bg-white text-black px-4 py-2 font-bold text-sm">SIN EXISTENCIAS</div>
                          </div>
                        )}
                      </div>
                      <div className="p-3">
                        {/* Tag arriba del nombre */}
                        {product.subcategory && (
                          <div className="text-gray-400 text-xs font-medium mb-1 uppercase">{product.subcategory}</div>
                        )}
                        <h3 className="font-bold text-sm mb-2 text-white leading-tight">{product.name}</h3>
                        <p className="text-white font-bold text-lg mt-2">${formatPrice(product.price)}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ),
            )}
          </div>
        </div>

        {/* Footer */}
        <Footer />

        {/* Sección de contacto */}
        {showContactForm && <ContactSection onClose={() => setShowContactForm(false)} />}

        {/* Botón flotante de WhatsApp */}
        <div className="fixed bottom-6 right-6 z-50">
          <Button
            onClick={() => window.open("https://wa.me/573003408474", "_blank")}
            className="bg-green-500 hover:bg-green-600 rounded-full w-14 h-14 shadow-lg flex items-center justify-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 32 32"
              className="w-8 h-8 fill-white"
            >
              <path d="M16 2.933C8.82 2.933 2.933 8.82 2.933 16c0 2.767.738 5.428 2.137 7.778L2 30l6.423-2.016A13.007 13.007 0 0016 29.067C23.18 29.067 29.067 23.18 29.067 16S23.18 2.933 16 2.933zm0 23.467c-2.233 0-4.418-.638-6.302-1.85l-.45-.284-3.812 1.196 1.21-3.71-.294-.475C5.467 19.013 4.933 17.532 4.933 16c0-6.106 4.96-11.067 11.067-11.067S27.067 9.894 27.067 16 22.106 26.4 16 26.4zm6.098-8.19c-.33-.165-1.95-.96-2.254-1.07-.303-.11-.524-.165-.744.165s-.855 1.07-1.05 1.29-.39.248-.72.082c-.33-.165-1.398-.513-2.664-1.635-1-0.89-1.675-1.99-1.87-2.32s-.02-.495.146-.66c.15-.15.33-.39.495-.585.165-.198.22-.33.33-.55.11-.22.055-.413-.028-.578-.082-.165-.744-1.797-1.02-2.465-.27-.646-.544-.558-.744-.568l-.63-.012c-.22 0-.578.082-.88.385-.3.303-1.154 1.125-1.154 2.745s1.18 3.18 1.345 3.402c.165.22 2.32 3.542 5.63 4.964.788.34 1.403.544 1.882.696.79.252 1.51.217 2.077.132.633-.094 1.95-.795 2.227-1.563.275-.77.275-1.43.192-1.562-.082-.135-.3-.22-.63-.385z" />
            </svg>
          </Button>

        </div>

        {/* Overlay para cerrar resultados de búsqueda */}
        {showSearchResults && <div className="fixed inset-0 z-40" onClick={() => setShowSearchResults(false)} />}

        {/* Formulario de datos del cliente */}
        {(showCustomerForm) && (
          <CustomerForm
            cart={cart}
            cartTotal={cartTotal}
            onClose={handleCloseCustomerForm}
            onSubmit={sendWhatsAppOrder}
            formatPrice={formatPrice}
          />
        )}
      </div>
    )
  }

  // Vista Desktop
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
        {/* Header Desktop */}
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
                  <button
                    onClick={() => setSelectedCategory(null)}
                    className="hover:text-red-500 transition-colors text-lg"
                  >
                    TIENDA
                  </button>
                  <button
                    onClick={() => setShowContactForm(true)}
                    className="hover:text-red-500 transition-colors text-lg"
                  >
                    CONTACTO
                  </button>
                </nav>
              </div>

              <div className="flex items-center space-x-4">
                {/* Buscador Desktop */}
                <div className="relative">
                  <div className="flex items-center">
                    <Input
                      type="text"
                      placeholder="Buscar productos..."
                      value={searchTerm}
                      onChange={(e) => {
                        setSearchTerm(e.target.value)
                        setShowSearchResults(e.target.value.length > 0)
                        setShowAllSearchResults(false)
                      }}
                      onFocus={() => setShowSearchResults(searchTerm.length > 0)}
                      onKeyPress={(e) => {
                        if (e.key === "Enter") {
                          setShowAllSearchResults(true)
                          setShowSearchResults(false)
                        }
                      }}
                      className="w-64 bg-white text-black"
                    />
                    <Button
                      size="sm"
                      className="ml-2 bg-red-600 hover:bg-red-700"
                      onClick={() => {
                        if (searchTerm) {
                          setShowAllSearchResults(true)
                          setShowSearchResults(false)
                        }
                      }}
                    >
                      <Search className="w-4 h-4" />
                    </Button>
                  </div>

                  {/* Resultados de búsqueda */}
                  {showSearchResults && searchResults.length > 0 && (
                    <div className="absolute top-full left-0 right-0 bg-white text-black mt-1 rounded-md shadow-lg z-50 max-h-80 overflow-y-auto">
                      {searchResults.map((product) => (
                        <div
                          key={product.id}
                          className="p-3 hover:bg-gray-100 cursor-pointer border-b border-gray-200 flex items-center space-x-3"
                          onClick={() => goToProduct(product)}
                        >
                          <Image
                            src={product.images[0] || "/placeholder.svg"}
                            alt={product.name}
                            width={40}
                            height={40}
                            className="rounded"
                          />
                          <div className="flex-1">
                            <p className="font-medium text-sm">{product.name}</p>
                            <p className="text-green-600 font-bold">${formatPrice(product.price)}</p>
                          </div>
                          {!product.inStock && (
                            <Badge variant="destructive" className="text-xs">
                              Sin stock
                            </Badge>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Carrito Desktop */}
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
                                  onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                                >
                                  <Minus className="w-3 h-3" />
                                </Button>
                                <span className="w-8 text-center">{item.quantity}</span>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                                >
                                  <Plus className="w-3 h-3" />
                                </Button>
                              </div>
                            </div>
                          ))}
                          <div className="border-t pt-4">
                            <div className="flex justify-between items-center mb-4">
                              <span className="font-bold text-lg">Total: ${formatPrice(cartTotal)}</span>
                            </div>
                            <Button onClick={handleContinueOrder} className="w-full bg-green-600 hover:bg-green-700">
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

        {/* Hero Section Desktop */}
        <HeroCarousel />

        {/* Productos Desktop */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-2 text-white">
                {showAllSearchResults && searchTerm
                  ? `RESULTADOS PARA "${searchTerm}"`
                  : selectedCategory
                    ? selectedCategory
                    : "TODOS LOS PRODUCTOS DISPONIBLES"}
              </h2>
              <p className="text-gray-400">
                {showAllSearchResults && searchTerm
                  ? `${filteredProducts.length} productos encontrados`
                  : "CATÁLOGO COMPLETO"}
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {(showAllSearchResults ? filteredProducts : selectedCategory ? filteredProducts : products).map(
                (product) => (
                  <Card key={product.id} className="bg-gray-900 border-gray-700 overflow-hidden flex flex-col h-full">
                    <CardContent className="p-0 flex flex-col h-full">
                      <div className="cursor-pointer flex-1 flex flex-col" onClick={() => setSelectedProduct(product)}>
                        <div className="relative">
                          <Image
                            src={product.images[0] || "/placeholder.svg"}
                            alt={product.name}
                            width={300}
                            height={200}
                            className="w-full h-48 object-cover"
                          />
                          {!product.inStock && (
                            <div className="absolute inset-0 bg-black bg-opacity-10 flex items-center justify-center">
                              <Badge variant="destructive">SIN EXISTENCIAS</Badge>
                            </div>
                          )}
                        </div>
                        <div className="p-4 flex-1 flex flex-col">
                          {/* Tag arriba del nombre */}
                          {product.subcategory && (
                            <div className="text-gray-400 text-xs font-medium mb-2 uppercase tracking-wide">
                              {product.subcategory}
                            </div>
                          )}
                          <h3 className="font-bold text-sm mb-3 text-white leading-tight flex-1">{product.name}</h3>
                          <p className="text-green-400 font-bold text-lg mb-4">${formatPrice(product.price)}</p>
                        </div>
                      </div>
                      <div className="px-4 pb-4 mt-auto">
                        <Button
                          onClick={(e) => {
                            e.stopPropagation()
                            addToCart(product)
                          }}
                          disabled={!product.inStock}
                          className="w-full bg-red-600 hover:bg-red-700 disabled:bg-gray-600 h-11 font-semibold"
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Agregar al carrito
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ),
              )}
            </div>
          </div>
        </section>

        {/* Footer */}
        <Footer />

        {/* Sección de contacto */}
        {showContactForm && <ContactSection onClose={() => setShowContactForm(false)} />}

        {/* Botón flotante de WhatsApp */}
        <div className="fixed bottom-6 right-6 z-50">
          <Button
            onClick={() => window.open("https://wa.me/573003408474", "_blank")}
            className="bg-green-500 hover:bg-green-600 rounded-full w-14 h-14 shadow-lg flex items-center justify-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 32 32"
              className="w-8 h-8 fill-white"
            >
              <path d="M16 2.933C8.82 2.933 2.933 8.82 2.933 16c0 2.767.738 5.428 2.137 7.778L2 30l6.423-2.016A13.007 13.007 0 0016 29.067C23.18 29.067 29.067 23.18 29.067 16S23.18 2.933 16 2.933zm0 23.467c-2.233 0-4.418-.638-6.302-1.85l-.45-.284-3.812 1.196 1.21-3.71-.294-.475C5.467 19.013 4.933 17.532 4.933 16c0-6.106 4.96-11.067 11.067-11.067S27.067 9.894 27.067 16 22.106 26.4 16 26.4zm6.098-8.19c-.33-.165-1.95-.96-2.254-1.07-.303-.11-.524-.165-.744.165s-.855 1.07-1.05 1.29-.39.248-.72.082c-.33-.165-1.398-.513-2.664-1.635-1-0.89-1.675-1.99-1.87-2.32s-.02-.495.146-.66c.15-.15.33-.39.495-.585.165-.198.22-.33.33-.55.11-.22.055-.413-.028-.578-.082-.165-.744-1.797-1.02-2.465-.27-.646-.544-.558-.744-.568l-.63-.012c-.22 0-.578.082-.88.385-.3.303-1.154 1.125-1.154 2.745s1.18 3.18 1.345 3.402c.165.22 2.32 3.542 5.63 4.964.788.34 1.403.544 1.882.696.79.252 1.51.217 2.077.132.633-.094 1.95-.795 2.227-1.563.275-.77.275-1.43.192-1.562-.082-.135-.3-.22-.63-.385z" />
            </svg>
          </Button>

        </div>

        {/* Overlay para cerrar resultados de búsqueda */}
        {showSearchResults && <div className="fixed inset-0 z-40" onClick={() => setShowSearchResults(false)} />}
      </div>
      {/* Formulario de datos del cliente */}
      {(showCustomerForm) && (
        <CustomerForm
          cart={cart}
          cartTotal={cartTotal}
          onClose={handleCloseCustomerForm}
          onSubmit={sendWhatsAppOrder}
          formatPrice={formatPrice}
        />
      )}
    </div>
  )
}
