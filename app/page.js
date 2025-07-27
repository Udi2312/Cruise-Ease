import Link from "next/link"
import Image from "next/image"
import Navbar from "@/components/Navbar"
import { Anchor, Waves, Compass } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center bg-gradient-to-br from-ocean-blue to-navy">
        <div className="absolute inset-0 bg-black/20"></div>
        <Image
          src="/placeholder.svg?height=1080&width=1920"
          alt="Luxury Cruise Ship"
          fill
          className="object-cover mix-blend-overlay"
        />

        <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-4">
          <h1 className="font-playfair text-6xl md:text-8xl font-bold mb-6">Welcome Aboard</h1>
          <p className="text-xl md:text-2xl mb-8 text-pearl-white/90">
            Experience luxury at sea with our comprehensive cruise management system
          </p>
          <div className="space-x-4">
            <Link href="/register" className="btn-primary text-lg px-8 py-4">
              Start Your Journey
            </Link>
            <Link
              href="/login"
              className="border-2 border-sunset-gold text-sunset-gold hover:bg-sunset-gold hover:text-navy px-8 py-4 rounded-2xl font-semibold transition-all duration-300"
            >
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-pearl-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-playfair text-4xl md:text-5xl font-bold text-navy mb-4">Luxury Services</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Discover our premium amenities and services designed for the ultimate cruise experience
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="dashboard-card text-center">
              <div className="w-16 h-16 bg-teal/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Anchor className="h-8 w-8 text-teal" />
              </div>
              <h3 className="font-playfair text-2xl font-bold text-navy mb-3">Fine Dining</h3>
              <p className="text-gray-600">
                Exquisite culinary experiences with world-class chefs and premium ingredients
              </p>
            </div>

            <div className="dashboard-card text-center">
              <div className="w-16 h-16 bg-sunset-gold/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Waves className="h-8 w-8 text-sunset-gold" />
              </div>
              <h3 className="font-playfair text-2xl font-bold text-navy mb-3">Wellness & Spa</h3>
              <p className="text-gray-600">Rejuvenate your body and mind with our luxury spa and fitness facilities</p>
            </div>

            <div className="dashboard-card text-center">
              <div className="w-16 h-16 bg-ocean-blue/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Compass className="h-8 w-8 text-ocean-blue" />
              </div>
              <h3 className="font-playfair text-2xl font-bold text-navy mb-3">Entertainment</h3>
              <p className="text-gray-600">
                World-class entertainment, movies, and event spaces for unforgettable moments
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-navy text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center mb-8">
            <Anchor className="h-12 w-12 text-sunset-gold mr-4" />
            <span className="font-playfair text-3xl font-bold text-sunset-gold">Cruise-Ease</span>
          </div>
          <div className="text-center text-pearl-white/80">
            <p>&copy; 2024 Cruise-Ease. All rights reserved.</p>
            <p className="mt-2">Experience luxury at sea</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
