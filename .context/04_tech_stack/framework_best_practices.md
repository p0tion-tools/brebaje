# Framework Rules: NestJS, Next.js, Commander.js

This document reflects the frameworks used in the Brebaje workspace. Follow these patterns so new code stays consistent with the codebase and AI assistants can suggest correct patterns.

## Backend: NestJS

- **Module pattern:** One feature per module (e.g. `CeremoniesModule`, `CircuitsModule`). Each module typically has a `*.module.ts`, `*.controller.ts`, `*.service.ts`; optional `dto/`, `guards/`, `*.model.ts` (Sequelize).
- **Controllers:** Use `@Controller()`, `@Get()`, `@Post()`, etc. Keep handlers thin; delegate to services. Use **class-validator** DTOs with `@Body()`, `@Param()`, `@Query()`; enable validation pipe globally.
- **Services:** Inject repositories and other services via constructor. Put business logic and orchestration in services, not in controllers.
- **Guards:** Use guards for auth and authorization (e.g. `JwtAuthGuard`, `IsCeremonyCoordinatorGuard`, `IsProjectCoordinatorGuard`). Apply at controller or method level.
- **Dependency injection:** Prefer constructor injection; use `@Injectable()` for services and guards.
- **Config:** Use `@nestjs/config` (ConfigModule); read from `process.env` or validated config. Use `.env` in development (e.g. `start:dev` with `--env-file .env`).
- **API surface:** REST. Document with **Swagger** (`@nestjs/swagger`): `@ApiTags()`, `@ApiOperation()`, `@ApiResponse()`, etc.

## Frontend: Next.js (App Router)

- **App Router:** All routes live under `app/`. Use `app/layout.tsx` for root layout; use `app/page.tsx` and nested folders for routes (e.g. `app/coordinator/projects/[id]/page.tsx`). No separate `pages/` router.
- **Components:** Prefer **function components** and hooks. Place shared UI in `app/components/` (e.g. `app/components/ui/`); feature-specific components can live next to routes or in `sections/`.
- **Data fetching:** Use **TanStack React Query** (e.g. `useGetCeremonies`, `useGetCeremonyById`) for server state. Define hooks in `app/hooks/` that call the backend API.
- **State:** Server state via React Query; auth state via React context (e.g. `AuthContext`). Keep local component state minimal.
- **Styling:** **TailwindCSS**. Use utility classes; shared patterns can use `clsx` / `tailwind-merge` or `@tw-classed/react` if adopted in the project.
- **Routing:** File-based routing only (App Router). No React Router; use `Link` and `useRouter` from `next/navigation` when needed.

## CLI: Commander.js

- **Command groups:** Register command groups from entry point (`index.ts`): e.g. `setUpAuthCommands(program)`, `setUpCeremonyCommands(program)`, `setUpPerpetualPowersOfTau(program)`. Each group lives in its own folder (e.g. `auth/`, `ceremonies/`, `perpetual-powers-of-tau/`).
- **ESM:** CLI uses `"type": "module"`; use `import`/`export`, `import.meta.url` for path resolution. Compiled output in `build/`; run with `node build/index.js`.
- **Options and args:** Use Commander’s `.option()`, `.argument()`, `.action()` (async). Parse with `program.parseAsync(process.argv)`.
- **Environment:** Use **dotenv** for `.env`; document required env vars (e.g. API URL, token path) in docs or README.
- **Shared logic:** Call **@brebaje/actions** for crypto, upload/download, or other shared behavior; avoid duplicating backend logic.

## API Design (Backend)

- **REST:** Use resource-oriented URLs (e.g. `/ceremonies`, `/ceremonies/:id`, `/ceremonies/:id/participants`). Prefer standard HTTP methods and status codes.
- **Versioning:** If needed, use path prefix (e.g. `/api/v1/`) or keep unversioned until required.
- **Consistency:** Use a uniform response shape for success (e.g. body as JSON) and errors (e.g. NestJS exception filters to JSON with `statusCode`, `message`). Document with Swagger.
