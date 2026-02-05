# Property Rental Marketplace - MVP Development Plan

## 🎯 Project Overview
A two-sided marketplace connecting property owners (landlords) with tenants. Full-stack TypeScript application with Next.js frontend and Express backend.

## 📋 Day 1 MVP Features
- ✅ User authentication (Email/Password) with landlord/tenant roles
- ✅ Property listings with multiple photos
- ✅ Advanced search with filters (price, location, amenities, size)
- ✅ Interactive map view with property markers
- ✅ Tenant application submission with document uploads
- ✅ Landlord dashboard for managing properties
- ✅ In-app messaging between landlords and tenants
- ✅ Lease agreement generation and digital signatures
- ✅ Maintenance request tracking system
- ✅ Review and rating system for both parties
- ✅ Virtual tours and availability calendar

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + shadcn/ui
- **State Management**: React Context + React Query
- **Maps**: Mapbox GL JS / Leaflet
- **File Upload**: Cloudinary
- **Forms**: React Hook Form + Zod validation
- **Date Handling**: date-fns
- **HTTP Client**: Axios

### Backend
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: MongoDB + Mongoose
- **Authentication**: JWT + bcrypt
- **File Upload**: Cloudinary SDK
- **Validation**: Zod
- **Real-time**: Socket.io (for messaging)
- **PDF Generation**: PDFKit (for lease agreements)

### DevOps
- **Package Manager**: npm/yarn
- **Environment**: .env files
- **CORS**: cors middleware

---

## 📁 Project Structure

```
property-rental-marketplace/
├── frontend/                    # Next.js application
│   ├── src/
│   │   ├── app/
│   │   │   ├── (auth)/
│   │   │   │   ├── login/
│   │   │   │   └── register/
│   │   │   ├── (dashboard)/
│   │   │   │   ├── landlord/
│   │   │   │   │   ├── properties/
│   │   │   │   │   ├── applications/
│   │   │   │   │   └── maintenance/
│   │   │   │   └── tenant/
│   │   │   │       ├── search/
│   │   │   │       ├── applications/
│   │   │   │       └── maintenance/
│   │   │   ├── properties/
│   │   │   │   └── [id]/
│   │   │   ├── messages/
│   │   │   └── layout.tsx
│   │   ├── components/
│   │   │   ├── ui/              # shadcn components
│   │   │   ├── property/
│   │   │   │   ├── PropertyCard.tsx
│   │   │   │   ├── PropertyFilters.tsx
│   │   │   │   ├── PropertyMap.tsx
│   │   │   │   └── VirtualTour.tsx
│   │   │   ├── application/
│   │   │   │   ├── ApplicationForm.tsx
│   │   │   │   └── DocumentUpload.tsx
│   │   │   ├── messaging/
│   │   │   │   ├── ChatList.tsx
│   │   │   │   └── MessageThread.tsx
│   │   │   ├── lease/
│   │   │   │   ├── LeaseGenerator.tsx
│   │   │   │   └── SignaturePad.tsx
│   │   │   └── layout/
│   │   │       ├── Navbar.tsx
│   │   │       └── Sidebar.tsx
│   │   ├── lib/
│   │   │   ├── api.ts            # Axios instance
│   │   │   ├── auth.ts           # Auth helpers
│   │   │   ├── cloudinary.ts     # Upload helpers
│   │   │   └── socket.ts         # Socket.io client
│   │   ├── hooks/
│   │   │   ├── useAuth.ts
│   │   │   ├── useProperties.ts
│   │   │   └── useMessages.ts
│   │   ├── context/
│   │   │   └── AuthContext.tsx
│   │   ├── types/
│   │   │   └── index.ts
│   │   └── utils/
│   │       └── validation.ts      # Zod schemas
│   ├── public/
│   ├── package.json
│   ├── tsconfig.json
│   ├── tailwind.config.ts
│   └── next.config.js
│
├── backend/                     # Express application
│   ├── src/
│   │   ├── config/
│   │   │   ├── database.ts
│   │   │   ├── cloudinary.ts
│   │   │   └── socket.ts
│   │   ├── models/
│   │   │   ├── User.ts
│   │   │   ├── Property.ts
│   │   │   ├── Application.ts
│   │   │   ├── Message.ts
│   │   │   ├── Lease.ts
│   │   │   ├── MaintenanceRequest.ts
│   │   │   └── Review.ts
│   │   ├── controllers/
│   │   │   ├── authController.ts
│   │   │   ├── propertyController.ts
│   │   │   ├── applicationController.ts
│   │   │   ├── messageController.ts
│   │   │   ├── leaseController.ts
│   │   │   ├── maintenanceController.ts
│   │   │   └── reviewController.ts
│   │   ├── routes/
│   │   │   ├── auth.ts
│   │   │   ├── properties.ts
│   │   │   ├── applications.ts
│   │   │   ├── messages.ts
│   │   │   ├── leases.ts
│   │   │   ├── maintenance.ts
│   │   │   └── reviews.ts
│   │   ├── middleware/
│   │   │   ├── auth.ts
│   │   │   ├── errorHandler.ts
│   │   │   └── validation.ts
│   │   ├── utils/
│   │   │   ├── jwt.ts
│   │   │   ├── pdfGenerator.ts
│   │   │   └── cloudinaryUpload.ts
│   │   ├── types/
│   │   │   └── index.ts
│   │   └── server.ts
│   ├── package.json
│   └── tsconfig.json
│
└── README.md
```

