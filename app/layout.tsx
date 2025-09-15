import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Realiza tu pedido aqui',
  description: 'Los mejores ahumados de colombia',
  generator: '',
  icons: {
    icon: '/logo2.png', // o '/logo.png' si usas PNG
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
