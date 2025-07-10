import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'El establo ahumados',
  description: 'Compra las mejores carnes de toda colombia',

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
