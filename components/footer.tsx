"use client"

import { MapPin, Phone, Clock, Mail, Facebook, Instagram, Twitter } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white border-t border-gray-800">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Logo y descripción */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-lg">EA</span>
              </div>
              <div>
                <h3 className="text-xl font-bold">EL ESTABLO AHUMADOS</h3>
                <p className="text-red-500 text-sm">Tu carnicería de confianza</p>
              </div>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Especialistas en carnes premium para parrilla. Más de 15 años ofreciendo los mejores cortes, embutidos
              artesanales y todo lo necesario para tu asado perfecto.
            </p>
          </div>

          {/* Información de contacto */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-white">Contacto</h4>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <MapPin className="w-4 h-4 text-red-500 mt-1 flex-shrink-0" />
                <div className="text-sm text-gray-400">
                  <p>Calle 123 #45-67</p>
                  <p>Barrio La Parrilla</p>
                  <p>Bogotá, Colombia</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="w-4 h-4 text-red-500 flex-shrink-0" />
                <div className="text-sm text-gray-400">
                  <p>WhatsApp: +57 300 123 4567</p>
                  <p>Fijo: (601) 234 5678</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="w-4 h-4 text-red-500 flex-shrink-0" />
                <p className="text-sm text-gray-400">info@laparriteca.com</p>
              </div>
            </div>
          </div>

          {/* Horarios */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-white">Horarios</h4>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-red-500 flex-shrink-0" />
                <div className="text-sm text-gray-400">
                  <p className="font-medium text-white">Lunes a Viernes</p>
                  <p>8:00 AM - 7:00 PM</p>
                </div>
              </div>
              <div className="text-sm text-gray-400 ml-6">
                <p className="font-medium text-white">Sábados</p>
                <p>8:00 AM - 6:00 PM</p>
              </div>
              <div className="text-sm text-gray-400 ml-6">
                <p className="font-medium text-white">Domingos</p>
                <p>9:00 AM - 4:00 PM</p>
              </div>
            </div>
          </div>

          {/* Servicios y redes sociales */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-white">Servicios</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>• Domicilios sin costo mínimo</li>
              <li>• Cortes personalizados</li>
              <li>• Asesoría para tu parrilla</li>
              <li>• Productos frescos diarios</li>
              <li>• Embutidos artesanales</li>
              <li>• Carbón y accesorios</li>
            </ul>

            <div className="pt-4">
              <h5 className="text-sm font-semibold text-white mb-3">Síguenos</h5>
              <div className="flex space-x-3">
                <button className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center hover:bg-red-700 transition-colors">
                  <Facebook className="w-4 h-4" />
                </button>
                <button className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center hover:bg-red-700 transition-colors">
                  <Instagram className="w-4 h-4" />
                </button>
                <button className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center hover:bg-red-700 transition-colors">
                  <Twitter className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Línea divisoria y copyright */}
        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-sm text-gray-400">
              <p>&copy; 2024 EL ESTABLO AHUMADOS. Todos los derechos reservados.</p>
            </div>
            <div className="flex space-x-6 text-sm text-gray-400">
              <button className="hover:text-white transition-colors">Términos y Condiciones</button>
              <button className="hover:text-white transition-colors">Política de Privacidad</button>
              <button className="hover:text-white transition-colors">Política de Devoluciones</button>
            </div>
          </div>
          <div className="text-center mt-4">
            <p className="text-xs text-gray-500">Desarrollado con ❤️ para los amantes de la buena parrilla</p>
          </div>
        </div>
      </div>
    </footer>
  )
}
