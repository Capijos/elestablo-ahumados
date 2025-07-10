"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MessageCircle, X } from "lucide-react"

// Datos de regiones y comunas de Colombia
const colombiaRegions = {
  "Bogotá D.C.": [
    "Usaquén",
    "Chapinero",
    "Santa Fe",
    "San Cristóbal",
    "Usme",
    "Tunjuelito",
    "Bosa",
    "Kennedy",
    "Fontibón",
    "Engativá",
    "Suba",
    "Barrios Unidos",
    "Teusaquillo",
    "Los Mártires",
    "Antonio Nariño",
    "Puente Aranda",
    "La Candelaria",
    "Rafael Uribe Uribe",
    "Ciudad Bolívar",
    "Sumapaz",
  ],
  Antioquia: [
    "Medellín",
    "Bello",
    "Itagüí",
    "Envigado",
    "Sabaneta",
    "La Estrella",
    "Caldas",
    "Copacabana",
    "Girardota",
    "Barbosa",
    "Rionegro",
    "Marinilla",
  ],
  "Valle del Cauca": [
    "Cali",
    "Palmira",
    "Buenaventura",
    "Tuluá",
    "Cartago",
    "Buga",
    "Jamundí",
    "Yumbo",
    "Candelaria",
    "Florida",
    "Pradera",
  ],
  Atlántico: [
    "Barranquilla",
    "Soledad",
    "Malambo",
    "Puerto Colombia",
    "Galapa",
    "Baranoa",
    "Sabanagrande",
    "Santo Tomás",
    "Palmar de Varela",
  ],
  Santander: [
    "Bucaramanga",
    "Floridablanca",
    "Girón",
    "Piedecuesta",
    "Lebrija",
    "Rionegro",
    "San Gil",
    "Socorro",
    "Málaga",
    "Barrancabermeja",
  ],
  Cundinamarca: [
    "Soacha",
    "Chía",
    "Zipaquirá",
    "Facatativá",
    "Madrid",
    "Mosquera",
    "Funza",
    "Cajicá",
    "Sibaté",
    "Tocancipá",
    "Cota",
    "Gachancipá",
  ],
}

interface CartItem {
  id: number
  name: string
  price: number
  quantity: number
  image: string
}

interface CustomerFormProps {
  cart: CartItem[]
  cartTotal: number
  onClose: () => void
  onSubmit: (customerData: any) => void
}

export function CustomerForm({ cart, cartTotal, onClose, onSubmit }: CustomerFormProps) {
  const [customerData, setCustomerData] = useState({
    name: "",
    phone: "",
    region: "",
    comuna: "",
    address: "",
    notes: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (customerData.name && customerData.phone && customerData.region && customerData.comuna && customerData.address) {
      onSubmit(customerData)
    }
  }

  const handleRegionChange = (region: string) => {
    setCustomerData({ ...customerData, region, comuna: "" })
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md bg-white text-black max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Datos para el pedido</CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name">Nombre completo *</Label>
              <Input
                id="name"
                type="text"
                value={customerData.name}
                onChange={(e) => setCustomerData({ ...customerData, name: e.target.value })}
                required
                placeholder="Tu nombre completo"
              />
            </div>

            <div>
              <Label htmlFor="phone">Teléfono *</Label>
              <Input
                id="phone"
                type="tel"
                value={customerData.phone}
                onChange={(e) => setCustomerData({ ...customerData, phone: e.target.value })}
                required
                placeholder="Ej: 3001234567"
              />
            </div>

            <div>
              <Label htmlFor="region">Región/Departamento *</Label>
              <select
                id="region"
                value={customerData.region}
                onChange={(e) => handleRegionChange(e.target.value)}
                required
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="">Selecciona tu región</option>
                {Object.keys(colombiaRegions).map((region) => (
                  <option key={region} value={region}>
                    {region}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <Label htmlFor="comuna">Comuna/Localidad *</Label>
              <select
                id="comuna"
                value={customerData.comuna}
                onChange={(e) => setCustomerData({ ...customerData, comuna: e.target.value })}
                disabled={!customerData.region}
                required
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="">Selecciona tu comuna</option>
                {customerData.region &&
                  colombiaRegions[customerData.region as keyof typeof colombiaRegions]?.map((comuna) => (
                    <option key={comuna} value={comuna}>
                      {comuna}
                    </option>
                  ))}
              </select>
            </div>

            <div>
              <Label htmlFor="address">Dirección completa *</Label>
              <Textarea
                id="address"
                value={customerData.address}
                onChange={(e) => setCustomerData({ ...customerData, address: e.target.value })}
                required
                placeholder="Dirección completa (calle, carrera, número, barrio)"
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="notes">Notas adicionales</Label>
              <Textarea
                id="notes"
                value={customerData.notes}
                onChange={(e) => setCustomerData({ ...customerData, notes: e.target.value })}
                placeholder="Instrucciones especiales, referencias, etc."
                rows={2}
              />
            </div>

            <div className="border-t pt-4">
              <div className="flex justify-between items-center mb-4">
                <span className="font-bold">Total: ${cartTotal.toFixed(2)}</span>
                <span className="text-sm text-gray-600">
                  {cart.reduce((total, item) => total + item.quantity, 0)} productos
                </span>
              </div>

              <Button type="submit" className="w-full bg-green-600 hover:bg-green-700">
                <MessageCircle className="w-4 h-4 mr-2" />
                Enviar pedido por WhatsApp
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
