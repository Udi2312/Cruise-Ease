// Sample menu data seeding script
import dbConnect from "../lib/mongodb.js"
import Menu from "../models/Menu.js"

const cateringItems = [
  {
    itemName: "Grilled Lobster Thermidor",
    category: "catering",
    subcategory: "main-course",
    price: 45.99,
    description: "Fresh lobster with creamy thermidor sauce, served with seasonal vegetables",
  },
  {
    itemName: "Wagyu Beef Tenderloin",
    category: "catering",
    subcategory: "main-course",
    price: 65.99,
    description: "Premium wagyu beef cooked to perfection with truffle butter",
  },
  {
    itemName: "Pan-Seared Salmon",
    category: "catering",
    subcategory: "main-course",
    price: 32.99,
    description: "Atlantic salmon with lemon herb crust and roasted asparagus",
  },
  {
    itemName: "Champagne & Caviar",
    category: "catering",
    subcategory: "appetizer",
    price: 89.99,
    description: "Dom Pérignon champagne served with Ossetra caviar",
  },
  {
    itemName: "Chocolate Soufflé",
    category: "catering",
    subcategory: "dessert",
    price: 18.99,
    description: "Warm chocolate soufflé with vanilla ice cream",
  },
]

const stationeryItems = [
  {
    itemName: "Luxury Cruise Photo Album",
    category: "stationery",
    subcategory: "souvenirs",
    price: 29.99,
    description: "Premium leather-bound photo album with cruise ship embossing",
  },
  {
    itemName: "Ship's Compass Keychain",
    category: "stationery",
    subcategory: "souvenirs",
    price: 12.99,
    description: "Brass compass keychain with ship's logo",
  },
  {
    itemName: "Cruise Ship Model",
    category: "stationery",
    subcategory: "gifts",
    price: 89.99,
    description: "Detailed scale model of the cruise ship",
  },
  {
    itemName: "Ocean Breeze Perfume",
    category: "stationery",
    subcategory: "gifts",
    price: 45.99,
    description: "Exclusive cruise line fragrance with ocean notes",
  },
  {
    itemName: "Nautical Jewelry Set",
    category: "stationery",
    subcategory: "gifts",
    price: 79.99,
    description: "Elegant anchor and wave-themed jewelry collection",
  },
]

async function seedMenu() {
  try {
    await dbConnect()

    // Clear existing menu items
    await Menu.deleteMany({})

    // Insert catering items
    await Menu.insertMany(cateringItems)
    console.log("✅ Catering items seeded successfully")

    // Insert stationery items
    await Menu.insertMany(stationeryItems)
    console.log("✅ Stationery items seeded successfully")

    console.log("🎉 Menu seeding completed!")
  } catch (error) {
    console.error("❌ Error seeding menu:", error)
  }
}

seedMenu()
