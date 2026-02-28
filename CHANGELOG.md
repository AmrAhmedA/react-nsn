# Changelog

## 2.0.0

### Breaking Changes

- Removed `react-transition-group` dependency — animations now use pure CSS transitions (zero runtime dependencies)
- Updated peer dependency support; requires React >= 16

### Features

- Pure CSS fade/slide transitions with configurable duration via `--nsn-transition-duration`
- Mobile-responsive layout (full-width notification at bottom on small screens)
- SSR-safe: all browser API access is guarded

### Fixes

- Smoother enter/exit transitions with proper phase management
- Correct handling of rapid online/offline toggling (queues pending state changes)

### Docs

- Added Next.js Server Components usage note
- Fixed README props table to match actual API

### Chores

- Upgraded all dependencies to latest versions
- Migrated to flat ESLint config

## 1.4.0

### Fixes

- Fixed `undefined navigator` error in SSR environments

### Chores

- Updated all dev dependencies (React, Vite, ESLint, TypeScript, rimraf, lint-staged)
- Added Prettier with organize-imports plugin
- Resolved dependency conflicts
