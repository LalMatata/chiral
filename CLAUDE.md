# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

CHIRAL Robotics Website - A modern React-based bilingual promotional website for CHIRAL, Israel's premier provider of advanced quadruped robotics solutions. The website serves as the primary digital presence for lead generation and brand establishment in the Israeli market.

## Common Development Commands

### Development
```bash
# Install dependencies (using PNPM)
pnpm install

# Start development server (runs on localhost)
pnpm run dev

# Start full development environment (frontend + backend server)
pnpm run dev:full

# Start backend server only
pnpm run server

# Build for production
pnpm run build

# Preview production build locally
pnpm run preview

# Run linter
pnpm run lint
```

### Deployment
```bash
# Build for production
pnpm run build

# Deploy according to your hosting platform
# Deployment commands are kept private for security
```

## High-Level Architecture

### Technology Stack
- **Framework**: React 19.1.0 with React Router DOM for routing
- **Build Tool**: Vite 6.3.5 for fast development and optimized builds
- **Styling**: Tailwind CSS v4 with custom design system
- **UI Components**: Shadcn/UI component library (located in `src/components/ui/`)
- **Package Manager**: PNPM (required - version specified in package.json)
- **Language Support**: Bilingual (English/Hebrew) with RTL support

### Code Structure

The application follows a component-based architecture with clear separation of concerns:

1. **Entry Points**:
   - `src/main.jsx` - Application entry point
   - `src/App.jsx` - Main component with routing setup

2. **Core Components** (`src/components/`):
   - `Header.jsx` - Navigation and language toggle
   - `Footer.jsx` - Footer with links and contact info
   - `pages/` - Page components for each route:
     - `Home.jsx` - Landing page with hero section
     - `Products.jsx` - Product catalog
     - `ProductDetail.jsx` - Individual product pages (uses route params)
     - `Applications.jsx` - Industry applications showcase
     - `About.jsx` - Company information
     - `Contact.jsx` - Contact forms and information

3. **UI Component Library** (`src/components/ui/`):
   - Pre-built Shadcn/UI components using Radix UI primitives
   - All components follow consistent styling patterns
   - Components are self-contained and reusable

4. **Context Management** (`src/contexts/`):
   - `LanguageContext.jsx` - Manages bilingual content and language switching
   - Provides global language state and translation functions

5. **Styling**:
   - Global styles in `src/index.css` and `src/App.css`
   - Tailwind CSS configuration with custom design tokens
   - Component-level styling using Tailwind utility classes

6. **Assets** (`src/assets/`):
   - Product images organized by category
   - Company and application images
   - All images optimized for web performance

### Key Design Patterns

1. **Bilingual Support**:
   - All content stored in `LanguageContext` with `en` and `he` translations
   - Language switching persists across navigation
   - RTL layout automatically applied for Hebrew

2. **Routing**:
   - React Router DOM v7 for client-side routing
   - Dynamic product pages using route parameters
   - All routes defined in `App.jsx`

3. **Component Architecture**:
   - Functional components with React Hooks
   - Consistent prop passing patterns
   - Error boundaries for robustness

4. **State Management**:
   - Local component state for UI interactions
   - Context API for global language state
   - No external state management library needed

### Performance Considerations

- Code splitting enabled through Vite
- Image lazy loading for optimal performance
- Tailwind CSS purging for minimal CSS bundle
- Component memoization where beneficial

## Project Structure

### Organized Directory Layout
```
chiral_repo/
├── src/                    # Frontend source code
│   ├── components/         # React components
│   ├── contexts/          # React contexts (LanguageContext)
│   ├── assets/            # Images and static assets
│   └── utils/             # Frontend utilities
├── docs/                  # Documentation (organized by category)
│   ├── brand/             # Product docs and PDFs
│   ├── deployment/        # Deployment guides
│   ├── development/       # Development docs
│   └── testing/           # Test plans and reports
├── tests/                 # Test files (organized by type)
│   ├── frontend/          # Frontend test files
│   ├── security/          # Security test results
│   └── validation/        # Validation and performance tests
├── database/              # SQLite database and models
├── routes/                # Express.js API routes
├── services/              # Backend services (EmailQueue)
├── middleware/            # Authentication middleware
├── archive/               # Legacy/unused files
├── data/                  # Database files (leads, brochures)
└── uploads/               # File upload storage
```

