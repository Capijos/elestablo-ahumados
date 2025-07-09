"use client"

import { useState, useMemo } from "react"
import Image from "next/image"
import { Search, ShoppingCart, MessageCircle, Plus, Minus, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { CustomerForm } from "@/components/customer-form"
import { ContactSection } from "@/components/contact-section"

// Datos de productos
const products = [
  {
    id: 1,
    name: "BIFE ANCHO ANGUS USA (Por Kilo)",
    price: 230.0,
    category: "CARNES",
    image: "https://perupacific.com/wp-content/uploads/2021/01/bife-ancho-1.jpeg",
    inStock: true,
  },
  {
    id: 2,
    name: "CHORIZO FINAS HIERBAS (4 Unidades)",
    price: 24.0,
    category: "EMBUTIDOS Y FIAMBRES",
    image: "https://static.wixstatic.com/media/8700a2_531885cfce7a480080215a9b8a2e7a61~mv2.jpg/v1/fill/w_480,h_322,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/8700a2_531885cfce7a480080215a9b8a2e7a61~mv2.jpg",
    inStock: true,
  },
  {
    id: 3,
    name: "ENTRAÑA ARGENTINA (700 - 800 gr)",
    price: 96.0,
    category: "CARNES",
    image: "https://www.tienda.parriteca.com/wp-content/uploads/2022/11/entrana-argentina-4.webp",
    inStock: false,
  },
  {
    id: 4,
    name: "CHORIZO PREMIUM (4 Unidades)",
    price: 35.0,
    category: "EMBUTIDOS Y FIAMBRES",
    image: "https://www.tienda.parriteca.com/wp-content/uploads/2022/12/CHORIZO-PREMIUM-ANGUS-300x300.webp",
    inStock: true,
  },
  {
    id: 5,
    name: "ASADO DE TIRA (Por Kilo)",
    price: 45.0,
    category: "CARNES",
    image: "https://www.tienda.parriteca.com/wp-content/uploads/2022/11/asado-de-tira-con-hueso-angus-USA-2.webp",
    inStock: true,
  },
  {
    id: 6,
    name: "MORCILLA CRIOLLA (4 Unidades)",
    price: 18.0,
    category: "EMBUTIDOS Y FIAMBRES",
    image: "https://grillcorp.com.pe/cdn/shop/files/collage-4-chorizos.jpg?v=1726613496&width=3840",
    inStock: true,
  },
  {
    id: 7,
    name: "RIÑONES DE TERNERA",
    price: 12.0,
    category: "ACHURAS",
    image: "https://www.deliargentina.com/image/catalog/product/carne/rinones-de-ternera/rinones-de-ternera.jpg",
    inStock: true,
  },
  {
    id: 8,
    name: "CARBÓN QUEBRACHO BLANCO",
    price: 25.0,
    category: "CARBON, SAL Y SALSAS",
    image: "https://quebrachoblanco.cl/wp-content/uploads/2024/04/Carbon-Quebracho-Blanco-scaled.jpg",
    inStock: true,
  },
  {
    id: 9,
    name: "SAL PARRILLERA PREMIUM",
    price: 8.0,
    category: "CARBON, SAL Y SALSAS",
    image: "https://parrillaspremiumperu.com/cdn/shop/files/3_137bcdce-d2ed-4051-9936-230442e8af88.jpg?v=1736198501&width=1445",
    inStock: true,
  },
  {
    id: 10,
    name: "CHIMICHURRI ARTESANAL",
    price: 15.0,
    category: "CARBON, SAL Y SALSAS",
    image: "https://wongfood.vtexassets.com/arquivos/ids/701148/Chimichurri-Ayni-Artesanal-200g-1-351673430.jpg?v=638495772148930000",
    inStock: true,
  },
]

const categories = [
  { name: "CARNES", count: 19, image: "https://edualimentaria.com/images/carnes/carnes-derivados-cecinas.jpg" },
  { name: "EMBUTIDOS Y FIAMBRES", count: 14, image: "https://artemonte.com/wp-content/uploads/Beneficios-de-comer-embutido.png" },
  { name: "ACHURAS", count: 4, image: "https://i0.wp.com/www.brasasysabores.com/wp-content/uploads/2017/06/Las-achuras-como-parte-del-asado-argentino.jpg" },
  { name: "CARBON, SAL Y SALSAS", count: 15, image: "https://i.ytimg.com/vi/wFXU1UU3004/maxresdefault.jpg" },
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
  const [customerData, setCustomerData] = useState({
    name: "",
    phone: "",
    address: "",
    notes: "",
  })

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
            image: product.image,
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
        {/* Header */}
        <header className="bg-black border-b border-gray-800">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-8">
                <div className="flex items-center space-x-2">
                  <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold">LP</span>
                  </div>
                  <span className="text-xl font-bold">LA PARRITECA</span>
                </div>

                <nav className="hidden md:flex space-x-6">
                  <button onClick={() => setSelectedCategory(null)} className="hover:text-red-500 transition-colors">
                    TIENDA
                  </button>
                  <button onClick={() => setShowContactForm(true)} className="hover:text-red-500 transition-colors">
                    CONTACTO
                  </button>
                </nav>
              </div>

              <div className="flex items-center space-x-4">
                {/* Buscador */}
                <div className="relative">
                  <div className="flex items-center">
                    <Input
                      type="text"
                      placeholder="Buscar productos..."
                      value={searchTerm}
                      onChange={(e) => {
                        setSearchTerm(e.target.value)
                        setShowSearchResults(e.target.value.length > 0)
                        setShowAllSearchResults(false) // Reset cuando se cambia el texto
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
                          onClick={() => {
                            addToCart(product)
                            setShowSearchResults(false)
                            setSearchTerm("")
                          }}
                        >
                          <Image
                            src={product.image || "/placeholder.svg"}
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

                {/* Carrito */}
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="outline" className="relative bg-transparent">
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      CARRITO / $ {cartTotal.toFixed(2)}
                      {cartItemsCount > 0 && (
                        <Badge className="absolute -top-2 -right-2 bg-red-600">{cartItemsCount}</Badge>
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
                            <Button
                              onClick={() => setShowCustomerForm(true)}
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

        {/* Hero Section */}
        <section className="relative h-96 overflow-hidden">
          <Image src="https://www.tienda.parriteca.com/wp-content/uploads/2022/11/portada-tienda-parriteca.webp" alt="Carne premium" fill className="object-cover" />
          <div className="absolute inset-0 bg-black bg-opacity-10 flex items-center justify-center">
            <div className="text-center">
              <h1 className="text-4xl md:text-6xl font-bold mb-4">
                TODOS LOS PRODUCTOS
                <br />
                PARA TU PARRILLA.
              </h1>
              <p className="text-xl">No hay nada que una buena parrilla no pueda juntar.</p>
            </div>
          </div>
        </section>

        {/* Productos filtrados por búsqueda o categoría */}
        {(showAllSearchResults || selectedCategory) && (
          <section className="py-12">
            <div className="container mx-auto px-4">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-bold">
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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {filteredProducts.map((product) => (
                  <Card key={product.id} className="bg-gray-900 border-gray-700">
                    <CardContent className="p-4">
                      <div className="relative mb-4">
                        <Image
                          src={product.image || "/placeholder.svg"}
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
                      <h3 className="font-bold text-sm mb-2">{product.name}</h3>
                      <p className="text-green-400 font-bold text-lg mb-3">$ {product.price.toFixed(2)}</p>
                      <Button
                        onClick={() => addToCart(product)}
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
        {!selectedCategory && (
          <section className="py-12">
            <div className="container mx-auto px-4">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold mb-2">PRODUCTOS MÁS BUSCADOS</h2>
                <p className="text-gray-400">POPULARES</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {products.slice(0, 4).map((product) => (
                  <Card key={product.id} className="bg-gray-900 border-gray-700">
                    <CardContent className="p-4">
                      <div className="relative mb-4">
                        <Image
                          src={product.image || "/placeholder.svg"}
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
                      <h3 className="font-bold text-sm mb-2">{product.name}</h3>
                      <p className="text-green-400 font-bold text-lg mb-3">$ {product.price.toFixed(2)}</p>
                      <Button
                        onClick={() => addToCart(product)}
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
        {!selectedCategory && (
          <section className="py-12">
            <div className="container mx-auto px-4">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold">CATEGORÍAS DE PRODUCTOS</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
                      <h3 className="font-bold text-lg mb-2">{category.name}</h3>
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
            onClick={() => window.open("https://wa.me/51999999999", "_blank")}
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
