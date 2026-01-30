import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { AuthProvider } from '@/context/AuthContext'
import { WishlistProvider } from '@/context/WishlistContext'
import { ThemeProvider } from '@/context/ThemeContext'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'ShopMart - Ecommerce',
  description: 'Your one-stop destination for the latest technology, fashion, and lifestyle products.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body>
        <ThemeProvider>
          <AuthProvider>
            <WishlistProvider>
              {children}
            </WishlistProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
