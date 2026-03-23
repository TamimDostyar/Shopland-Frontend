# Shopland Frontend

Shopland Frontend is a cross-platform TypeScript monorepo designed to support:

- Web in the browser with React, Vite, HTML, and CSS
- Desktop with Electron, React, and TypeScript
- Mobile with React Native and Expo for iOS and Android
- Shared frontend domain code through reusable packages

The repository is organized as a monorepo so product logic, UI direction, typing, and tooling can evolve together while still shipping to multiple platforms.

## Stack

- Monorepo: `pnpm` workspaces
- Task orchestration: `Turborepo`
- Web: `React` + `Vite` + `TypeScript`
- Desktop: `Electron` + `electron-vite` + `React` + `TypeScript`
- Mobile: `Expo` + `React Native` + `TypeScript`
- Shared package: `@shopland/shared`

## Repository Layout

```text
.
├── apps
│   ├── desktop
│   ├── mobile
│   └── web
├── docs
│   ├── architecture.md
│   └── development.md
├── packages
│   └── shared
├── package.json
├── pnpm-workspace.yaml
└── turbo.json
```

## Applications

### `apps/web`

The browser application. This app uses Vite for development and production builds and is the standard HTML/CSS frontend target.

Primary use cases:

- Marketing pages
- Marketplace browsing
- Seller and buyer dashboards in the browser
- SEO-friendly or browser-first flows

### `apps/desktop`

The desktop application powered by Electron. It uses a web renderer built with React, plus Electron main and preload processes for native desktop capabilities.

Primary use cases:

- Desktop-first internal tooling
- Power-user workflows
- OS integrations such as file system access, notifications, and future offline support

### `apps/mobile`

The mobile application powered by Expo and React Native. It is set up for iOS and Android development.

Primary use cases:

- Native marketplace browsing
- Push-driven user engagement
- Mobile-first buyer and seller journeys

### `packages/shared`

The shared package contains frontend-safe, reusable TypeScript code used across platforms.

Current contents:

- Domain types
- Constants
- Utility functions

## Quick Start

### Prerequisites

- Node.js `23+` recommended in the current setup
- `pnpm` `9+`
- Xcode for iOS development
- Android Studio for Android development

### Install dependencies

```bash
pnpm install
```

Notes:

- The web and desktop apps participate in the workspace install flow.
- The mobile app was scaffolded with Expo and currently keeps its own local install footprint.

## Run the Apps

### Run web

```bash
pnpm --filter web dev
```

### Run desktop

```bash
pnpm --filter desktop dev
```

### Run mobile

```bash
cd apps/mobile
npx expo start
```

From Expo you can then launch:

- iOS simulator
- Android emulator
- Expo Go or a development build on a device
- React Native web preview if needed

## Build Commands

### Build all workspace targets

```bash
pnpm build
```

### Build web only

```bash
pnpm --filter web build
```

### Build desktop only

```bash
pnpm --filter desktop build
```

### Start desktop preview build

```bash
pnpm --filter desktop start
```

### Package desktop by platform

```bash
pnpm --filter desktop build:mac
pnpm --filter desktop build:win
pnpm --filter desktop build:linux
```

## Workspace Scripts

At the repository root:

```bash
pnpm dev
pnpm build
pnpm lint
pnpm clean
```

These scripts are executed through Turborepo.

## Shared Code Strategy

The long-term design is to keep business rules and platform-neutral frontend code in shared packages while each application owns:

- Its routing
- Its platform-specific UI composition
- Platform integrations
- Packaging and release concerns

Today:

- `apps/web` consumes `@shopland/shared`
- `apps/desktop` consumes `@shopland/shared`
- `apps/mobile` is scaffolded and functional, but not yet wired to import `@shopland/shared` directly

That mobile limitation is normal for an early monorepo scaffold. Expo and Metro usually need explicit workspace configuration before shared package imports are fully reliable.

## Current Status

What is already in place:

- Cross-platform monorepo foundation
- Working web build
- Working desktop build
- Shared package for reusable frontend logic
- Initial demo screens for web, desktop, and mobile

What still needs implementation:

- Real design system and reusable UI components
- Shared API client
- Auth state management
- Navigation and routing structure
- Environment handling
- Expo workspace integration for shared package imports
- CI/CD and release pipelines

## Recommended Next Implementation Phases

### Phase 1

- Add a shared API client package
- Add environment configuration per platform
- Connect frontend to the backend API

### Phase 2

- Add shared state and query layer
- Introduce authentication flow
- Build core marketplace screens

### Phase 3

- Create a shared design system package
- Add form validation and error handling standards
- Add testing and CI pipelines

### Phase 4

- Add desktop-native capabilities
- Add mobile push notifications
- Add analytics, logging, and crash reporting

## Documentation

- Architecture: `docs/architecture.md`
- Development workflow: `docs/development.md`

## Important Caveats

- The root repo is using `pnpm` workspaces, but `apps/mobile` still reflects the default Expo scaffold flow and will likely need additional Metro config before shared package imports are enabled cleanly.
- The desktop app still contains generator defaults in some metadata and can be branded further.
- Backend integration has not been implemented yet.

## Goal of This Repository

The goal is to build one frontend system with one TypeScript-centered engineering workflow that can serve:

- Web users in the browser
- Mobile users on iOS and Android
- Desktop users through Electron

without splitting product logic across unrelated repositories.
