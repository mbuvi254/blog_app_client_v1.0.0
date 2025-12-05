# Blog Client Application

A modern, responsive blog platform built with React, TypeScript, and Vite. This application provides a complete blogging solution with both public and admin interfaces.

## Features

### Public Features
- View published blog posts
- Read individual blog posts with rich text formatting
- Responsive design for all devices
- Dark/light mode support

### Author Features
- Secure authentication (login/register)
- Create, edit, and delete blog posts
- Rich text editor (Summernote) for content creation
- Draft management system
- Profile management
- View published posts and drafts

## Tech Stack

### Core
- **Frontend Framework**: React 19
- **Language**: TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS with Headless UI
- **State Management**: React Query
- **Routing**: React Router v7

### UI & Components
- **Component Library**: Radix UI
- **Icons**: Lucide Icons
- **Form Handling**: React Hook Form with Zod validation
- **Notifications**: Sonner, React Toastify
- **Rich Text Editor**: Summernote
- **Date Handling**: date-fns
- **HTTP Client**: Axios

### Development & Testing
- **Type Checking**: TypeScript
- **Linting**: ESLint
- **Code Formatting**: Prettier
- **Git Hooks**: Husky + lint-staged
- **Testing**: Jest + React Testing Library
- **Component Testing**: Storybook
- **API Mocking**: MSW (Mock Service Worker)

## Project Structure

```
src/
├── components/         # Reusable UI components
│   ├── common/        # Common components
│   └── ui/            # Shadcn/ui inspired components
├── pages/             # Page components
│   ├── Blog/          # Public blog pages
│   └── Dashboard/     # Author dashboard pages
├── Store/             # State management
├── lib/               # Utility functions and API client
└── assets/            # Static assets

## Getting Started

1. **Prerequisites**
   - Node.js 18+
   - npm or yarn

2. **Installation**
   ```bash
   # Install dependencies
   npm install
   
   # Start development server
   npm run dev
   ```

3. **Building for Production**
   ```bash
   # Build the application
   npm run build
   
   # Preview the production build
   npm run preview
   ```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Development Tools

### Recommended VS Code Extensions
- **ESLint** - Integrates ESLint into VS Code
- **Prettier** - Code formatter
- **Tailwind CSS IntelliSense** - Tailwind CSS tooling
- **Path IntelliSense** - File path autocompletion
- **Auto Import** - Automatically finds and parses all exports
- **Error Lens** - Show inline errors and warnings
- **GitLens** - Git supercharged

### Recommended Browser Extensions
- **React Developer Tools** - Inspect React component hierarchy
- **Redux DevTools** - Debug application state
- **JSON Formatter** - Format JSON responses in browser

## Development Setup

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Environment Setup**
   Create a `.env` file in the root directory with the following variables:
   ```env
   VITE_API_BASE_URL=your_api_base_url
   VITE_APP_NAME="Blog App"
   VITE_APP_ENV=development
   ```

3. **Run Development Server**
   ```bash
   npm run dev
   ```

4. **Run Tests**
   ```bash
   npm test
   ```

5. **Run Storybook**
   ```bash
   npm run storybook
   ```

## Contributing

1. **Setup**
   ```bash
   # Install dependencies
   npm install
   
   # Install git hooks
   npx husky install
   ```

2. **Development Workflow**
   - Create a new branch: `git checkout -b feature/your-feature-name`
   - Make your changes
   - Run tests: `npm test`
   - Format code: `npm run format`
   - Lint code: `npm run lint`
   - Commit changes: `git commit -m "feat: add new feature"`
   - Push to branch: `git push origin feature/your-feature-name`
   - Open a pull request

3. **Commit Message Guidelines**
   - Use present tense ("add feature" not "added feature")
   - Use the commit type prefix:
     - `feat:` A new feature
     - `fix:` A bug fix
     - `docs:` Documentation changes
     - `style:` Code style changes (formatting, etc.)
     - `refactor:` Code changes that neither fix bugs nor add features
     - `test:` Adding tests
     - `chore:` Changes to the build process or auxiliary tools
