"use client"

import { useState, useMemo } from "react"
import Image from "next/image"
import { Search, ShoppingCart, MessageCircle, Plus, Minus, X, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { CustomerForm } from "@/components/customer-form"
import { ContactSection } from "@/components/contact-section"
import { ProductView } from "@/components/product-view"
import { HeroCarousel } from "@/components/hero-carousel"

// Datos de productos
const products = [
  {
    id: 1,
    name: "CHULETA AHUMADA DE CERDO X LIBRA",
    price: 16000.0,
    category: "CARNES",
    images: [
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRqmCzk9QeGapDlS4QNZBZa9g3WjaPgYaIyUQ&s",
      "https://meattown.shop/cdn/shop/files/A70FE16D-548B-4FFD-8BAB-7DAB01046DDA.jpg?v=1702441930",
      "https://st4.depositphotos.com/1000605/21794/i/450/depositphotos_217945722-stock-photo-smoked-pork-meat-wooden-background.jpg",
    ],
    inStock: true,
    sku: "CAR001",
    tags: ["Cerdo", "Premium", "USA"],
    description:
      "Nuestra chuleta de cerdo ahumada por 72 horas es un corte de carne de cerdo que ha sido sometido a un proceso de ahumado prolongado para intensificar su sabor y textura, este tipo de chuleta proviene de la costilla del cerdo y, tras el ahumado, adquiere un color rosado característico y un sabor ahumado unico con nuestra salmuera.",
  },
  {
    id: 2,
    name: "LOMO DE CERDO AHUMADO IMPORTADO X LIBRA",
    price: 16000.0,
    category: "CARNES",
    images: [
      "https://media.falabella.com/tottusPE/40915745_1/w=800,h=800,fit=pad",
      "https://i0.wp.com/entreparrilleros.cl/wp-content/uploads/2024/05/lomo-cerdo-.jpg?fit=810%2C810&ssl=1",
    ],
    inStock: true,
    sku: "EMB002",
    tags: ["Cerdo", "Lomo", "Finas Hierbas", "Artesanal"],
    description:
      "Nuestra lomo de cerdo ahumado por 72 horas es un corte de carne de cerdo que ha sido sometido a un proceso de ahumado prolongado para intensificar su sabor y textura, este tipo de carne proviene  de la parte superior de la espalda justo debajo de las costillas, tras el ahumado, adquiere un color rosado característico y un sabor ahumado único con nuestra salmuera.",
  },
  {
    id: 3,
    name: "CHORIZO DE CERDO AHUMADO X LIBRA",
    price: 16000.0,
    category: "EMBUTIDOS Y FIAMBRES",
    images: [
      "https://chistorradenavarra.com/wp-content/uploads/%C2%BFQue%CC%81-es-un-chorizo-criollo.jpg",
     
    ],
    inStock: true,
    sku: "CAR003",
    tags: ["Chorizo", "Cerdo", "Premium", "Parrilla"],
    description:
      "Nuestro chorizo cerdo ahumado por 72 horas es un producto que ha sido sometido a un proceso de ahumado prolongado para intensificar su sabor y textura, que le da este color y sabor único.",
  },
  {
    id: 4,
    name: "CHORIZO DE POLLO AHUMADO X LIBRA",
    price: 16000.0,
    category: "EMBUTIDOS Y FIAMBRES",
    images: [
      "https://sofia.com.bo/wp-content/uploads/2021/06/136_chorizo_ahumado_a_granel_1.jpg",
      "https://piorico.com/wp-content/uploads/2020/08/chorizo-parrillero-ahumado-al-vacio2.jpg",
    ],
    inStock: true,
    sku: "EMB004",
    tags: ["Chorizo", "Premium", "Embutido", "Parrilla"],
    description:
      "Nuestro chorizo de pollo ahumado por 72 horas, es un producto único en colombia atrevete a probarlo lo mejor de lo mejor parce.",
  },
  {
    id: 5,
    name: "COSTILLAS AHUMADAS DE CERDO X LIBRA",
    price: 16000.0,
    category: "CARNES",
    images: [
      "https://cardiso.co/wp-content/uploads/2023/03/Costilla-de-Cerdo-Cardiso-scaled.jpg",
      "https://www.mundocarnico.com/wp-content/uploads/2021/12/COSTILLA-AHUMADA.png",
    ],
    inStock: true,
    sku: "CAR005",
    tags: ["Asado", "Tira", "Costilla", "Parrilla"],
    description:
      "Clásico asado de tira, corte tradicional argentino perfecto para compartir en familia. Con el equilibrio perfecto entre carne y grasa, garantiza una cocción uniforme y un sabor inigualable.",
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
  const [customerData, setCustomerData] = useState({
    name: "",
    phone: "",
    region: "",
    comuna: "",
    address: "",
    notes: "",
  })
  const [selectedProduct, setSelectedProduct] = useState<(typeof products)[0] | null>(null)

  // Filtrar productos basado en búsqueda y categoría
  const filteredProducts = useMemo(() => {
    let filtered = products

    if (searchTerm) {
      filtered = filtered.filter((product) => product.name.toLowerCase().includes(searchTerm.toLowerCase()))
    }

    if (selectedCategory) {
      filtered = filtered.filter((product) => product.category === selectedCategory)
    }

    return filtered
  }, [searchTerm, selectedCategory])

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
      message += `• ${item.name} - Cantidad: ${item.quantity} - $${(item.price * item.quantity).toFixed(2)}\n`
    })
    message += `\n💰 *Total: $${cartTotal.toFixed(2)}*`
    if (customerData.notes) {
      message += `\n\n📝 *Notas:* ${customerData.notes}`
    }
    return encodeURIComponent(message)
  }

  // Enviar pedido por WhatsApp
  const sendWhatsAppOrder = (customerData: any) => {
    const message = generateWhatsAppMessage(customerData)
    const whatsappUrl = `https://wa.me/573001234567?text=${message}`
    window.open(whatsappUrl, "_blank")
    setShowCustomerForm(false)
    setCart([]) // Limpiar carrito después del pedido
  }

  // Continuar con pedido
  const handleContinueOrder = () => {
    setCartOpen(false)
    setShowCustomerForm(true)
  }

  // Si hay un producto seleccionado, mostrar la vista del producto
  if (selectedProduct) {
    return (
      <ProductView
        product={selectedProduct}
        onBack={() => setSelectedProduct(null)}
        onAddToCart={addToCartWithQuantity}
      />
    )
  }

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
        {/* Header */}
        <header className="bg-black border-b border-gray-800">
          <div className="container mx-auto px-4 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-8">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-lg">LP</span>
                  </div>
                  <span className="text-xl sm:text-2xl font-bold">LA PARRITECA</span>
                </div>

                <nav className="hidden md:flex space-x-8">
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

                {/* Menú móvil */}
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="ghost" size="sm" className="md:hidden">
                      <Menu className="w-5 h-5" />
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left">
                    <div className="flex flex-col space-y-4 mt-8">
                      <button
                        onClick={() => setSelectedCategory(null)}
                        className="text-left hover:text-red-500 transition-colors"
                      >
                        TIENDA
                      </button>
                      <button
                        onClick={() => setShowContactForm(true)}
                        className="text-left hover:text-red-500 transition-colors"
                      >
                        CONTACTO
                      </button>
                    </div>
                  </SheetContent>
                </Sheet>
              </div>

              <div className="flex items-center space-x-2 sm:space-x-4">
                {/* Buscador */}
                <div className="relative hidden sm:block">
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
                      className="w-48 lg:w-64 bg-white text-black"
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
                          onClick={() => {
                            addToCart(product)
                            setShowSearchResults(false)
                            setSearchTerm("")
                          }}
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
                            <p className="text-green-600 font-bold">$ {product.price.toFixed(2)}</p>
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

                {/* Buscador móvil */}
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="ghost" size="sm" className="sm:hidden p-2">
                      <Search className="w-5 h-5" />
                    </Button>
                  </SheetTrigger>
                  <SheetContent>
                    <div className="mt-8">
                      <Input
                        type="text"
                        placeholder="Buscar productos..."
                        value={searchTerm}
                        onChange={(e) => {
                          setSearchTerm(e.target.value)
                          setShowAllSearchResults(e.target.value.length > 0)
                        }}
                        className="w-full bg-white text-black"
                      />
                    </div>
                  </SheetContent>
                </Sheet>

                {/* Carrito */}
                <Sheet open={cartOpen} onOpenChange={setCartOpen}>
                  <SheetTrigger asChild>
                    <Button variant="outline" className="relative bg-transparent text-xs sm:text-sm px-2 sm:px-4">
                      <ShoppingCart className="w-4 h-4 mr-1 sm:mr-2" />
                      <span className="hidden sm:inline">CARRITO /</span>
                      <span className="sm:hidden">$</span>
                      <span className="ml-1">{cartTotal.toFixed(2)}</span>
                      {cartItemsCount > 0 && (
                        <Badge className="absolute -top-2 -right-2 bg-red-600 text-xs px-1 min-w-[1.25rem] h-5">
                          {cartItemsCount}
                        </Badge>
                      )}
                    </Button>
                  </SheetTrigger>
                  <SheetContent className="w-full sm:w-96">
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
                                <p className="text-green-600 font-bold">$ {item.price.toFixed(2)}</p>
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
                              <span className="font-bold text-lg">Total: $ {cartTotal.toFixed(2)}</span>
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

        {/* Hero Section */}
        <HeroCarousel />

        {/* Productos filtrados por búsqueda o categoría */}
        {(showAllSearchResults || selectedCategory) && (
          <section className="py-12">
            <div className="container mx-auto px-4">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl sm:text-3xl font-bold">
                  {selectedCategory ? `CATEGORÍA: ${selectedCategory}` : "RESULTADOS DE BÚSQUEDA"}
                </h2>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchTerm("")
                    setSelectedCategory(null)
                    setShowSearchResults(false)
                    setShowAllSearchResults(false)
                  }}
                >
                  <X className="w-4 h-4 mr-2" />
                  Limpiar filtros
                </Button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {filteredProducts.map((product) => (
                  <Card key={product.id} className="bg-gray-900 border-gray-700">
                    <CardContent className="p-4">
                      <div className="cursor-pointer" onClick={() => setSelectedProduct(product)}>
                        <div className="relative mb-4">
                          <Image
                            src={product.images[0] || "/placeholder.svg"}
                            alt={product.name}
                            width={200}
                            height={200}
                            className="w-full h-48 object-cover rounded"
                          />
                          {!product.inStock && (
                            <div className="absolute inset-0 bg-black bg-opacity-75 flex items-center justify-center rounded">
                              <Badge variant="destructive">SIN EXISTENCIAS</Badge>
                            </div>
                          )}
                        </div>
                        <h3 className="font-bold text-sm mb-2 text-white">{product.name}</h3>
                        <p className="text-green-400 font-bold text-lg mb-3">$ {product.price.toFixed(2)}</p>
                      </div>
                      <Button
                        onClick={(e) => {
                          e.stopPropagation()
                          addToCart(product)
                        }}
                        disabled={!product.inStock}
                        className="w-full bg-red-600 hover:bg-red-700 disabled:bg-gray-600"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Agregar al carrito
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Productos más buscados - Solo mostrar si no hay filtros activos */}
        {!selectedCategory && !showAllSearchResults && (
          <section className="py-12">
            <div className="container mx-auto px-4">
              <div className="text-center mb-12">
                <h2 className="text-2xl sm:text-3xl font-bold mb-2">PRODUCTOS MÁS BUSCADOS</h2>
                <p className="text-gray-400">POPULARES</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {products.slice(0, 4).map((product) => (
                  <Card key={product.id} className="bg-gray-900 border-gray-700">
                    <CardContent className="p-4">
                      <div className="cursor-pointer" onClick={() => setSelectedProduct(product)}>
                        <div className="relative mb-4">
                          <Image
                            src={product.images[0] || "/placeholder.svg"}
                            alt={product.name}
                            width={200}
                            height={200}
                            className="w-full h-48 object-cover rounded"
                          />
                          {!product.inStock && (
                            <div className="absolute inset-0 bg-black bg-opacity-75 flex items-center justify-center rounded">
                              <Badge variant="destructive">SIN EXISTENCIAS</Badge>
                            </div>
                          )}
                        </div>
                        <h3 className="font-bold text-sm mb-2 text-white">{product.name}</h3>
                        <p className="text-green-400 font-bold text-lg mb-3">$ {product.price.toFixed(2)}</p>
                      </div>
                      <Button
                        onClick={(e) => {
                          e.stopPropagation()
                          addToCart(product)
                        }}
                        disabled={!product.inStock}
                        className="w-full bg-red-600 hover:bg-red-700 disabled:bg-gray-600"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Agregar al carrito
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Todos los productos disponibles */}
        {!selectedCategory && !showAllSearchResults && (
          <section className="py-12">
            <div className="container mx-auto px-4">
              <div className="text-center mb-12">
                <h2 className="text-2xl sm:text-3xl font-bold mb-2">TODOS LOS PRODUCTOS DISPONIBLES</h2>
                <p className="text-gray-400">CATÁLOGO COMPLETO</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {products.map((product) => (
                  <Card key={product.id} className="bg-gray-900 border-gray-700">
                    <CardContent className="p-4">
                      <div className="cursor-pointer" onClick={() => setSelectedProduct(product)}>
                        <div className="relative mb-4">
                          <Image
                            src={product.images[0] || "/placeholder.svg"}
                            alt={product.name}
                            width={200}
                            height={200}
                            className="w-full h-48 object-cover rounded"
                          />
                          {!product.inStock && (
                            <div className="absolute inset-0 bg-black bg-opacity-75 flex items-center justify-center rounded">
                              <Badge variant="destructive">SIN EXISTENCIAS</Badge>
                            </div>
                          )}
                        </div>
                        <h3 className="font-bold text-sm mb-2 text-white">{product.name}</h3>
                        <p className="text-green-400 font-bold text-lg mb-3">$ {product.price.toFixed(2)}</p>
                      </div>
                      <Button
                        onClick={(e) => {
                          e.stopPropagation()
                          addToCart(product)
                        }}
                        disabled={!product.inStock}
                        className="w-full bg-red-600 hover:bg-red-700 disabled:bg-gray-600"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Agregar al carrito
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>
        )}
        {/* Categorías de productos - Solo mostrar si no hay filtros activos */}
        {!selectedCategory && !showAllSearchResults && (
          <section className="py-12">
            <div className="container mx-auto px-4">
              <div className="text-center mb-12">
                <h2 className="text-2xl sm:text-3xl font-bold">CATEGORÍAS DE PRODUCTOS</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {categories.map((category) => (
                  <Card
                    key={category.name}
                    className="bg-gray-900 border-gray-700 cursor-pointer hover:bg-gray-800 transition-colors"
                    onClick={() => setSelectedCategory(category.name)}
                  >
                    <CardContent className="p-6 text-center">
                      <Image
                        src={category.image || "/placeholder.svg"}
                        alt={category.name}
                        width={200}
                        height={200}
                        className="w-full h-48 object-cover rounded mb-4"
                      />
                      <h3 className="font-bold text-lg mb-2 text-white">{category.name}</h3>
                      <p className="text-gray-400">{category.count} PRODUCTOS</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>
        )}



        {/* Formulario de datos del cliente */}
        {showCustomerForm && (
          <CustomerForm
            cart={cart}
            cartTotal={cartTotal}
            onClose={() => setShowCustomerForm(false)}
            onSubmit={sendWhatsAppOrder}
          />
        )}

        {/* Sección de contacto */}
        {showContactForm && <ContactSection onClose={() => setShowContactForm(false)} />}

        {/* Botón flotante de WhatsApp */}
        <div className="fixed bottom-6 right-6 z-50">
          <Button
            onClick={() => window.open("https://wa.me/573001234567", "_blank")}
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
