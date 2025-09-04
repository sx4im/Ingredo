# Overview

Ingredo is a modern recipe discovery application that helps users find recipes based on ingredients they already have. Built as a full-stack TypeScript application using React for the frontend and Express for the backend, it provides an intuitive ingredient-based recipe search experience with a comprehensive design system and user-friendly interface.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture

The client is built with **React 18** and **TypeScript**, using **Vite** as the build tool for fast development and optimized production builds. The application follows a component-based architecture with:

- **Routing**: Uses Wouter for lightweight client-side routing
- **State Management**: React Query (TanStack Query) for server state management and caching
- **UI Framework**: Custom design system built on Radix UI primitives with Tailwind CSS for styling
- **Theme System**: React Context-based theme provider supporting light/dark modes with localStorage persistence
- **Error Handling**: Global ErrorBoundary component with graceful fallbacks
- **Development Tools**: Storybook for component development and documentation

The design system includes a comprehensive set of reusable components (Button, Card, Input, Badge, Chip, etc.) with consistent styling, accessibility features, and TypeScript support. All components follow WCAG AA contrast guidelines and include proper focus management.

## Backend Architecture

The server uses **Express.js** with TypeScript, implementing a RESTful API architecture:

- **Database Layer**: Uses Drizzle ORM with PostgreSQL support, with fallback to in-memory storage for development
- **Data Modeling**: Simple schema with users table, extensible for recipes and ingredients
- **API Routes**: Organized route handlers for ingredients search and recipe management
- **Middleware**: Request logging, JSON parsing, and error handling
- **Development Integration**: Vite middleware integration for seamless full-stack development

The backend implements a clean separation between routes, storage layer, and business logic, making it easy to extend with additional features.

## Data Storage Solutions

- **Primary Database**: PostgreSQL with Drizzle ORM for type-safe database operations
- **Development Storage**: In-memory storage implementation as fallback
- **Session Management**: Uses connect-pg-simple for PostgreSQL session storage
- **Database Migrations**: Drizzle Kit for schema migrations and database management

## Authentication and Authorization

Currently implements basic user management with:
- User registration and authentication endpoints
- Session-based authentication with PostgreSQL session store
- Global 401 handling in the API client with automatic redirect to login
- Extensible user schema supporting roles and permissions

## External Dependencies

- **Database**: Uses Neon Database (@neondatabase/serverless) for managed PostgreSQL hosting
- **UI Components**: Radix UI primitives for accessible, unstyled components
- **Styling**: Tailwind CSS for utility-first styling with custom design tokens
- **Icons**: Lucide React for consistent iconography
- **Development**: Storybook for component documentation, ESLint/TypeScript for code quality
- **Build Tools**: Vite for fast development and production builds
- **Deployment**: Configured for Replit with runtime error modal integration