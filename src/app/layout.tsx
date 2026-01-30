import type { Metadata } from 'next'
import { Geist } from 'next/font/google'
import { ThemeProvider } from 'next-themes'
import NextTopLoader from 'nextjs-toploader'
import { Analytics } from '@vercel/analytics/react'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import './globals.css'
import ReactQueryProvider from '@/providers/ReactQueryProvider'
import ClientLayout from '@/components/ClientLayout'

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : 'http://localhost:3000'

export const metadata: Metadata = {
  metadataBase: new URL(defaultUrl),

  title: "Thirtyseven’s Website for Skip Mechanics HR & Item Prio Management",

  description:
    "Guild tool for managing loot priority, hard reserves, and raid planning in Skip Mechanics.",
}

const geistSans = Geist({
  variable: '--font-geist-sans',
  display: 'swap',
  subsets: ['latin'],
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.className} antialiased`}>

        <NextTopLoader
          showSpinner={false}
          height={2}
          color="#2acf80"
        />

        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <ReactQueryProvider>

            <ClientLayout>
              {children}
            </ClientLayout>

            <Analytics />
            <ReactQueryDevtools initialIsOpen={false} />

          </ReactQueryProvider>
        </ThemeProvider>

      </body>
    </html>
  )
}
