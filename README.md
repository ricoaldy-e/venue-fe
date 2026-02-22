# ⚽ VENUE UNDIP - Sports Field Booking Platform (Frontend)-

<div align="center">

![Nuxt.js](https://img.shields.io/badge/Nuxt.js-00DC82?style=for-the-badge&logo=nuxtdotjs&logoColor=white)
![Vue.js](https://img.shields.io/badge/Vue.js-4FC08D?style=for-the-badge&logo=vuedotjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![GraphQL](https://img.shields.io/badge/GraphQL-E10098?style=for-the-badge&logo=graphql&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Chart.js](https://img.shields.io/badge/Chart.js-FF6384?style=for-the-badge&logo=chartdotjs&logoColor=white)

*A modern, responsive web application for sports field booking and reservation management at Universitas Diponegoro*

[Features](#-features) • [Tech Stack](#-tech-stack) • [Getting Started](#-getting-started) • [Project Structure](#-project-structure) • [Screenshots](#-screenshots)

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Prerequisites](#-prerequisites)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [Project Structure](#-project-structure)
- [Key Components](#-key-components)
- [Layouts & Pages](#-layouts--pages)
- [State Management](#-state-management)
- [GraphQL Integration](#-graphql-integration)
- [Development](#-development)
- [Deployment](#-deployment)
- [Team](#-team)
- [License](#-license)

---

## 🌟 Overview

**VENUE UNDIP Frontend** is a modern, user-friendly web application built with **Nuxt 3** and **Vue.js** that provides a seamless interface for booking sports fields at Universitas Diponegoro. The application features a public-facing booking system for students and external parties, along with a comprehensive admin dashboard for managing venues, bookings, and operations.

### Key Highlights

- 🎨 **Modern UI/UX** - Clean, responsive interface built with Tailwind CSS
- 🚀 **Nuxt 3 Framework** - Full-stack framework with SSR support
- 📱 **Mobile-First Design** - Optimized for all devices
- 🔐 **Secure Authentication** - JWT-based admin authentication
- 🎯 **Real-Time Availability** - Dynamic field availability checking
- 📊 **Analytics Dashboard** - Comprehensive admin dashboard with charts
- 🖼️ **Image Management** - MinIO integration for media uploads
- ⚡ **Fast Performance** - Optimized with Vue 3 Composition API
- 🌐 **SSR Ready** - Server-side rendering for better SEO

---

## ✨ Features

### Public User Features

- **🏟️ Venue Discovery**
  - Browse all available stadiums and sports fields
  - Detailed venue information with galleries
  - Facility listings (parking, restrooms, changing rooms, etc.)
  - Google Maps integration for location
  - Field specifications and pricing

- **📅 Smart Booking System**
  - Real-time field availability checker
  - Interactive date picker for booking dates
  - Hourly time slot selection
  - Multi-field booking in single cart
  - Automatic price calculation
  - Booking summary and confirmation
  - Unique booking code generation

- **💳 Booking Management**
  - Booking code tracking
  - Contact information collection
  - Document upload support (for academic bookings)
  - Booking status tracking
  - Order history

### Admin Features

- **🔐 Admin Authentication**
  - Secure login system
  - JWT token management
  - Protected admin routes
  - Session persistence

- **📊 Comprehensive Dashboard**
  - Booking statistics and analytics
  - Revenue tracking
  - Visual charts with Chart.js
  - Activity monitoring
  - Recent bookings overview

- **🏟️ Venue Management**
  - Create, edit, and delete stadiums
  - Multi-image upload for venues
  - Facility management
  - Status control (Active/Inactive)
  - Location mapping

- **⚽ Field Management**
  - Add and manage sports fields
  - Field image galleries
  - Pricing configuration
  - Field availability control
  - Sports type categorization

- **📋 Booking Administration**
  - View all bookings
  - Booking status management (Pending/Approved/Cancelled/Done)
  - Payment status tracking (Unpaid/Paid)
  - Booking details and customer info
  - Search and filter functionality

- **🎛️ Operating Hours**
  - Configure daily operating hours
  - System-wide time restrictions
  - Open and close hour management

- **📅 Schedule View**
  - Visual calendar view of bookings
  - Field occupancy tracking
  - Conflict detection

### User Experience

- **🎨 Responsive Design**
  - Mobile-optimized interface
  - Tablet and desktop support
  - Touch-friendly interactions
  - Smooth animations and transitions

- **🔍 Smart Search**
  - Search functionality across venues
  - Filter by sports type

- **📸 Image Galleries**
  - Multiple images per venue/field
  - Lightbox image viewer
  - Lazy loading for performance

---

## 🛠 Tech Stack

### Core Technologies

| Technology          | Version    | Purpose                              |
|---------------------|------------|--------------------------------------|
| **Nuxt 3**          | ^4.2.0     | Vue.js full-stack framework          |
| **Vue.js**          | ^3.5.22    | Progressive JavaScript framework     |
| **TypeScript**      | ^5.9.3     | Type-safe programming language       |
| **Tailwind CSS**    | ^3.4.18    | Utility-first CSS framework          |
| **GraphQL**         | ^15.10.1   | API query language                   |
| **Chart.js**        | ^4.5.1     | Data visualization library           |
| **Day.js**          | ^1.11.19   | Date manipulation library            |

### Key Libraries & Tools

- **@nuxtjs/tailwindcss** - Tailwind CSS integration for Nuxt
- **@nuxt/image** - Optimized image component
- **@nuxt/content** - File-based CMS
- **@iconify/vue** - Icon library with thousands of icons
- **@vueuse/core** - Collection of Vue Composition utilities
- **@floating-ui/vue** - Tooltip and popover positioning
- **vue-chartjs** - Vue wrapper for Chart.js
- **graphql-tag** - GraphQL query parser
- **jsonwebtoken** - JWT authentication
- **minio** - MinIO client for file uploads
- **ofetch** - Better fetch API

---

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** >= 18.x
- **npm**, **yarn**, **pnpm**, or **bun**
- **Backend API** - DIPSPORT-BE running
- **Git**

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/dipo-devs/DIPSPORT-FE.git
cd DIPSPORT-FE
```

### 2. Install Dependencies

```bash
# Using npm
npm install

# Using pnpm
pnpm install

# Using yarn
yarn install

# Using bun
bun install
```

### 3. Environment Setup

Create a `.env` file in the root directory:

```env
# API Configuration
NUXT_PUBLIC_API_BASE_URL=http://localhost:4000

# GraphQL Endpoint
NUXT_PUBLIC_GRAPHQL_ENDPOINT=http://localhost:4000/graphql

# MinIO Configuration
NUXT_PUBLIC_MINIO_ENDPOINT=localhost
NUXT_PUBLIC_MINIO_PORT=9000
NUXT_PUBLIC_MINIO_USE_SSL=false
NUXT_PUBLIC_MINIO_BUCKET_NAME=bucket_name

# Application Configuration
NUXT_PUBLIC_APP_NAME="VENUE UNDIP"
NUXT_PUBLIC_APP_URL=http://localhost:3000

# Server API Routes
API_BASE_URL=http://localhost:4000
GRAPHQL_ENDPOINT=http://localhost:4000/graphql
```

### 4. Start Development Server

```bash
# Using npm
npm run dev

# Using pnpm
pnpm dev

# Using yarn
yarn dev

# Using bun
bun run dev
```

The application will be available at `http://localhost:3000`

### 5. Build for Production

```bash
# Build the application
npm run build

# Preview production build
npm run preview
```

---

## 🔧 Environment Variables

| Variable                          | Description                          | Required | Default                        |
|-----------------------------------|--------------------------------------|----------|--------------------------------|
| `NUXT_PUBLIC_API_BASE_URL`        | Backend API base URL                 | **Yes**  | `http://localhost:4000`        |
| `NUXT_PUBLIC_GRAPHQL_ENDPOINT`    | GraphQL API endpoint                 | **Yes**  | `http://localhost:4000/graphql`|
| `NUXT_PUBLIC_MINIO_ENDPOINT`      | MinIO server endpoint                | **Yes**  | `localhost`                    |
| `NUXT_PUBLIC_MINIO_PORT`          | MinIO server port                    | **Yes**  | `9000`                         |
| `NUXT_PUBLIC_MINIO_USE_SSL`       | Enable SSL for MinIO                 | No       | `false`                        |
| `NUXT_PUBLIC_MINIO_BUCKET_NAME`   | MinIO bucket name                    | **Yes**  | `bucket_name`                  |
| `NUXT_PUBLIC_APP_NAME`            | Application name                     | No       | `VENUE UNDIP`                  |
| `NUXT_PUBLIC_APP_URL`             | Application URL                      | No       | `http://localhost:3000`        |
| `API_BASE_URL`                    | Server-side API base URL             | **Yes**  | `http://localhost:4000`        |
| `GRAPHQL_ENDPOINT`                | Server-side GraphQL endpoint         | **Yes**  | `http://localhost:4000/graphql`|

---

## 📁 Project Structure

```
DIPSPORT-FE/
├── app.vue                                 # Root application component
├── error.vue                               # Error page component
├── nuxt.config.ts                          # Nuxt configuration
├── tailwind.config.ts                      # Tailwind CSS configuration
├── tsconfig.json                           # TypeScript configuration
├── eslint.config.mjs                       # ESLint configuration
│
├── assets/
│   ├── css/
│   │   └── tailwind.css                    # Global styles and Tailwind imports
│   └── images/                             # Static images
│
├── components/
│   ├── ConfirmationModal.vue               # Reusable confirmation dialog
│   ├── PlaceholderImage.vue                # Image placeholder component
│   ├── SmartDatePicker.vue                 # Custom date picker
│   │
│   ├── admin/                              # Admin-specific components
│   │   ├── AdminSidebar.vue                # Admin navigation sidebar
│   │   ├── Footer.vue                      # Admin footer
│   │   └── TopBar.vue                      # Admin top navigation
│   │
│   └── client/                             # Public-facing components
│       ├── Footer.vue                      # Client footer
│       └── TopBar.vue                      # Client navigation
│
├── composables/
│   ├── useAdminLayout.ts                   # Admin layout state management
│   ├── useAuthSession.ts                   # Authentication logic
│   ├── useBookingCart.ts                   # Booking cart state
│   ├── useConfirmation.ts                  # Confirmation modal logic
│   ├── useDashboardLogic.ts                # Dashboard data and logic
│   ├── usePagination.ts                    # Pagination utilities
│   └── useSearch.ts                        # Search functionality
│
├── graphql/
│   ├── mutations/                          # GraphQL mutations
│   │   ├── create_booking.ts               # Create booking mutation
│   │   ├── create_facility.ts              # Create facility mutation
│   │   ├── create_field.ts                 # Create field mutation
│   │   ├── create_stadion.ts               # Create stadium mutation
│   │   ├── delete_facility.ts              # Delete facility mutation
│   │   ├── delete_field_image.ts           # Delete field image mutation
│   │   ├── delete_field.ts                 # Delete field mutation
│   │   ├── delete_stadion_image.ts         # Delete stadium image mutation
│   │   ├── delete_stadion.ts               # Delete stadium mutation
│   │   ├── login.ts                        # Admin login mutation
│   │   ├── update_book_status.ts           # Update booking status mutation
│   │   ├── update_facility.ts              # Update facility mutation
│   │   ├── update_field.ts                 # Update field mutation
│   │   ├── update_operating_hour.ts        # Update operating hours mutation
│   │   ├── update_payment.ts               # Update payment status mutation
│   │   └── update_stadion.ts               # Update stadium mutation
│   │
│   └── queries/                            # GraphQL queries
│       ├── get_booking_bookingCode.ts      # Get booking by code query
│       ├── get_bookings.ts                 # Get all bookings query
│       ├── get_facilities.ts               # Get facilities query
│       ├── get_facility_by_id.ts           # Get facility by ID query
│       ├── get_field_by_id.ts              # Get field by ID query
│       ├── get_fields.ts                   # Get all fields query
│       ├── get_operating_hours.ts          # Get operating hours query
│       ├── get_stadion_by_id.ts            # Get stadium by ID query
│       └── get_stadions.ts                 # Get all stadiums query
│
├── layouts/
│   ├── admin.vue                           # Admin dashboard layout
│   ├── auth.vue                            # Authentication page layout
│   └── default.vue                         # Default public layout
│
├── middleware/
│   └── auth-admin.ts                       # Admin route protection
│
├── pages/
│   ├── index.vue                           # Homepage
│   │
│   ├── admin/
│   │   ├── index.vue                       # Admin dashboard
│   │   ├── login.vue                       # Admin login page
│   │   ├── schedules.vue                   # Booking schedules view
│   │   │
│   │   ├── bookings/
│   │   │   ├── index.vue                   # Bookings list
│   │   │   └── [id]/                       # Booking detail pages
│   │   │
│   │   ├── facilities/
│   │   │   ├── index.vue                   # Facilities list
│   │   │   ├── create.vue                  # Create facility
│   │   │   └── [id].vue                    # Edit facility
│   │   │
│   │   ├── fields/
│   │   │   ├── index.vue                   # Fields list
│   │   │   ├── create.vue                  # Create field
│   │   │   └── [id].vue                    # Edit field
│   │   │
│   │   └── stadiums/
│   │       ├── index.vue                   # Stadiums list
│   │       ├── create.vue                  # Create stadium
│   │       └── [id].vue                    # Edit stadium
│   │
│   ├── booking/
│   │   └── order.vue                       # Booking order page
│   │
│   └── venues/
│       └── [id].vue                        # Venue detail and booking
│
├── server/
│   └── api/                                # Nuxt server routes
│       ├── graphql.ts                      # GraphQL proxy
│       ├── public-bookings.get.ts          # Public bookings endpoint
│       │
│       ├── auth/                           # Authentication endpoints
│       │   ├── login.post.ts               # Login handler
│       │   ├── logout.post.ts              # Logout handler
│       │   └── me.get.ts                   # Current user info
│       │
│       ├── bookings/                       # Booking endpoints
│       │   ├── index.get.ts                # Get bookings
│       │   ├── create.post.ts              # Create booking
│       │   ├── check-availability.post.ts  # Check availability
│       │   └── [bookingCode]/              # Booking by code
│       │
│       ├── facilities/                     # Facility endpoints
│       │   ├── index.get.ts                # Get facilities
│       │   ├── create.post.ts              # Create facility
│       │   ├── update.post.ts              # Update facility
│       │   ├── delete.post.ts              # Delete facility
│       │   └── [id].get.ts                 # Get facility by ID
│       │
│       ├── fields/                         # Field endpoints
│       │   ├── index.get.ts                # Get fields
│       │   ├── create.post.ts              # Create field
│       │   ├── update.post.ts              # Update field
│       │   ├── delete.post.ts              # Delete field
│       │   ├── delete-image.post.ts        # Delete field image
│       │   └── [id].get.ts                 # Get field by ID
│       │
│       ├── operating-hours/                # Operating hours endpoints
│       │
│       └── stadions/                       # Stadium endpoints
│
├── utils/
│   ├── constants.ts                        # Application constants
│   ├── errorParser.ts                      # Error parsing utilities
│   ├── generateTimeSlots.ts                # Time slot generator
│   ├── getNext7Days.ts                     # Date helper
│   ├── normalizers.ts                      # Data normalization
│   ├── validIconList.ts                    # Icon validation
│   │
│   └── minio/                              # MinIO utilities
│       ├── minioClient.ts                  # MinIO client setup
│       └── minioServices.ts                # MinIO service functions
│
├── public/
│   └── robots.txt                          # SEO robots file
│
├── .env                                    # Environment variables
├── package.json                            # Project dependencies
└── README.md                               # Project documentation
```

---

## 🧩 Key Components

### Public Components

#### `client/TopBar.vue`
- Navigation header for public pages
- Logo and menu items
- Responsive mobile menu
- Call-to-action buttons

#### `client/Footer.vue`
- Site footer with links
- Contact information
- Social media links

#### `SmartDatePicker.vue`
- Custom date picker component
- Disabled past dates
- Date range selection
- Integration with booking flow

#### `PlaceholderImage.vue`
- Image component with fallback
- Loading states
- Error handling
- Lazy loading

### Admin Components

#### `admin/AdminSidebar.vue`
- Navigation sidebar for admin panel
- Menu items with icons
- Active route highlighting
- Collapsible on mobile

#### `admin/TopBar.vue`
- Admin header with user info
- Logout functionality
- Breadcrumb navigation
- Notifications

#### `ConfirmationModal.vue`
- Reusable confirmation dialog
- Customizable messages
- Accept/Cancel actions
- Used for delete confirmations

---

## 🎨 Layouts & Pages

### Layouts

#### `default.vue`
- Public-facing layout
- Includes client TopBar and Footer
- Used for homepage and venue pages

#### `admin.vue`
- Admin dashboard layout
- Includes AdminSidebar and admin TopBar
- Protected by authentication middleware

#### `auth.vue`
- Authentication page layout
- Clean, centered design for login pages

### Key Pages

#### Public Pages

- **`/`** - Homepage with venue listings
- **`/venues/[id]`** - Venue detail with booking form
- **`/booking/order`** - Booking confirmation and checkout

#### Admin Pages

- **`/admin`** - Dashboard with statistics and charts
- **`/admin/login`** - Admin login page
- **`/admin/stadiums`** - Stadium management
- **`/admin/fields`** - Field management
- **`/admin/facilities`** - Facility management
- **`/admin/bookings`** - Booking management
- **`/admin/schedules`** - Calendar view of bookings

---

## 💾 State Management

### Composables (Vue Composition API)

#### `useAuthSession.ts`
- Manages admin authentication state
- JWT token handling
- Login/logout logic
- Session persistence

#### `useBookingCart.ts`
- Shopping cart for field bookings
- Add/remove field selections
- Price calculations
- Booking data management

#### `useDashboardLogic.ts`
- Dashboard statistics
- Chart data preparation
- Analytics calculations

#### `usePagination.ts`
- Reusable pagination logic
- Page size configuration
- Navigation helpers

#### `useSearch.ts`
- Search functionality
- Filter logic
- Debounced search

#### `useConfirmation.ts`
- Confirmation modal state
- Promise-based confirmations
- Customizable messages

---

## 🔌 GraphQL Integration

### Query Management

GraphQL queries and mutations are organized in the `graphql/` directory:

- **Queries** - Data fetching operations
- **Mutations** - Create, update, delete operations

### Example Usage

```typescript
// In a Vue component
const { data, error } = await useFetch('/api/graphql', {
  method: 'POST',
  body: {
    query: GET_STADIONS_QUERY,
    variables: {}
  }
})
```

### Server API Routes

Nuxt server routes act as a proxy layer between the frontend and backend GraphQL API:

- Request validation
- Error handling
- Response transformation
- Authentication forwarding

---

## 💻 Development

### Available Scripts

| Command               | Description                          |
|-----------------------|--------------------------------------|
| `npm run dev`         | Start development server             |
| `npm run build`       | Build for production                 |
| `npm run generate`    | Generate static site                 |
| `npm run preview`     | Preview production build             |
| `npm run postinstall` | Prepare Nuxt after install           |

### Development Workflow

1. **Start Development Server**
   ```bash
   npm run dev
   ```

2. **Make Changes**
   - Edit components in `components/`
   - Add pages in `pages/`
   - Create composables in `composables/`

3. **Hot Module Replacement**
   - Changes are automatically reflected
   - Fast refresh for Vue components

4. **Testing**
   - Test in browser at `http://localhost:3000`
   - Check responsive design
   - Verify GraphQL integration

### Code Quality

- **TypeScript** for type safety
- **ESLint** for code linting
- **Tailwind CSS** for consistent styling
- **Vue 3 Composition API** for reactive logic

### Development Tips

- Use Vue DevTools for debugging
- Check Network tab for GraphQL requests
- Use Tailwind CSS IntelliSense extension
- Enable Nuxt DevTools for enhanced DX

---

## 🚀 Deployment

### Production Checklist

- [ ] Configure environment variables
- [ ] Build the application
- [ ] Test production build locally
- [ ] Set up hosting (Vercel, Netlify, etc.)
- [ ] Configure domain and SSL
- [ ] Set up CDN for static assets
- [ ] Enable caching strategies
- [ ] Configure monitoring and analytics
- [ ] Test all critical flows
- [ ] Set up error tracking (Sentry)

### Build for Production

```bash
# Build the application
npm run build

# Preview production build
npm run preview
```

### Static Site Generation (SSG)

```bash
# Generate static site
npm run generate

# Output will be in .output/public/
```

### Deployment Platforms

#### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

#### Netlify

```bash
# Install Netlify CLI
npm i -g netlify-cli

# Deploy
netlify deploy --prod
```

#### Node.js Server

```bash
# Build for Node.js
npm run build

# Start production server
node .output/server/index.mjs
```

### Environment Variables in Production

Make sure to set all required environment variables in your hosting platform:

- **Vercel**: Project Settings → Environment Variables
- **Netlify**: Site Settings → Environment Variables
- **Docker**: Use `.env` file or environment configuration

---

### Public Interface

*Homepage with venue listings*
- Clean and modern design
- Responsive grid layout
- Search and filter options

*Venue Detail Page*
- Image galleries
- Facility information
- Real-time booking form

*Booking Confirmation*
- Order summary
- Customer information form
- Payment instructions

### Admin Dashboard

*Dashboard Overview*
- Statistics cards
- Revenue charts
- Recent bookings list

*Venue Management*
- CRUD operations
- Image upload
- Facility assignment

*Booking Management*
- Booking list with filters
- Status management
- Payment tracking

---

## 👥 Team

### Development Team

- **Rico Aldy Kusuma**
- **Muhammad Irfan Irsyad**
- **Zoe Mohamed**

### Institution

**Program Magang DSTI - Universitas Diponegoro**  
*Periode: September 2025 - Desember 2025*

---

## 🔗 Related Repositories

- **Backend API**: [DIPSPORT-BE](https://github.com/dipo-devs/DIPSPORT-BE.git)

---

## 🙏 Acknowledgments

- **Universitas Diponegoro** - For project support and opportunity
- **Nuxt Team** - For the amazing framework
- **Vue.js Community** - For excellent ecosystem
- **Tailwind Labs** - For the utility-first CSS framework
- **Iconify** - For comprehensive icon library

---

## 📝 License

This project is developed as part of the internship program at Universitas Diponegoro and is intended for educational purposes.

---

<div align="center">

**Built with ❤️ by VENUE UNDIP Team**

*Making sports field booking seamless for Universitas Diponegoro community*

---

**[⬆ Back to Top](#-venue-undip---sports-field-booking-platform-frontend)**

</div>
