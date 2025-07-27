import { Inter, Playfair_Display } from "next/font/google"
import "./globals.css"
import { AuthProvider } from "@/components/AuthProvider"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
})

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
})

export const metadata = {
  title: "Cruise-Ease Management System",
  description: "Luxury cruise ship management and booking system",
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${playfair.variable} font-inter bg-pearl-white`}>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  )
}