### Key Documentation Locations
- **Brand & Products**: `docs/brand/` - Product specifications, PDFs
- **Development**: `docs/development/` - Setup guides, bug tracking
- **Deployment**: `docs/deployment/` - DNS, marketing, deployment guides
- **Testing**: `docs/testing/` - Test plans, security assessments
- **Project Status**: `PROJECT_STATUS.md` - Current completion status

## Important Notes

- Always use PNPM for package management (not npm or yarn)
- The project uses absolute imports with `@/` alias pointing to `src/`
- ESLint is configured with React-specific rules
- The website deployment URL is kept private for security
- Full-stack application with Express.js backend for lead management and email handling
- Backend includes SQLite database, email queue system, and admin dashboard
- No environment variables required for basic functionality
- All content translations must be added to both `en` and `he` objects in LanguageContext

### Backend Features
- Lead management system with SQLite database
- Email queue and automated follow-up system
- Admin dashboard for managing leads and email templates
- File upload handling for brochures
- RESTful API endpoints for frontend integration

## 🔒 Security and Privacy

### Sensitive Information Protection
**CRITICAL**: The following information is NEVER uploaded to GitHub:

#### 🔑 Protected API Keys and Credentials
- `RESEND_API_KEY` - Email service API key
- `JWT_SECRET` - JSON Web Token signing key  
- `ADMIN_API_KEY` - Administrator API key
- `GA_MEASUREMENT_ID` - Google Analytics tracking ID
- `FACEBOOK_PIXEL_ID` - Facebook Pixel tracking ID
- `BAIDU_ANALYTICS_ID` - Baidu Analytics ID
- Vercel/deployment platform API tokens
- GitHub Personal Access Tokens

#### 📄 Proprietary Content Protection
- Product PDF documents (copyright protected third-party content)
- `docs/brand/PDF files/` - All product specification PDFs
- `docs/brand/CHIRAL_Product_Database.md` - Product database
- `docs/brand/CHIRAL_Product_Summary.md` - Product summaries
- `archive/` folder - Contains experimental code and proprietary processing tools

#### 🌐 Deployment and Personal Information
- Production website URLs and preview links
- Personal email addresses
- Company-specific email configurations
- Deployment platform credentials
- SEO strategy configurations

### Security Configuration Files
- **Security Guide**: `docs/deployment/SECURITY_SETUP.md`
- **Environment Template**: `.env.example` (use to create local `.env`)
- **Protected Patterns**: See comprehensive `.gitignore` configuration

### Development Security Practices
1. **Environment Variables**: Copy `.env.example` to `.env` and fill with real values
2. **Local Storage**: Keep sensitive files in local directories only
3. **Team Collaboration**: Share credentials through secure channels, never in code
4. **Regular Rotation**: Periodically update API keys and secrets

## Project History and Major Changes

### Recent Major Refactoring (August 2025)
1. **Repository Structure Reorganization**: 
   - Moved from 21+ root-level documentation files to organized `docs/` structure
   - Created `tests/` folder with categorized test files
   - Archived legacy content in `archive/` folder

2. **Security Implementation**:
   - Comprehensive `.gitignore` update to protect sensitive information
   - Removed proprietary PDF documents and product databases from git tracking
   - Hidden production URLs and deployment information

3. **Website Functionality Restoration**:
   - Fixed critical navigation issues caused by AnimatePresence configuration
   - Resolved `stats.map is not a function` error in Home component
   - Replaced problematic complex components with working alternatives
   - Implemented `SimpleProducts.jsx` for stable product display

4. **Content Integration**:
   - All product information (X30, X20, Lite3 series) integrated into `LanguageContext`
   - Bilingual support fully functional for English/Hebrew
   - Apple-style design system implemented throughout

### Key Technical Decisions Made
- **Frontend Focus**: Prioritized stable frontend functionality over complex full-stack features
- **Component Simplification**: Replaced animation-heavy components with reliable alternatives
- **Security-First Approach**: Implemented comprehensive information protection before GitHub upload
- **Organized Documentation**: Structured project documentation for long-term maintainability

### Current Status (August 2025)
✅ **Fully Functional Website**: All navigation, pages, and content working correctly
✅ **Security Protected**: All sensitive information properly secured
✅ **Clean Architecture**: Organized file structure and clear documentation
✅ **Production Ready**: Optimized builds and deployment configuration
✅ **Team Ready**: Comprehensive guides for development and deployment

The website successfully showcases CHIRAL's robotic solutions with professional design, optimal performance, and complete security protection.