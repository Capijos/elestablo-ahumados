import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'El establo ahumados',
  description: 'Los mejores ahumados de colombia',
  generator: '',
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