---

## 🗄️ Database Schema (MongoDB/Mongoose)

### 1. User Model
```typescript
{
  _id: ObjectId,
  email: string (unique, required),
  password: string (hashed, required),
  role: enum ['landlord', 'tenant'] (required),
  profile: {
    firstName: string,
    lastName: string,
    phone: string,
    avatar: string (cloudinary URL),
    bio: string
  },
  verified: boolean (default: false),
  createdAt: Date,
  updatedAt: Date
}

Indexes: email, role
```

### 2. Property Model
```typescript
{
  _id: ObjectId,
  landlord: ObjectId (ref: User),
  title: string (required),
  description: string (required),
  type: enum ['apartment', 'house', 'condo', 'commercial', 'other'],
  
  address: {
    street: string,
    city: string (required),
    state: string (required),
    zipCode: string,
    country: string (required),
    coordinates: {
      lat: number (required),
      lng: number (required)
    }
  },
  
  pricing: {
    monthlyRent: number (required),
    securityDeposit: number,
    utilitiesIncluded: boolean
  },
  
  details: {
    bedrooms: number (required),
    bathrooms: number (required),
    size: number (sq ft),
    furnished: boolean,
    petsAllowed: boolean,
    smokingAllowed: boolean
  },
  
  amenities: string[] (e.g., ['parking', 'gym', 'pool', 'ac']),
  
  media: {
    photos: string[] (cloudinary URLs, max 20),
    virtualTourUrl: string (optional)
  },
  
  availability: {
    status: enum ['available', 'rented', 'pending'],
    availableFrom: Date,
    leaseDuration: number (months)
  },
  
  viewingSlots: [{
    date: Date,
    timeSlot: string (e.g., '10:00-11:00'),
    booked: boolean
  }],
  
  stats: {
    views: number (default: 0),
    applications: number (default: 0),
    averageRating: number (default: 0)
  },
  
  createdAt: Date,
  updatedAt: Date
}

Indexes: landlord, 'address.city', 'pricing.monthlyRent', 'availability.status', 'address.coordinates' (2dsphere)
```

