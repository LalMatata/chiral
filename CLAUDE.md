# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

CHIRAL Robotics Website - A modern React-based bilingual promotional website for CHIRAL, Israel's premier provider of advanced quadruped robotics solutions. The website serves as the primary digital presence for lead generation and brand establishment in the Israeli market.

## Common Development Commands

### Development
```bash
# Install dependencies (using PNPM)
pnpm install

# Start development server (runs on http://localhost:5173)
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

### Deployment (Manus Cloud Platform)
```bash
# Build and deploy to production
pnpm run build
manus deploy --framework react --project-dir .
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
- The website is deployed to Manus Cloud Platform at https://nkdzerew.manus.space
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