---
last_mapped_commit: 249405fa2e2191357ed67cbdcac75a3c4968120a
last_mapped_at: 2026-05-20
---

# Testing Patterns

**Analysis Date:** 2026-05-20

## Test Framework

**Backend Runner:**
- Jest 30, configured in `backend/package.json`.
- TypeScript transform uses `ts-jest`.
- Test environment is `node`.
- Unit test root is `backend/src`.

**Backend E2E Runner:**
- Jest with Supertest.
- Config file: `backend/test/jest-e2e.json`.
- E2E test location: `backend/test`.

**Frontend Runner:**
- No frontend unit or E2E test runner is currently configured.
- Current frontend verification relies on TypeScript build and ESLint.

**Assertion Library:**
- Backend uses Jest's built-in `expect`.
- E2E tests use Supertest chained assertions.

## Run Commands

```bash
cd backend && npm test                 # Run backend unit tests
cd backend && npm run test:watch       # Backend Jest watch mode
cd backend && npm run test:cov         # Backend coverage report
cd backend && npm run test:e2e         # Backend e2e tests
cd backend && npm run build            # Backend compile verification
cd frontend && npm run lint            # Frontend lint
cd frontend && npm run build           # Frontend typecheck and production build
```

Verified during mapping:

```bash
cd frontend && npm run build
cd frontend && npm run lint
cd backend && npm run build
cd backend && npm test -- --runInBand
```

All verified commands passed on 2026-05-20.

## Test File Organization

**Backend Unit Tests:**
- Location: colocated under `backend/src`.
- Naming: `*.spec.ts`.
- Existing file: `backend/src/app.controller.spec.ts`.

**Backend E2E Tests:**
- Location: `backend/test`.
- Naming: `*.e2e-spec.ts`.
- Existing file: `backend/test/app.e2e-spec.ts`.

**Frontend Tests:**
- No `*.test.ts`, `*.test.tsx`, `*.spec.ts`, or `*.spec.tsx` files are present under `frontend/src`.
- No Playwright/Cypress/Vitest config is present.

## Test Structure

**Backend Unit Pattern:**
```typescript
describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(appController.getHello()).toBe('Hello World!');
    });
  });
});
```

**Backend E2E Pattern:**
```typescript
describe('AppController (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer()).get('/').expect(200);
  });

  afterEach(async () => {
    await app.close();
  });
});
```

**Observed Patterns:**
- Use `beforeEach` to create a fresh Nest testing module/application.
- Use `afterEach` to close the e2e app.
- Tests are generated/default Nest tests at this stage, not domain-specific coverage.

## Mocking

**Framework:**
- Jest built-in mocking is available.
- Existing tests do not mock dependencies.

**Recommended Backend Mocking Pattern:**
```typescript
const userService = {
  findByEmailOrUsername: jest.fn(),
  create: jest.fn(),
};
```

Use provider overrides when testing Nest services/controllers:

```typescript
await Test.createTestingModule({
  providers: [
    AuthService,
    { provide: UserService, useValue: userService },
  ],
}).compile();
```

**What to Mock:**
- Mongoose models for service unit tests.
- Redis and Elasticsearch clients in unit tests.
- JWT signing and bcrypt comparisons when testing controller behavior.
- Network and browser globals for future frontend tests.

**What Not to Mock:**
- DTO validation if the test is specifically verifying API boundary behavior.
- Pure UI rendering details once a frontend test runner is introduced.

## Fixtures and Factories

**Current State:**
- No shared fixture or factory directory exists.
- Existing tests use inline setup only.

**Recommended Additions:**
- Keep small factories in test files until reused.
- For backend domain tests, add local factory helpers near the spec first.
- If repeated across modules, create a dedicated test helper under `backend/test` or a clearly named test utility directory.

## Coverage

**Configuration:**
- Backend coverage command: `npm run test:cov`.
- Coverage directory: `backend/coverage`, configured as `../coverage` relative to Jest `rootDir`.
- Coverage collects from `**/*.(t|j)s` under `backend/src`.

**Requirements:**
- No explicit coverage threshold is configured.
- No CI gate is present.

**Current Coverage Shape:**
- Coverage is very shallow: default app controller unit test plus default e2e test.
- Auth, user, guards, filters, interceptors, Redis, Elasticsearch, and Bull wrappers are not covered by tests.

## Test Types

**Unit Tests:**
- Present for default app controller only.
- Should be added for `AuthService`, `UserService`, `JwtAuthGuard`, `AllExceptionsFilter`, and `TransformInterceptor` before major auth/API changes.

**Integration Tests:**
- No database-backed integration tests are present.
- Mongoose-dependent services currently require either mocked models or a test database strategy.

**E2E Tests:**
- Default e2e test exists but targets `/`, while the app applies global prefix `api/v1`.
- The e2e bootstrap does not mirror `backend/src/main.ts` global prefix, guards, pipes, filters, and interceptors.
- Add e2e tests for `/api/v1/auth/register`, `/api/v1/auth/login`, `/api/v1/articles`, and `/api/v1/users/me` when those flows are stabilized.

**Frontend Tests:**
- No component or browser tests exist.
- Future setup should likely use Vitest + React Testing Library for components and Playwright for route-level smoke tests.

## Common Patterns to Preserve

**Async Testing:**
```typescript
it('does something async', async () => {
  const result = await service.method();
  expect(result).toEqual(expected);
});
```

**Exception Testing:**
```typescript
await expect(service.login(dto)).rejects.toThrow(UnauthorizedException);
```

**HTTP Testing:**
```typescript
return request(app.getHttpServer())
  .post('/api/v1/auth/login')
  .send(payload)
  .expect(200);
```

## Verification Notes

- Frontend build produced a large chunk warning: `dist/assets/index-*.js` was about 794 kB minified and 246 kB gzip during mapping.
- This is not a test failure, but future route growth should consider code splitting.
- Backend `npm run lint` includes `--fix`, so prefer reading or staging carefully if it is run during verification.

---

*Testing analysis: 2026-05-20*
*Update when test tooling, coverage requirements, or test patterns change.*
