# Development Guide

## Purpose

This document explains how to work inside the Amazebid frontend monorepo during day-to-day development.

## Prerequisites

Install the following locally:

- Node.js
- `pnpm`
- Xcode for iOS development
- Android Studio for Android development

Recommended versions should stay aligned with the currently installed project toolchain where possible.

## Install Dependencies

From the repository root:

```bash
pnpm install
```

This installs root workspace dependencies and the packages linked through the workspace graph.

## Development Commands

### Root commands

```bash
pnpm dev
pnpm build
pnpm lint
pnpm clean
```

### Web

```bash
pnpm --filter web dev
pnpm --filter web build
pnpm --filter web preview
```

### Desktop

```bash
pnpm --filter desktop dev
pnpm --filter desktop build
pnpm --filter desktop start
pnpm --filter desktop build:mac
pnpm --filter desktop build:win
pnpm --filter desktop build:linux
```

### Mobile

```bash
cd apps/mobile
npx expo start
npx expo start --ios
npx expo start --android
npx expo start --web
```

## Where To Put Code

### Put code in `packages/shared` when it is:

- platform-neutral
- TypeScript-only
- reusable across multiple apps
- not dependent on DOM, Electron, or React Native APIs

Examples:

- product types
- user types
- formatting helpers
- reusable constants

### Put code in an app when it is:

- specific to one platform
- tied to a platform navigation library
- tied to platform UI
- tied to a runtime-specific API

Examples:

- Electron file system integration
- browser routing setup
- React Native screen composition

## Recommended Engineering Rules

### 1. Keep shared code runtime-safe

Do not assume `window`, `document`, `process`, or React Native globals exist inside shared packages.

### 2. Push business logic down

Put product logic in shared packages or future feature packages, not directly inside screens when it can be reused.

### 3. Keep apps thin

Each app should mostly compose:

- routes
- screens
- platform adapters
- runtime-specific services

### 4. Prefer clear package boundaries

If shared code starts mixing responsibilities, split it into a new package rather than letting one package become a dumping ground.

## Current Development Caveats

### Expo workspace integration

The mobile app is scaffolded and runnable, but it is not yet fully configured to consume the workspace shared package directly.

Before deep shared code reuse on mobile, add:

- Metro workspace support
- resolver configuration if needed
- package transpilation support where necessary

### Environment variables

Environment configuration is not standardized yet across all runtimes.

That should be handled before backend integration begins.

## Suggested Near-Term Improvements

### Backend integration

Create a dedicated shared API package and connect it to the backend rather than scattering fetch logic in multiple apps.

### State management

Choose a consistent approach such as:

- React Query for server state
- Zustand or Context for client state

### Testing

Add:

- unit tests for shared utilities
- component tests for web and desktop renderer code
- platform-focused smoke tests

### CI

Add automated checks for:

- install
- typecheck
- lint
- web build
- desktop build

## Suggested Branch of Future Documentation

As the project grows, add:

- `docs/api-integration.md`
- `docs/state-management.md`
- `docs/release-process.md`
- `docs/testing.md`

## Definition of Done For New Features

A feature should ideally be considered complete when:

- types are updated
- shared logic is extracted where appropriate
- platform-specific behavior is isolated cleanly
- build commands still pass
- documentation is updated if the architecture changed
