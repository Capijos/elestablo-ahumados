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

// Cambiar la función formatPrice para usar coma como separador de miles
const formatPrice = (price: number): string => {
  return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
}

// Datos de productos
const products = [
  {
    id: 1,
    name: "CHULETA AHUMADA DE CERDO X LIBRA",
    price: 16000.0,
    category: "CARNES",
    subcategory: "ANGUS USA",
    images: [
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRqmCzk9QeGapDlS4QNZBZa9g3WjaPgYaIyUQ&s",
      "https://meattown.shop/cdn/shop/files/A70FE16D-548B-4FFD-8BAB-7DAB01046DDA.jpg?v=1702441930",
      "https://st4.depositphotos.com/1000605/21794/i/450/depositphotos_217945722-stock-photo-smoked-pork-meat-wooden-background.jpg",
    ],

    inStock: true,
    sku: "CAR001",
    tags: ["Chuleta", "Ahumada", "Cerdo", "Premium"],
    rating: 5,
    description:
      "Chuleta de cerdo ahumada de primera calidad, perfecta para parrilla. Proceso de ahumado tradicional que le da un sabor único e irresistible.",
  },
  {
    id: 2,
    name: "LOMO DE CERDO AHUMADO IMPORTADO X LIBRA",
    price: 16000.0,
    category: "CARNES",
    subcategory: "ARGENTINA",
    images: [
      "https://media.falabella.com/tottusPE/40915745_1/w=800,h=800,fit=pad",
      "https://i0.wp.com/entreparrilleros.cl/wp-content/uploads/2024/05/lomo-cerdo-.jpg?fit=810%2C810&ssl=1",
    ],

    inStock: true,
    sku: "CAR003",
    tags: ["Lomo", "Cerdo", "Ahumado", "Importado"],
    rating: 5,
    description:
      "Lomo de cerdo ahumado importado, corte premium con sabor excepcional. Ideal para ocasiones especiales y parrilladas gourmet.",
  },
  {
    id: 3,
    name: "CHORIZO DE CERDO AHUMADO X LIBRA",
    price: 16000.0,
    category: "EMBUTIDOS Y FIAMBRES",
    subcategory: "CHORIZOS",
    images: [
      "https://chistorradenavarra.com/wp-content/uploads/%C2%BFQue%CC%81-es-un-chorizo-criollo.jpg",

    ],

    inStock: true,
    sku: "EMB002",
    tags: ["Chorizo", "Cerdo", "Ahumado", "Artesanal"],
    rating: 4,
    description:
      "Chorizo de cerdo ahumado artesanal, elaborado con especias selectas. Perfecto para acompañar cualquier parrillada con su sabor intenso.",
  },
  {
    id: 4,
    name: "CHORIZO DE POLLO AHUMADO X LIBRA",
    price: 16000.0,
    category: "EMBUTIDOS Y FIAMBRES",
    subcategory: "CHORIZOS",
    images: [
      "https://sofia.com.bo/wp-content/uploads/2021/06/136_chorizo_ahumado_a_granel_1.jpg",
      "https://piorico.com/wp-content/uploads/2020/08/chorizo-parrillero-ahumado-al-vacio2.jpg",
    ],

    inStock: true,
    sku: "EMB004",
    tags: ["Chorizo", "Pollo", "Ahumado", "Saludable"],
    rating: 5,
    description:
      "Chorizo de pollo ahumado, opción más saludable sin sacrificar sabor. Elaborado con pollo de primera calidad y proceso de ahumado tradicional.",
  },
  {
    id: 5,
    name: "COSTILLAS AHUMADAS DE CERDO X LIBRA",
    price: 16000.0,
    category: "CARNES",
    subcategory: "NACIONALES",
     images: [
      "https://cardiso.co/wp-content/uploads/2023/03/Costilla-de-Cerdo-Cardiso-scaled.jpg",
      "https://www.mundocarnico.com/wp-content/uploads/2021/12/COSTILLA-AHUMADA.png",
    ],

    inStock: true,
    sku: "CAR005",
    tags: ["Costillas", "Cerdo", "Ahumadas", "BBQ"],
    rating: 4,
    description:
      "Costillas de cerdo ahumadas, perfectas para BBQ. Carne tierna que se desprende del hueso, con sabor ahumado intenso y delicioso.",
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
    const checkIsMobile = () => {
      const newIsMobile = window.innerWidth < 768
      if (newIsMobile !== isMobile) {
        // Reset estados cuando cambia el tamaño de pantalla
        setMobileMenuOpen(false)
        setCartOpen(false)
        setShowSearchResults(false)
        setShowAllSearchResults(false)
        setShowContactForm(false)
        setShowCustomerForm(false)
      }
      setIsMobile(newIsMobile)
    }

    checkIsMobile()
    window.addEventListener("resize", checkIsMobile)

    return () => window.removeEventListener("resize", checkIsMobile)
  }, [isMobile])
 useEffect(() => {
    const checkIsMobile = () => {
      const mobile = window.innerWidth < 768
      setIsMobile(mobile)
    }

    checkIsMobile()
    window.addEventListener("resize", checkIsMobile)
    return () => window.removeEventListener("resize", checkIsMobile)
  }, [])
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
    const whatsappUrl = `https://wa.me/573224080321?text=${message}`
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
                        setSelectedCategory("CARNES")
                        setMobileMenuOpen(false)
                      }}
                      className="text-left hover:text-red-500 transition-colors text-lg"
                    >
                      CARNES
                    </button>
                    <button
                      onClick={() => {
                        setSelectedCategory("EMBUTIDOS Y FIAMBRES")
                        setMobileMenuOpen(false)
                      }}
                      className="text-left hover:text-red-500 transition-colors text-lg"
                    >
                      EMBUTIDOS
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
                <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-lg">LP</span>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold text-white">LA PARRITECA</div>
                  <div className="text-red-500 text-sm">Tienda</div>
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

        {/* Hero Section Mobile */}
        <HeroCarousel />

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

        {/* Breadcrumb y filtros */}
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
            onClick={() => window.open("https://wa.me/573224080321", "_blank")}
            className="bg-green-500 hover:bg-green-600 rounded-full w-14 h-14 shadow-lg"
          >
            <MessageCircle className="w-6 h-6" />
          </Button>
        </div>

        {/* Overlay para cerrar resultados de búsqueda */}
        {showSearchResults && <div className="fixed inset-0 z-40" onClick={() => setShowSearchResults(false)} />}
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
                  <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-lg">LP</span>
                  </div>
                  <span className="text-2xl font-bold">LA PARRITECA</span>
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
            onClick={() => window.open("https://wa.me/573224080321", "_blank")}
            className="bg-green-600 hover:bg-green-700 rounded-full w-14 h-14 shadow-lg"
          >
            <MessageCircle className="w-6 h-6" />
          </Button>
        </div>

        {/* Overlay para cerrar resultados de búsqueda */}
        {showSearchResults && <div className="fixed inset-0 z-40" onClick={() => setShowSearchResults(false)} />}
      </div>
    </div>
  )
}
