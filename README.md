# Lex Tortillería - Full-Stack Order Management System

## 📋 Project Overview

A modern full-stack web application designed for managing tortilla and nacho orders, featuring robust authentication, comprehensive admin panel, and professional UI design. Built with enterprise-grade technologies and deployed on Render cloud platform.

## 🛠️ Technology Stack

### Frontend
- **React 19** with **TypeScript** for type-safe development
- **Vite** as build tool and development server
- **Tailwind CSS 4** for responsive and modern styling
- **React Router DOM** for single-page application navigation
- **React Icons** for consistent iconography
- **Google OAuth 2.0** for social authentication
- **Axios** for REST API communication

### Backend
- **Node.js** with **Express.js** web framework
- **MongoDB Atlas** cloud database
- **Mongoose** for data modeling and ODM
- **JWT (JSON Web Tokens)** for stateless authentication
- **bcrypt** for secure password hashing
- **CORS** for cross-origin request handling

### DevOps & Deployment
- **GitHub Actions** for automated CI/CD pipeline
- **Node.js Testing** with native test runner
- **MongoDB Atlas** cloud database integration
- **Environment variables** for dev/prod configuration
- **Automated builds** with Git change detection
- **Optimized static file serving** for production

## 🚀 Key Features

### 🔐 Authentication System
- ✅ Traditional email/password login
- ✅ Google OAuth 2.0 integration
- ✅ **Quick Admin Access** (credentials: `admin`/`admin`)
- ✅ **Quick Guest Access** (real user in database)
- ✅ Role-based authorization middleware (user/admin)
- ✅ Protected routes with authentication guards
- ✅ **Auto-redirect to orders page** after login

### 📦 Order Management
- ✅ Dynamic order forms for tortillas/nachos
- ✅ Product specification (white/blue, 12cm/18cm sizes)
- ✅ Status tracking system (pending/ongoing/completed/canceled)
- ✅ Complete order history per user
- ✅ **Guest user support** (can create and track orders)

### 👨‍💼 Administrative Panel
- ✅ Comprehensive dashboard with business statistics
- ✅ Real-time order management and status updates
- ✅ Complete client database with 20K+ test records
- ✅ **User management system** with role-based controls
- ✅ **Infinite scroll pagination** for client list
- ✅ Secure order deletion with confirmation prompts
- ✅ **Settings page** (admin-only access)
- ✅ **Professional neutral color scheme** (slate/gray palette)

### 📱 Responsive Design
- ✅ Mobile-first hamburger menu navigation
- ✅ Adaptive desktop/mobile layouts
- ✅ Tablet and smartphone optimization
- ✅ Reusable components with Tailwind CSS
- ✅ **Dark theme with professional styling**

## 🧪 Testing

### Automated Testing Suite
- **Node.js Native Test Runner** for backend API testing
- **Supertest** for HTTP endpoint testing
- **MongoDB integration** testing with real database
- **GitHub Actions CI/CD** pipeline for automated testing

### Running Tests

```bash
# Run all tests
npm test

# Run tests in backend directory
cd backend && npm test

# Run tests with timeout (for long-running tests)
timeout 10 npm test
```

### Test Coverage
- ✅ **Authentication endpoints** (login with valid/invalid credentials)
- ✅ **API route availability** (GET /api status checks)
- ✅ **JWT token validation** and response verification
- ✅ **Error handling** for invalid requests
- ✅ **Database connection** testing

## 🔧 Installation & Setup

### Prerequisites
- Node.js v18+
- npm or yarn
- MongoDB Atlas account (or local MongoDB)

### Installation Steps

1. **Clone the repository**
```bash
git clone <repository-url>
cd Backend_project
```

2. **Install all dependencies**
```bash
npm run install:all
```

3. **Configure environment variables**

Create `.env` file in `backend/` folder:
```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
PORT=3000
NODE_ENV=development
```

Create `.env` file in `fronted/` folder:
```env
VITE_API_LOGIN=http://localhost:3000/api/login
VITE_API_USER=http://localhost:3000/api/users
VITE_API_AUTH=http://localhost:3000/api/login/auth
VITE_GOOGLE_CLIENT_ID=your_google_client_id
```

### Development

```bash
# Run both backend and frontend simultaneously
npm run dev

# Run separately
npm run backend    # Backend only
npm run frontend   # Frontend only
```

### Production

```bash
# Build application
npm run build

# Start production server
npm start
```

## 🎯 Usage Guide

### Quick Testing Access

The login page (`/login`) provides two quick access buttons for testing:

1. **👨‍💼 Admin Access**
   - Instant admin login
   - Full administrative dashboard
   - All order management capabilities

2. **👤 Guest Access**
   - Real database user account
   - Order creation and tracking
   - Credentials: `guest`/`guest`

### Features by User Role

#### Regular User / Guest
- ✅ Create new orders
- ✅ View personal order history
- ✅ Edit profile information
- ✅ Delete account functionality

#### Administrator
- ✅ All user features
- ✅ View all system orders
- ✅ Update order statuses
- ✅ Delete orders (with confirmation)
- ✅ Access client database (20K+ records)
- ✅ **User management and role administration**
- ✅ **Exclusive Settings page access**
- ✅ **Infinite scroll client pagination**

## 🌐 Application URLs

- **Frontend:** http://localhost:5173/
- **Backend API:** http://localhost:3000/api/
- **Login Page:** http://localhost:5173/login
- **Orders Dashboard:** http://localhost:5173/my-bookings *(default post-login)*
- **Admin Panel:** http://localhost:5173/admin
- **Settings:** http://localhost:5173/settings *(admin-only)*
- **Profile:** http://localhost:5173/profile