### 3. Application Model
```typescript
{
  _id: ObjectId,
  property: ObjectId (ref: Property),
  tenant: ObjectId (ref: User),
  landlord: ObjectId (ref: User),
  
  status: enum ['pending', 'approved', 'rejected', 'withdrawn'] (default: 'pending'),
  
  personalInfo: {
    occupation: string,
    employer: string,
    annualIncome: number,
    moveInDate: Date
  },
  
  documents: [{
    type: enum ['id', 'payslip', 'employment_letter', 'reference', 'other'],
    url: string (cloudinary URL),
    name: string,
    uploadedAt: Date
  }],
  
  references: [{
    name: string,
    relationship: string,
    phone: string,
    email: string
  }],
  
  additionalInfo: string,
  
  landlordNotes: string,
  
  createdAt: Date,
  updatedAt: Date
}

Indexes: property, tenant, landlord, status
```

### 4. Message Model
```typescript
{
  _id: ObjectId,
  conversationId: string (unique identifier for thread),
  participants: [ObjectId] (refs: User, exactly 2),
  
  messages: [{
    sender: ObjectId (ref: User),
    content: string (required),
    read: boolean (default: false),
    timestamp: Date (default: now)
  }],
  
  relatedProperty: ObjectId (ref: Property, optional),
  
  lastMessageAt: Date,
  
  createdAt: Date,
  updatedAt: Date
}

Indexes: conversationId, participants, lastMessageAt
```

### 5. Lease Model
```typescript
{
  _id: ObjectId,
  property: ObjectId (ref: Property),
  landlord: ObjectId (ref: User),
  tenant: ObjectId (ref: User),
  application: ObjectId (ref: Application),
  
  terms: {
    startDate: Date (required),
    endDate: Date (required),
    monthlyRent: number (required),
    securityDeposit: number,
    paymentDueDate: number (1-31),
    lateFeesPolicy: string,
    terminationNotice: number (days)
  },
  
  responsibilities: {
    landlord: string[],
    tenant: string[]
  },
  
  additionalClauses: string,
  
  status: enum ['draft', 'pending_signatures', 'active', 'expired', 'terminated'],
  
  signatures: {
    landlord: {
      signed: boolean,
      signatureData: string (base64),
      signedAt: Date
    },
    tenant: {
      signed: boolean,
      signatureData: string (base64),
      signedAt: Date
    }
  },
  
  documentUrl: string (generated PDF on Cloudinary),
  
  createdAt: Date,
  updatedAt: Date
}

Indexes: property, landlord, tenant, status
```

### 6. MaintenanceRequest Model
```typescript
{
  _id: ObjectId,
  property: ObjectId (ref: Property),
  tenant: ObjectId (ref: User),
  landlord: ObjectId (ref: User),
  
  title: string (required),
  description: string (required),
  category: enum ['plumbing', 'electrical', 'heating', 'appliance', 'structural', 'other'],
  priority: enum ['low', 'medium', 'high', 'urgent'] (default: 'medium'),
  
  status: enum ['submitted', 'acknowledged', 'in_progress', 'completed', 'cancelled'],
  
  photos: string[] (cloudinary URLs),
  
  landlordResponse: string,
  resolutionNotes: string,
  
  timeline: [{
    status: string,
    note: string,
    updatedBy: ObjectId (ref: User),
    timestamp: Date
  }],
  
  createdAt: Date,
  updatedAt: Date,
  completedAt: Date
}

Indexes: property, tenant, landlord, status, priority
```

### 7. Review Model
```typescript
{
  _id: ObjectId,
  
  reviewer: ObjectId (ref: User),
  reviewee: ObjectId (ref: User),
  property: ObjectId (ref: Property),
  lease: ObjectId (ref: Lease),
  
  reviewerRole: enum ['landlord', 'tenant'],
  
  rating: number (1-5, required),
  
  criteria: {
    communication: number (1-5),
    cleanliness: number (1-5),
    respectfulness: number (1-5),
    // For landlord reviews by tenants:
    responsiveness: number (1-5),
    propertyCondition: number (1-5),
    // For tenant reviews by landlords:
    paymentTimeliness: number (1-5),
    propertyMaintenance: number (1-5)
  },
  
  comment: string,
  
  response: string (optional, from reviewee),
  
  helpful: number (default: 0),
  
  createdAt: Date,
  updatedAt: Date
}

Indexes: reviewer, reviewee, property, reviewerRole
```

