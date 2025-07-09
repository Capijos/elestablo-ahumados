"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MessageCircle, X } from "lucide-react"

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
    address: "",
    notes: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (customerData.name && customerData.phone && customerData.address) {
      onSubmit(customerData)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-10 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md bg-white text-black">
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
              <Label htmlFor="address">Dirección de entrega *</Label>
              <Textarea
                id="address"
                value={customerData.address}
                onChange={(e) => setCustomerData({ ...customerData, address: e.target.value })}
                required
                placeholder="Dirección completa para la entrega"
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