## 🔐 Test Credentials

### Administrator
- **Email:** `admin`
- **Password:** `admin`

### Guest User
- **Email:** `guest`
- **Password:** `guest`

## 📊 Project Structure

```
Backend_project/
├── backend/
│   ├── controller/         # API route controllers
│   │   ├── appRoutes.js   # Client data with pagination
│   │   ├── auth.js        # Authentication logic
│   │   ├── login.js       # Login endpoints
│   │   ├── order.js       # Order management
│   │   └── user.js        # User operations
│   ├── models/            # MongoDB data models
│   │   ├── order.js       # Order schema
│   │   └── user.js        # User schema
│   ├── utils/             # Middleware and configuration
│   │   ├── config.js      # Environment configuration
│   │   ├── logger.js      # Logging utilities
│   │   └── middleware.js  # Authentication middleware
│   └── app.js             # Express application setup
├── fronted/
│   ├── src/
│   │   ├── components/    # React components
│   │   │   ├── AdminPanel.tsx      # Admin dashboard
│   │   │   ├── ClientList.tsx      # Paginated client list
│   │   │   ├── UserList.tsx        # User management component
│   │   │   ├── Header.tsx          # Navigation header
│   │   │   ├── OrderForm.tsx       # Order creation form
│   │   │   ├── OrderList.tsx       # User orders display
│   │   │   ├── StatusBadge.tsx     # Order status indicator
│   │   │   └── auth/               # Authentication components
│   │   ├── contexts/      # React Context API
│   │   │   └── AuthContext.tsx     # Authentication state
│   │   ├── pages/         # Main application pages
│   │   │   ├── LoginPage.tsx       # Login interface
│   │   │   ├── MyBookingsPage.tsx  # Order management
│   │   │   ├── ProfilePage.tsx     # User profile
│   │   │   ├── RegisterPage.tsx    # User registration
│   │   │   └── SettingsPage.tsx    # Admin settings
│   │   ├── hooks/         # Custom React hooks
│   │   │   └── useSocialAuth.ts    # Social auth logic
│   │   └── services/      # API services
│   │       ├── api.ts              # HTTP client setup
│   │       └── googleAuth.ts       # Google OAuth
│   └── package.json
├── data_20k.json          # Test client database (20K records)
├── test/                  # Test files directory
│   └── testApi.test.js    # API endpoint tests
├── .github/
│   └── workflows/
│       └── test.yml       # GitHub Actions CI/CD pipeline
└── package.json           # Root scripts and dependencies
```

## 🌐 Cloud Deployment & CI/CD

### GitHub Actions Pipeline
The application includes automated CI/CD pipeline with:

1. **Automated Testing** on push to `tests` branch
2. **Multi-environment support** (development/production)
3. **Dependency installation** for both backend and frontend
4. **Build process** with optimized production assets
5. **Environment variable management** via GitHub Secrets

### Pipeline Configuration
```yaml
# .github/workflows/test.yml
- Install root dependencies
- Install backend dependencies  
- Install frontend dependencies and build
- Copy build to backend
- Run backend tests
```

### Deployment Ready
The application is configured for deployment on any cloud platform:

1. **Build Command:** `npm run build`
2. **Start Command:** `npm start`
3. **Auto-deployment** on Git push
4. **Environment variables** configured via platform dashboard

## 🐛 Troubleshooting

### Common Issues

1. **"Cannot find module 'express-async-errors'"**
   ```bash
   cd backend && npm install
   ```

2. **MongoDB connection error**
   - Verify MONGODB_URI in .env file
   - Check internet connectivity
   - Ensure MongoDB Atlas cluster is running

3. **CORS policy errors**
   - Verify CORS configuration in backend/app.js
   - Check frontend environment variables

4. **Google OAuth issues**
   - Verify VITE_GOOGLE_CLIENT_ID is set
   - Check Google Console OAuth configuration

## 🎨 Design Features

### Professional Color Scheme
- **Primary:** Slate and gray gradients for neutrality
- **Accents:** Amber (pending), Blue (ongoing), Emerald (completed)
- **Background:** Dark gradients for professional appearance
- **UI:** Modern card-based layouts with subtle shadows

### User Experience
- **Infinite scroll** for client database navigation
- **Real-time status updates** in admin panel
- **Quick access buttons** for streamlined testing
- **Responsive navigation** with mobile hamburger menu
- **Consistent branding** throughout application

## 🔄 Recent Updates

### v2.1 - Testing & CI/CD Implementation
- ✅ Added comprehensive API testing suite with Node.js native test runner
- ✅ Implemented GitHub Actions CI/CD pipeline
- ✅ Created UserList component for admin user management
- ✅ Enhanced error handling in login authentication
- ✅ Fixed routing issues and improved middleware architecture
- ✅ Added automated testing on push with MongoDB integration

### v2.0 - Professional UI Overhaul
- ✅ Implemented neutral slate/gray color scheme
- ✅ Updated AdminPanel with modern card design
- ✅ Enhanced ClientList with infinite scroll pagination
- ✅ Consistent professional styling across all components
- ✅ Improved mobile responsiveness

### v1.5 - Admin Features
- ✅ Added Settings page (admin-only access)
- ✅ Implemented client database with 20K test records
- ✅ Added order deletion functionality
- ✅ Enhanced authentication with quick access buttons

## 🤝 Contributing

To contribute to this project:

1. Fork the repository
2. Create feature branch (`git checkout -b feature/new-feature`)
3. Commit changes (`git commit -am 'Add new feature'`)
4. Push to branch (`git push origin feature/new-feature`)
5. Create Pull Request

## 📄 License

This project is licensed under the MIT License.

---