---

## 🚀 Implementation Plan (Day 1 Build)

### Phase 1: Setup (1 hour)

#### Backend Setup
```bash
mkdir backend && cd backend
npm init -y
npm install express mongoose dotenv cors bcryptjs jsonwebtoken socket.io cloudinary multer pdfkit
npm install -D typescript @types/node @types/express @types/cors @types/bcryptjs @types/jsonwebtoken ts-node nodemon
npx tsc --init
```

#### Frontend Setup
```bash
npx create-next-app@latest frontend --typescript --tailwind --app
cd frontend
npx shadcn-ui@latest init
npm install axios react-query socket.io-client date-fns react-hook-form zod @hookform/resolvers
npm install leaflet react-leaflet @types/leaflet
npm install cloudinary
```

### Phase 2: Backend Core (3 hours)

**Priority Order:**
1. ✅ Database connection & User model (30 min)
2. ✅ Auth routes (register, login, JWT middleware) (45 min)
3. ✅ Property model & CRUD routes (45 min)
4. ✅ Application model & routes (30 min)
5. ✅ Message model & Socket.io setup (30 min)
6. ✅ Lease, Maintenance, Review models & routes (30 min)

**Key Files to Build:**
- `src/config/database.ts` - MongoDB connection
- `src/config/cloudinary.ts` - Cloudinary config
- `src/middleware/auth.ts` - JWT verification
- `src/models/*` - All 7 models above
- `src/controllers/*` - Business logic
- `src/routes/*` - API endpoints
- `src/server.ts` - Express app + Socket.io

### Phase 3: Frontend Core (4 hours)

**Priority Order:**
1. ✅ Auth pages (login/register) + Context (45 min)
2. ✅ shadcn components setup (button, input, card, etc.) (30 min)
3. ✅ Property listing page + search/filters (1 hour)
4. ✅ Property detail page + application form (45 min)
5. ✅ Dashboard layouts (landlord/tenant) (30 min)
6. ✅ Messaging interface (45 min)
7. ✅ Map view integration (30 min)

**Key Files to Build:**
- `src/context/AuthContext.tsx` - Global auth state
- `src/lib/api.ts` - Axios instance with interceptors
- `src/components/property/PropertyCard.tsx` - Reusable card
- `src/components/property/PropertyFilters.tsx` - Search filters
- `src/app/(dashboard)/tenant/search/page.tsx` - Main search page
- `src/app/properties/[id]/page.tsx` - Property details

### Phase 4: Advanced Features (2 hours)

**Priority Order:**
1. ✅ File upload (Cloudinary integration) (30 min)
2. ✅ Lease agreement generator (30 min)
3. ✅ Digital signatures (canvas-based) (30 min)
4. ✅ Maintenance request flow (30 min)

### Phase 5: Polish & Testing (30 min)

- ✅ Error handling
- ✅ Loading states
- ✅ Responsive design check
- ✅ Basic validation

---

## 🔑 Environment Variables

### Backend (.env)
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/property-rental
JWT_SECRET=your-super-secret-jwt-key-change-this
JWT_EXPIRES_IN=7d

CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

FRONTEND_URL=http://localhost:3000
```

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_SOCKET_URL=http://localhost:5000
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your-cloud-name
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=your-upload-preset
NEXT_PUBLIC_MAPBOX_TOKEN=your-mapbox-token
```

---

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Properties
- `GET /api/properties` - List properties (with filters)
- `GET /api/properties/:id` - Get single property
- `POST /api/properties` - Create property (landlord)
- `PUT /api/properties/:id` - Update property (landlord)
- `DELETE /api/properties/:id` - Delete property (landlord)
- `GET /api/properties/landlord/:userId` - Get landlord's properties

