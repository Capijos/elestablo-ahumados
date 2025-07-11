"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MapPin, Phone, Clock, MessageCircle, X } from "lucide-react"

interface ContactSectionProps {
  onClose: () => void
}

export function ContactSection({ onClose }: ContactSectionProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl bg-white text-black max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-2xl">Contacto</CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-red-600 mt-1" />
                <div>
                  <h3 className="font-semibold">Dirección</h3>
                  <p className="text-gray-600">
                    Calle 123 #45-67
                    <br />
                    Barrio La Parrilla
                    <br />
                    Bogotá, Colombia
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Phone className="w-5 h-5 text-red-600 mt-1" />
                <div>
                  <h3 className="font-semibold">Teléfonos</h3>
                  <p className="text-gray-600">
                    WhatsApp: +57 300 340 8474
                    <br />
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Clock className="w-5 h-5 text-red-600 mt-1" />
                <div>
                  <h3 className="font-semibold">Horarios de atención</h3>
                  <div className="text-gray-600 space-y-1">
                    <p>
                      <strong>Lunes a Viernes:</strong> 8:00 AM - 7:00 PM
                    </p>
                    <p>
                      <strong>Sábados:</strong> 8:00 AM - 6:00 PM
                    </p>
                    <p>
                      <strong>Domingos:</strong> 9:00 AM - 4:00 PM
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">Sobre EL ESTABLO AHUMADOS</h3>
                <p className="text-gray-600 text-sm">
                  Somos una carnicería especializada en carnes premium para parrilla. Ofrecemos los mejores cortes,
                  embutidos artesanales y todo lo necesario para que tu asado sea perfecto.
                </p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">Servicios</h3>
                <ul className="text-gray-600 text-sm space-y-1">
                  <li>• Domicilios sin costo mínimo</li>
                   
                  <li>• Productos frescos diarios</li>
                </ul>
              </div>

              <Button
                onClick={() => window.open("https://wa.me/573003408474", "_blank")}
                className="w-full bg-green-600 hover:bg-green-700"
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                Contactar por WhatsApp
              </Button>
            </div>
          </div>

          <div className="border-t pt-6">
            <h3 className="font-semibold mb-4">Ubicación</h3>
            <div className="bg-gray-200 h-64 rounded-lg flex items-center justify-center">
              <p className="text-gray-600">Mapa de ubicación</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
