---
last_mapped_commit: 249405fa2e2191357ed67cbdcac75a3c4968120a
last_mapped_at: 2026-05-20
---

# Coding Conventions

**Analysis Date:** 2026-05-20

## Naming Patterns

**Backend Files:**
- Use NestJS suffixes: `*.module.ts`, `*.controller.ts`, `*.service.ts`, `*.dto.ts`, `*.schema.ts`, `*.strategy.ts`, `*.guard.ts`.
- Use lowercase domain directories under `backend/src/modules`, such as `auth`, `user`, and `article`.
- Use colocated specs with `*.spec.ts` for backend unit tests.

**Frontend Files:**
- Use PascalCase for React component files: `Header.tsx`, `Sidebar.tsx`, `ProfileCard.tsx`.
- Use lowercase file names for UI primitive files: `button.tsx`, `card.tsx`, `dropdown-menu.tsx`.
- Use camelCase plus `Store` for Zustand store files: `authStore.ts`, `themeStore.ts`, `sidebarStore.ts`.
- Route pages live under `frontend/src/pages`, with page directories like `Home/Home.tsx`.

**Functions and Methods:**
- Use camelCase for functions and class methods.
- Backend service methods are direct verb phrases: `register`, `login`, `generateTokens`, `findById`, `updateProfile`.
- Frontend handlers use action-oriented names where present, such as `goPrev`, `goNext`, and `handleDragEnd`.

**Variables and Constants:**
- Use camelCase for variables.
- Use descriptive arrays for static UI data: `navItems`, `slides`, `articles`, `projects`, `stats`, `socials`.
- Store hooks use `useXxxStore`.

**Types:**
- Use PascalCase for interfaces and type aliases.
- Examples: `ApiResponse<T>`, `ProfileUpdate`, `AuthenticatedUser`, `ContentSwiperProps`, `ThemeState`.
- Use `import type` for type-only imports where the code already does so, such as `frontend/src/components/home/ContentSwiper.tsx` and backend DTO/service files.

## Code Style

**Formatting:**
- Frontend source generally omits semicolons and uses single quotes.
- Backend source uses semicolons and Prettier formatting through ESLint/Prettier integration.
- Indentation is 2 spaces in both apps.
- Frontend UI primitive files from the local component library currently use double quotes in some files; match nearby file style when editing.

**Linting:**
- Frontend: `npm run lint` from `frontend`; verified passing on 2026-05-20.
- Backend: `npm run lint` from `backend`; note that this script includes `--fix`, so it can modify files.
- Backend ESLint rules allow `no-explicit-any`, warn on floating promises and unsafe arguments, and enforce Prettier.
- Frontend ESLint uses recommended JavaScript, TypeScript, React Hooks, and React Refresh configs.

## Import Organization

**Backend:**
1. External Nest/package imports.
2. Local relative imports.
3. Type imports close to related imports.

Examples:
- `backend/src/app.module.ts` imports Nest modules, then local config/shared/feature modules.
- `backend/src/modules/auth/auth.service.ts` imports Nest exceptions, config/JWT, bcrypt, type imports, then local modules/DTOs.

**Frontend:**
1. External package imports.
2. Internal feature/page/component imports.
3. Store or utility imports.

Examples:
- `frontend/src/pages/Layout.tsx` imports React Router, layout components, home components, then `useSidebarStore`.
- UI primitives import React, third-party helpers, then `@/lib/utils`.

**Path Aliases:**
- `@/*` maps to `frontend/src/*`.
- Alias usage is common in UI primitives for `@/lib/utils`.
- Most feature/layout/page code currently uses relative imports; follow nearby style to avoid churn.

## Error Handling

**Backend Patterns:**
- Throw Nest HTTP exceptions for expected API failures.
- `AuthService` uses `ConflictException` for duplicate registration and `UnauthorizedException` for invalid login.
- Let errors bubble to the global `AllExceptionsFilter`.
- Use DTO validation for request bodies at the API boundary.

**Frontend Patterns:**
- Centralize HTTP error handling in `frontend/src/api/client.ts`.
- On 401, clear auth store and redirect to `/login`.
- Feature components currently mostly render static data and do not have error states.

## Logging

**Backend:**
- Use Nest `Logger` through `LoggingInterceptor` for request completion logs.
- Avoid `console.log` in backend source; none were found in `backend/src`.
- Winston packages are installed but not configured; do not introduce ad-hoc logging systems without a deliberate wiring step.

**Frontend:**
- No logging abstraction is present.
- Avoid committed `console.log` unless it is intentionally part of debugging and removed before completion.

## Comments

**When to Comment:**
- Use comments for sectioning complex JSX sparingly; current frontend components use section comments in `Sidebar.tsx`, `ProfileCard.tsx`, `ReadingStats.tsx`, and `ContentSwiper.tsx`.
- Prefer explaining intent or grouping large UI sections over narrating obvious lines.

**JSDoc/TSDoc:**
- No required JSDoc convention is present.
- Types/interfaces are preferred over comment-heavy prop documentation.

**TODO Comments:**
- No active TODO/FIXME comments were found in source.
- If added, keep them specific and tied to a follow-up issue or phase.

## Function and Component Design

**Backend:**
- Controllers should stay thin and delegate business logic to services.
- Services should encapsulate persistence and domain logic.
- DTO classes should own class-validator decorators for request validation.
- Shared infrastructure wrappers should live under `backend/src/shared`.

**Frontend:**
- Page files should compose route-level sections rather than carrying heavy UI logic.
- Feature components live under `frontend/src/components/<feature>`.
- Reusable primitives live under `frontend/src/components/ui`.
- Reusable browser/state logic should be extracted to `frontend/src/hooks` when it appears in multiple places.
- Use `cn` from `frontend/src/lib/utils.ts` for class merging in shared components.

## Module Design

**Backend Exports:**
- Nest modules export services when other modules need them, as `UserModule` exports `UserService` and `AuthModule` exports `AuthService`.
- Shared infrastructure modules export their client services or Nest module wrappers.

**Frontend Exports:**
- React components are mostly default exports.
- UI primitives use named exports, such as `Button`, `Card`, and `Input`.
- Avoid adding broad barrel exports unless the surrounding directory already uses them.

## Styling Conventions

**Tailwind:**
- Theme tokens are centralized in `frontend/src/index.css` and exposed through `frontend/tailwind.config.js`.
- Use semantic token classes (`bg-background`, `text-foreground`, `bg-card`) when possible.
- Dark mode uses the `dark` class on the root element.
- Layout uses responsive Tailwind modifiers (`sm:`, `lg:`, `xl:`).

**Icons and Accessibility:**
- Icon buttons use lucide-react icons.
- Existing icon buttons generally include `aria-label` and `title`; preserve that pattern.

---

*Convention analysis: 2026-05-20*
*Update when code style or project conventions change.*