### Applications
- `POST /api/applications` - Submit application (tenant)
- `GET /api/applications/property/:propertyId` - Get property applications (landlord)
- `GET /api/applications/tenant/:userId` - Get tenant's applications
- `PUT /api/applications/:id/status` - Update application status (landlord)

### Messages
- `GET /api/messages/conversations` - Get user's conversations
- `GET /api/messages/:conversationId` - Get conversation messages
- `POST /api/messages` - Send message
- `PUT /api/messages/:messageId/read` - Mark as read

### Leases
- `POST /api/leases` - Create lease (landlord)
- `GET /api/leases/:id` - Get lease details
- `PUT /api/leases/:id/sign` - Sign lease (landlord/tenant)
- `GET /api/leases/property/:propertyId` - Get property lease

### Maintenance
- `POST /api/maintenance` - Create request (tenant)
- `GET /api/maintenance/property/:propertyId` - Get property requests
- `PUT /api/maintenance/:id/status` - Update status (landlord)

### Reviews
- `POST /api/reviews` - Create review
- `GET /api/reviews/user/:userId` - Get user reviews
- `GET /api/reviews/property/:propertyId` - Get property reviews

---

## 🎨 UI Components (shadcn/ui to install)

```bash
npx shadcn-ui@latest add button
npx shadcn-ui@latest add input
npx shadcn-ui@latest add card
npx shadcn-ui@latest add badge
npx shadcn-ui@latest add dialog
npx shadcn-ui@latest add dropdown-menu
npx shadcn-ui@latest add select
npx shadcn-ui@latest add textarea
npx shadcn-ui@latest add label
npx shadcn-ui@latest add tabs
npx shadcn-ui@latest add avatar
npx shadcn-ui@latest add calendar
npx shadcn-ui@latest add form
npx shadcn-ui@latest add toast
npx shadcn-ui@latest add slider
npx shadcn-ui@latest add checkbox
npx shadcn-ui@latest add radio-group
```

---

## 🎯 MVP Scope Decisions

### ✅ INCLUDED (Day 1)
- Full authentication system
- Property CRUD with photos
- Search with basic filters (price, location, bedrooms, bathrooms)
- Map view with markers (using Leaflet - free)
- Application submission with document uploads
- Real-time messaging (Socket.io)
- Basic lease generation with digital signatures
- Maintenance request tracking
- Review system

### ⏳ SIMPLIFIED (Day 1)
- **Virtual tours**: Link to external URL instead of 360° viewer
- **Advanced search**: Basic filters only (no complex radius search)
- **Lease PDF**: Simple template, not fully customizable
- **Signatures**: Canvas-based, not DocuSign integration
- **Notifications**: In-app only, no email notifications

### 🚫 EXCLUDED (Post-MVP)
- Payment processing (Stripe integration)
- Background checks / credit checks
- Automated lease renewals
- Rent payment tracking
- SMS notifications
- Calendar sync (Google Calendar)
- Multi-language support
- Advanced analytics dashboard

---

## 🏗️ Code Standards

### TypeScript
- ✅ Strict mode enabled
- ✅ No `any` types - use proper interfaces
- ✅ Use `type` for unions, `interface` for objects
- ✅ Export types from dedicated files

### React/Next.js
- ✅ Use functional components only
- ✅ Use Server Components by default
- ✅ Add 'use client' only when needed
- ✅ Custom hooks for reusable logic
- ✅ Proper error boundaries

### Styling
- ✅ Tailwind utility classes
- ✅ shadcn/ui for components
- ✅ Mobile-first responsive design
- ✅ Consistent spacing (4px grid)

### Code Quality
- ✅ Meaningful variable names
- ✅ Single responsibility functions
- ✅ DRY principle
- ✅ Comments for complex logic only
- ✅ Error handling with try-catch
- ✅ Input validation (Zod)

---

## 🧪 Quick Test Checklist

- [ ] Register as landlord
- [ ] Register as tenant
- [ ] Create property with photos
- [ ] Search and filter properties
- [ ] View property on map
- [ ] Submit application with documents
- [ ] Send message between users
- [ ] Generate and sign lease
- [ ] Create maintenance request
- [ ] Leave review

