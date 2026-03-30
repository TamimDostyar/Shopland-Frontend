# Architecture

## Overview

Shopland Frontend is structured as a cross-platform frontend monorepo. The architecture is centered on one idea:

shared product logic should live once, while platform-specific rendering and runtime capabilities stay inside each app.

This keeps the business layer aligned across browser and mobile without forcing the UI layer to be identical everywhere.

## Architectural Principles

### 1. TypeScript-first

All frontend targets are based on TypeScript to keep domain contracts, shared utilities, and integration boundaries consistent.

### 2. Monorepo over multi-repo

The web, mobile, and shared packages live in one repository to simplify:

- cross-platform feature delivery
- dependency management
- code sharing
- architecture consistency
- version alignment

### 3. Shared logic, separate presentation

The apps should share:

- domain types
- API contracts
- business rules
- validation
- formatting and utility helpers

The apps should not be forced to share:

- navigation implementation
- platform-specific layout patterns
- native integrations
- bundler and packaging details

### 4. Platform ownership at the edge

Each application owns its own entry points, runtime environment, and platform APIs. Shared packages should remain platform-neutral unless a package is intentionally created for a specific runtime.

## System Layout

```text
Shopland-Frontend
├── apps
│   ├── web
│   └── mobile
└── packages
    └── shared
```

## Application Boundaries

### Web

Path: `apps/web`

Responsibilities:

- Browser rendering
- Standard HTML and CSS output
- SEO-capable pages and browser-first flows
- Fast iteration using Vite

Technical notes:

- Built with React and Vite
- Uses the workspace shared package
- Best for public-facing and standard browser experiences

### Mobile

Path: `apps/mobile`

Responsibilities:

- iOS and Android application UI
- Mobile-native navigation and UX patterns
- Expo-driven development workflow

Technical notes:

- Built with Expo and React Native
- Currently scaffolded independently
- Not yet fully connected to workspace-level shared imports

## Shared Package Boundary

Path: `packages/shared`

Purpose:

- Hold frontend-safe logic that should be reused across platforms

Current contents:

- `types.ts`
- `constants.ts`
- `utils.ts`

This package is currently suitable for:

- type definitions
- formatting helpers
- route constants
- domain utilities

This package should avoid:

- browser-only globals
- React Native-only APIs
- direct DOM usage
- direct file system or Node runtime assumptions

## Data Flow Model

The intended long-term data flow is:

```text
Backend API
   ↓
Shared API client package
   ↓
Feature/domain layer
   ↓
Platform app state
   ↓
Platform-specific UI
```

The current scaffold has not yet implemented the shared API client layer, but that should be the next architectural step.

## Build and Execution Flow

## Root orchestration

The repository root uses:

- `pnpm` workspaces for package management
- `Turborepo` for task orchestration

This provides:

- workspace linking
- dependency graph awareness
- parallel task execution
- cached builds for supported tasks

## App build flow

### Web flow

```text
Source code
   ↓
TypeScript compile
   ↓
Vite bundle
   ↓
Static web assets
```

### Mobile flow

```text
React Native source
   ↓
Expo runtime / Metro
   ↓
iOS / Android app preview or build
```

## Why This Architecture Works

This architecture works well for a marketplace product because:

- product logic can stay consistent across devices
- UI can adapt to the strengths of each platform
- the team can share one engineering vocabulary
- types and contracts can remain aligned
- new shared packages can be introduced incrementally

## Recommended Package Evolution

The current `packages/shared` package is a good starting point, but the target architecture should grow into more intentional package boundaries.

Recommended future packages:

### `packages/api`

Purpose:

- HTTP client
- request/response typing
- authentication headers
- backend endpoint wrappers

### `packages/config`

Purpose:

- platform-safe environment access
- runtime flags
- API endpoint resolution

### `packages/ui`

Purpose:

- shared design tokens
- shared primitives where cross-platform reuse makes sense
- icon mapping
- typography and spacing rules

Note:

This package must be designed carefully because web and React Native do not share CSS or DOM semantics. Some teams split this into `ui-web` and `ui-native` with shared tokens.

### `packages/features`

Purpose:

- marketplace features
- product listing logic
- auth logic
- profile logic
- cart or checkout logic

## Environment Strategy

Environment handling should be standardized per runtime:

- Web: `import.meta.env`
- Mobile: Expo public env strategy such as `EXPO_PUBLIC_*`
- Desktop renderer: renderer-safe env injection
- Desktop main process: Node/Electron runtime env

Shared packages should not directly depend on one environment API unless an adapter layer is added.

This is why shared code should generally receive configuration through parameters or a config package rather than reading runtime globals directly.

## Current Gaps

The current repository is a scaffold, not a finished production architecture.

Known gaps:

- no shared API client yet
- no authentication architecture yet
- no state management strategy selected yet
- no testing strategy yet
- no design system package yet
- mobile is not yet fully integrated with workspace shared imports
- no deployment or release pipeline yet

## Recommended Frontend Architecture Direction

If the project continues, a strong next-state architecture would be:

```text
apps/*
  own the runtime and UI shell

packages/api
  owns backend communication

packages/config
  owns platform-safe configuration

packages/shared
  owns types and domain utilities

packages/features
  owns reusable business flows

packages/ui-web / packages/ui-native
  own presentation primitives per platform
```

This keeps the architecture clean as the product scales and avoids mixing UI concerns with domain concerns.

## Decision Summary

The current architectural decisions are:

- one monorepo for all frontend platforms
- one shared TypeScript layer for reusable logic
- one app per runtime
- platform-specific UI and runtime boundaries
- Turborepo for top-level task orchestration

These are solid choices for a product expected to ship across browser, desktop, and mobile with one frontend engineering team.
