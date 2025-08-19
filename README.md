# 🎨 Artemia - AI-Powered Exhibition Curator

> **A sophisticated web application that leverages artificial intelligence to provide personalized exhibition recommendations and immersive art discovery experiences.**

![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

## 📖 Overview

Artemia is an innovative AI-powered platform that transforms how people discover and engage with art exhibitions. Named after the resilient brine shrimp, this application adapts to user preferences and curates personalized exhibition recommendations through intelligent conversation and interactive features.

### 🌟 Key Features

- **🤖 AI Chat Curator**: Intelligent conversational AI that provides personalized exhibition recommendations
- **🏆 Exhibition World Cup**: Tournament-style comparison tool to discover preferences through head-to-head exhibition matchups
- **🖼️ Interactive Gallery**: Comprehensive exhibition browser with detailed information and direct booking links
- **💾 Smart Bookmarking**: Save and organize favorite recommendations with advanced sharing capabilities
- **📱 Responsive Design**: Seamless experience across desktop, tablet, and mobile devices
- **🎯 Real-time Communication**: Direct integration with backend AI services for dynamic recommendations

## 🛠️ Technical Stack

### **Frontend Core**
- **React 18.3** - Modern React with hooks and functional components
- **TypeScript 5.8** - Type-safe development with strict mode
- **Vite 5.4** - Lightning-fast build tool and development server
- **React Router 6.30** - Client-side routing and navigation

### **UI & Styling**
- **Tailwind CSS 3.4** - Utility-first CSS framework
- **shadcn/ui** - High-quality accessible React components built on Radix UI
- **Radix UI Primitives** - Unstyled, accessible UI components
- **Lucide React** - Beautiful & consistent icon library
- **CSS Grid & Flexbox** - Modern layout techniques

### **State Management & Data**
- **TanStack Query 5.83** - Powerful data synchronization for React
- **React Hook Form 7.61** - Performant forms with easy validation
- **Custom Hooks** - Reusable state logic for chat, sharing, and UI interactions

### **Development Tools**
- **ESLint 9.32** - Code linting and formatting
- **PostCSS & Autoprefixer** - CSS processing and vendor prefixes
- **Component Tagger** - Development component identification
- **TypeScript Strict Mode** - Enhanced type checking

### **Backend Integration**
- **Axios 1.11** - HTTP client for API communication
- **RESTful API** - Communication with FastAPI backend
- **Environment Configuration** - Flexible API endpoint configuration

## 🏗️ Architecture

### **Clean Architecture Principles**
```
src/
├── components/           # Reusable UI components
│   ├── ui/              # shadcn/ui base components
│   ├── ChatModule/      # Chat-related components
│   └── Index/           # Page-specific components
├── hooks/               # Custom React hooks
├── utils/               # Utility functions
├── types/               # TypeScript type definitions
├── constants/           # Application constants
├── data/                # Static data and configurations
├── lib/                 # External library configurations
├── pages/               # Route components
└── assets/              # Static assets
```

### **Component Hierarchy**
- **Smart Components**: Handle business logic and state management
- **Presentation Components**: Focus on UI rendering and user interactions
- **Custom Hooks**: Encapsulate reusable state logic and side effects
- **Utility Functions**: Pure functions for data transformation and API calls

### **State Management Strategy**
- **Local State**: React useState for component-specific state
- **Server State**: TanStack Query for API data caching and synchronization
- **Custom Hooks**: Centralized logic for complex state operations
- **Context API**: Minimal usage for theme and global UI state

## 🚀 Getting Started

### **Prerequisites**
- **Node.js 18+** (LTS recommended)
- **npm 9+** or **yarn 1.22+**
- **Git** for version control

### **Installation**

1. **Clone the repository**
   ```bash
   git clone <your-repository-url>
   cd artemia-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up environment variables**
   ```bash
   # Create environment file
   cp .env.example .env.local
   
   # Edit the environment variables
   VITE_API_BASE_URL=http://localhost:8000  # Your backend API URL
   ```

4. **Start the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. **Open your browser**
   ```
   http://localhost:8080
   ```

### **Available Scripts**

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run build:dev` - Build for development environment
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint for code quality checks

## 🎯 Core Features Deep Dive

### **AI Chat Curator**
The heart of Artemia's intelligence - a conversational AI that:
- Understands natural language queries about art and exhibitions
- Provides contextual recommendations based on user preferences
- Maintains conversation history for better personalization
- Supports markdown rendering for rich content display
- Offers quick suggestion buttons for common queries

**Technical Implementation:**
- WebSocket-like real-time communication with backend
- Message persistence and state management
- Markdown rendering with syntax highlighting
- Responsive chat interface with auto-scrolling

### **Exhibition World Cup**
An engaging tournament-style feature that:
- Creates head-to-head matchups between exhibitions
- Progressively narrows down choices through elimination rounds
- Learns user preferences through selection patterns
- Provides visual feedback and round progression
- Culminates in a personalized "champion" exhibition

**Technical Implementation:**
- Dynamic tournament bracket generation
- State management for match progression
- Smooth animations and transitions
- Responsive design for mobile interaction

### **Interactive Gallery**
A comprehensive exhibition browser featuring:
- Grid-based layout with hover effects
- Detailed exhibition information cards
- Direct links to booking platforms
- Filter and search capabilities
- Responsive image handling with fallbacks

### **Smart Bookmarking System**
Advanced save and share functionality:
- One-click saving of AI recommendations
- Organized storage with timestamps
- Multiple sharing options (native share API, clipboard)
- Export capabilities for external use
- Cross-platform compatibility

## 🌐 Environment Configuration

### **Development Environment**
```env
VITE_API_BASE_URL=http://localhost:8000
NODE_ENV=development
```

### **Production Environment**
```env
VITE_API_BASE_URL=https://your-api-domain.com
NODE_ENV=production
```

### **Docker Support**
The project includes Docker configuration for containerized deployment:

```dockerfile
# Development
docker-compose up -d

# Production
docker build -t artemia-frontend .
docker run -p 8080:8080 artemia-frontend
```

## 📱 Browser Support

- **Chrome** 90+
- **Firefox** 88+
- **Safari** 14+
- **Edge** 90+
- **Mobile Safari** iOS 14+
- **Chrome Mobile** Android 90+

## 🔧 Performance Optimizations

- **Code Splitting**: Lazy loading for route components
- **Image Optimization**: WebP format with fallbacks
- **Bundle Analysis**: Optimized chunk sizes
- **Caching Strategy**: Service worker for offline support
- **Tree Shaking**: Eliminates unused code
- **Minification**: Compressed assets for production

## 🧪 Testing Strategy

```bash
# Unit Tests
npm run test

# E2E Tests
npm run test:e2e

# Coverage Report
npm run test:coverage
```
