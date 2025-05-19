import type { Metadata } from 'next'
import { ThemeProvider } from '@/lib/theme-provider'
import './globals.css'
import './debug.css'

export const metadata: Metadata = {
  title: 'Context Composer',
  description: 'A tool for composing context for AI',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang='en' suppressHydrationWarning>
      <body>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  )
}
