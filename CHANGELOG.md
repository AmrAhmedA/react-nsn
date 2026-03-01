# Changelog

## 2.5.0

### Fixes

- Fix example app reducer default `duration: 4.5` → `4500` (notification vanished instantly on state reset)
- Fix swipe animation timing mismatch: extract hardcoded `200ms` to `SWIPE_ANIMATION_MS` constant shared between inline transition and setTimeout

### Improvements

- Deduplicate network check on tab resume: `useInterval` now fires immediately when delay transitions from `null` to a number, removing redundant `checkStatus()` call from visibility handler
- Cache `getComputedStyle` for touch handling: capture base transform once on phase `'visible'` instead of on every `touchstart`
- Add dev-mode deprecation warning when `destoryOnClose` prop is used

### Internal

- Extract all module-level constants into `src/constants.ts`
- Add `useInterval` resume-fire test
- Add `destoryOnClose` deprecation warning test

## 2.4.4

### Chores

- Upgrade `eslint-plugin-react-hooks` v5 → v7 (explicit rules only, no React Compiler rules)
- Fix high-severity minimatch vulnerability in ESLint via npm override
- Remove unused dev dependencies: `rollup-plugin-visualizer`, `process`, `@typescript-eslint/eslint-plugin`, `@typescript-eslint/parser`

## 2.4.3

### Internal

- Rename `App.css` to `notification.css`
- Normalize internal identifiers in hooks (`checkStatus`, `isBrowser`, `hasNavigator`, etc.)
- Use `SCREAMING_SNAKE_CASE` for module-level constants
- Fix `timeSince` singular/plural for all time units (e.g. "1 year" instead of "1 years")
- Fix JSDoc referencing wrong component name
- Inline `useOnlineStatus` export

## 2.4.2

### Chores

- Improve npm discoverability: add high-traffic keywords, shorten package description

## 2.4.1

### Chores

- Upgrade dev dependencies: React 19, Vite 7, @types/node 25, lint-staged 16.3
- Remove unused `@types/jest`
- Update vitest triple-slash directive to `vitest/config`

## 2.4.0

### Features

- Swipe-to-dismiss on mobile (horizontal swipe with threshold detection)
- Pause auto-hide on hover/pointer interaction
- Accessible close and refresh buttons (`<button>` elements with `aria-label`)

## 2.3.0

### Features

- Headless mode: import from `react-nsn/headless` for hook-only usage (~1.4KB gzipped)
- Typed imperative ref with `openStatus()` and `dismiss()` methods
- Exponential backoff for polling when offline (capped at 60s)
- Custom `pollingFn` option for user-defined connectivity checks
- `className` and `style` props for notification customization
- `onStatusChange` callback fired on status changes

### Fixes

- Hook correctness fixes: proper effect cleanup, stable callback refs

### Docs

- Updated README with headless mode and new API documentation

## 2.2.0

### Features

- Improved `useOnlineStatus` hook API: `isOffline`, `checkNow()`, `time.difference`, `connectionInfo`
- Improved component props: `destroyOnClose`, `eventsCallback`

## 2.1.2

### Fixes

- Remove duplicate polling on mount
- Add CSS transition fallback timer for reliable exit animations

### Chores

- Add automated release workflow in CI

## 2.1.0

### Features

- Accessibility: `role="status"` and `aria-live="polite"` on notification container
- Strict mode compatibility
- Test suite with vitest and @testing-library/react
- CI checks workflow

### Fixes

- Resolve dual React instance in example app

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
