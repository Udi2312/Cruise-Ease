# Cruise Ship Management System

A luxury cruise ship management and booking system built with Next.js 15, featuring role-based dashboards and comprehensive booking capabilities.

## 🚢 Features

### Role-Based Access Control
- **Voyager**: Order catering, buy gifts, book services (movies, salon, fitness, party hall)
- **Admin**: Manage menu items, register users, handle inventory
- **Manager**: View all bookings and reservations
- **Head Cook**: View and manage catering orders
- **Supervisor**: View and manage stationery orders

### Core Functionality
- User authentication with NextAuth.js
- MongoDB database with Mongoose ODM
- Responsive design with Tailwind CSS
- Luxury nautical theme with custom color palette
- Real-time order and booking management

## 🎨 Design Theme

**Luxury Nautical Theme** with elegant color palette:
- 🌊 Ocean Blue (#005B96) - Trust, professionalism
- ⚓ Navy (#0A2540) - Authority, structure  
- ☀️ Sunset Gold (#FFD166) - Luxury highlights
- ⚪ Pearl White (#F7F9FC) - Clean background
- 🌴 Teal (#00BFA5) - Accent colors

## 🛠 Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Authentication**: NextAuth.js
- **Database**: MongoDB with Mongoose
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Fonts**: Playfair Display (headings), Inter (body)

## 📦 Installation

1. Clone the repository:
\`\`\`bash
git clone <repository-url>
cd cruise-ship-management
\`\`\`

2. Install dependencies:
\`\`\`bash
npm install
\`\`\`

3. Set up environment variables:
\`\`\`bash
cp .env.example .env.local
\`\`\`

Edit `.env.local` with your values:
\`\`\`env
MONGODB_URI=mongodb://localhost:27017/cruise-ship-management
NEXTAUTH_SECRET=your-secret-key-here
NEXTAUTH_URL=http://localhost:3000
JWT_SECRET=your-jwt-secret-here
\`\`\`

4. Start the development server:
\`\`\`bash
npm run dev
\`\`\`

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🗄 Database Collections

### Users
- `id`, `name`, `email`, `password` (hashed), `role`

### Menu
- `itemName`, `category` (catering/stationery), `price`, `description`

### Orders
- `userId`, `items`, `type` (catering/stationery), `status`, `totalAmount`

### Bookings
- `userId`, `service` (movie/salon/fitness/party), `details`, `status`, `price`

## 🚀 Deployment

### Vercel Deployment

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

### Environment Variables for Production
\`\`\`env
MONGODB_URI=your-mongodb-connection-string
NEXTAUTH_SECRET=your-production-secret
NEXTAUTH_URL=https://your-domain.vercel.app
JWT_SECRET=your-jwt-secret
\`\`\`

## 📱 Pages Structure

\`\`\`
app/
├── page.js                  # Landing Page
├── login/page.js            # Login
├── register/page.js         # Registration
├── dashboard/               # Role-based dashboards
│   ├── voyager/page.js
│   ├── admin/page.js
│   ├── manager/page.js
│   ├── cook/page.js
│   └── supervisor/page.js
├── order/page.js            # Voyager orders
├── booking/page.js          # Voyager bookings
└── api/                     # API Routes
    ├── auth/
    ├── menu/
    ├── orders/
    └── bookings/
\`\`\`

## 🎯 Key Features

- **Responsive Design**: Works on all devices
- **Role-Based Security**: Proper access control
- **Real-time Updates**: Dynamic content loading
- **Luxury UI**: Premium nautical theme
- **Secure Authentication**: JWT-based sessions

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/[...nextauth]` - NextAuth.js authentication

### Menu Management
- `GET /api/menu?category=catering|stationery` - Get menu items
- `POST /api/menu` - Create menu item (Admin only)

### Orders
- `GET /api/orders?type=catering|stationery` - Get orders
- `POST /api/orders` - Create new order

### Bookings
- `GET /api/bookings?service=movie|salon|fitness|party` - Get bookings
- `POST /api/bookings` - Create new booking

## 👥 Default User Roles

When registering, users can select from these roles:
- **Voyager** (default) - Guests who can order and book services
- **Admin** - Full system management access
- **Manager** - View all bookings and operations
- **Head Cook** - Manage catering orders
- **Supervisor** - Manage stationery orders

## 🎨 UI Components

### Custom Tailwind Classes
- `.btn-primary` - Ocean blue buttons with gold hover
- `.btn-secondary` - Teal accent buttons
- `.card` - White cards with rounded corners and shadows
- `.dashboard-card` - Special cards with gold borders
- `.navbar` - Navy background navigation

### Icons & Typography
- **Icons**: Lucide React for consistent iconography
- **Headings**: Playfair Display for elegant titles
- **Body Text**: Inter for clean readability

## 🔒 Security Features

- Password hashing with bcryptjs
- JWT-based session management
- Role-based route protection
- API endpoint authentication
- Secure environment variable handling

## 🚀 Getting Started

1. **Setup Database**: Ensure MongoDB is running
2. **Install Dependencies**: Run `npm install`
3. **Configure Environment**: Copy and edit `.env.local`
4. **Start Development**: Run `npm run dev`
5. **Create Admin User**: Register with admin role
6. **Add Menu Items**: Use admin dashboard to populate menu

## 📞 Support

For issues or questions:
1. Check the GitHub issues
2. Review the documentation
3. Contact the development team

---

**Built with ❤️ for luxury cruise experiences**

Enjoy your voyage! ⚓
