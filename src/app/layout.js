'use client'

import './globals.css'

export default function RootLayout({ children }) {
  return (
    <html>
      <body suppressHydrationWarning>
        {children}
      </body>
    </html>
  )
}