---

## 🚀 Deployment Quick Notes

### Backend (Render/Railway)
- Set environment variables
- Build command: `npm run build`
- Start command: `npm start`

### Frontend (Vercel)
- Auto-detects Next.js
- Set environment variables
- Connect GitHub repo

### Database (MongoDB Atlas)
- Free tier available
- Update MONGODB_URI in backend

---

## 📝 Development Commands

### Backend
```bash
npm run dev       # Start development server
npm run build     # Compile TypeScript
npm start         # Production server
```

### Frontend
```bash
npm run dev       # Start Next.js dev server
npm run build     # Production build
npm start         # Production server
npm run lint      # Run ESLint
```

---

## ⚡ Performance Tips

1. **Images**: Use Cloudinary transformations for thumbnails
2. **Pagination**: Limit to 20 properties per page
3. **Lazy Loading**: Use Next.js Image component
4. **Caching**: React Query for API calls
5. **Indexes**: MongoDB indexes on frequent queries
6. **Socket.io**: Rooms for targeted messaging

---

## 🔒 Security Checklist

- ✅ Hash passwords with bcrypt (10 rounds)
- ✅ Validate JWT on protected routes
- ✅ Sanitize user inputs
- ✅ Rate limiting on auth routes
- ✅ HTTPS in production
- ✅ CORS properly configured
- ✅ File upload size limits
- ✅ Role-based access control

---

## 📚 Key Dependencies

### Backend
```json
{
  "express": "^4.18.0",
  "mongoose": "^8.0.0",
  "jsonwebtoken": "^9.0.0",
  "bcryptjs": "^2.4.3",
  "socket.io": "^4.6.0",
  "cloudinary": "^1.40.0",
  "pdfkit": "^0.13.0",
  "cors": "^2.8.5",
  "dotenv": "^16.3.0"
}
```

### Frontend
```json
{
  "next": "14.0.0",
  "react": "^18.2.0",
  "axios": "^1.6.0",
  "react-query": "^3.39.0",
  "socket.io-client": "^4.6.0",
  "react-hook-form": "^7.48.0",
  "zod": "^3.22.0",
  "leaflet": "^1.9.0",
  "react-leaflet": "^4.2.0",
  "date-fns": "^2.30.0"
}
```

---

## 🎯 Success Metrics

After Day 1, you should have:
- ✅ Working authentication (both roles)
- ✅ 5+ properties can be created and searched
- ✅ Applications can be submitted
- ✅ Real-time messaging works
- ✅ Lease can be generated and signed
- ✅ Maintenance requests functional
- ✅ Reviews can be posted
- ✅ Fully responsive UI
- ✅ Deployed and accessible online

---

## 💡 Pro Tips

1. **Start with Backend**: Build API first, test with Postman/Thunder Client
2. **Use Thunder Client VSCode Extension**: Faster than Postman
3. **Seed Database**: Create script to add sample data
4. **Component Library First**: Install all shadcn components upfront
5. **Git Commits**: Commit after each major feature
6. **Mobile Testing**: Use Chrome DevTools mobile view
7. **Copy Existing Code**: Reuse components heavily (PropertyCard, etc.)
8. **Skip Perfection**: MVP = working > beautiful

---

## 🎬 Build Order Summary

**Hour 1**: Setup + Database + Auth
**Hour 2-3**: Property system + Applications  
**Hour 4**: Messaging + Leases
**Hour 5-6**: Frontend pages + Components
**Hour 7**: Maintenance + Reviews
**Hour 8**: Polish + Testing + Deploy

---

## 📞 Getting Help

If stuck:
1. Check MongoDB connection first
2. Verify JWT token format
3. Check CORS configuration
4. Review Cloudinary setup
5. Test API endpoints in isolation

---

**Remember**: Focus on FUNCTIONAL over PERFECT. Ship it, then iterate!

Good luck! 🚀