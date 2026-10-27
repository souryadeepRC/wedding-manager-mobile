# Wedding Manager — rules for Claude

Android + iOS app for planning a wedding. v1 ships a home dashboard (countdown, expenses total, module tiles), full guest management and a Settings screen for the wedding profile. Later modules (expenses, vendors, checklist, events, gifts, auth) plug in without touching the core. Full details: `planning.md`. Expo-specific rules: `AGENTS.md` (read it; it overrides memory of Expo APIs).

## Stack
Expo (managed) + React Native + TypeScript (strict) + Expo Router.
Backend: Appwrite Cloud via `react-native-appwrite` (TablesDB: tables/rows/columns).
Server state: TanStack Query. App state: Zustand. Forms: react-hook-form + zod.
Fonts: Poppins via `@expo-google-fonts/poppins`. Dates: date-fns. Icons: Ionicons.
Do not add libraries outside this list without asking. Install with `npx expo install <pkg>`.

## Structure
- `src/app/` = Expo Router routes only (thin). Each route file imports a screen from `src/features` and renders it. (planning.md says `app/`; this repo uses `src/app/`.)
- `src/features/<module>/` = schema, constants, service, hooks, components for one module.
- `src/components/` = shared UI used by 2+ modules.
- `src/theme/` = the single source of look and feel.
- `src/modules/registry.ts` = Home tiles. New module => new registry entry.
- `src/lib/appwrite.ts` = the ONLY Appwrite Client. Never create another.
- `src/lib/` also holds `config.ts` (env IDs), `session.ts`, `queryClient.ts`. `src/store/` = Zustand. `src/utils/` = date, currency, errors.
- Keep non-route code out of `src/app/`.

## Theme (non-negotiable)
- All colours, fonts, font sizes, spacing, radius come from `src/theme/theme.ts` via `useTheme()`.
- No hex codes, `rgb()`, fontFamily strings or magic spacing numbers in any other file.
- Text always uses `<AppText variant=...>`. Buttons always use `<AppButton>`.
- Palette is beige + dark brown; font is Poppins 400/500/600/700.
- Light theme only for now; write styles with `makeStyles(theme => ...)` so themes can switch later.

## Data
- Screens never import `tablesDB`. Screens -> hooks -> `<module>.service.ts` -> Appwrite.
- Every row has `weddingId` and user-only permissions (`Permission.read/update/delete(Role.user(uid))`).
- v1 has no sign-in: `uid` comes from an anonymous session created in `src/lib/session.ts`. Don't build auth screens until asked.
- Wedding profile (date, names, budget) is edited only in Settings.
- Stored enum values are snake_case; labels live in `<module>.constants.ts`.
- Validate every form with the module's zod schema; derive TS types from it.
- After a mutation, invalidate the matching query keys. Zustand holds only `currentWeddingId` and `themeName`.
- Appwrite errors go through `src/utils/errors.ts` (friendly message + toast).
- Appwrite IDs come from `.env` (`EXPO_PUBLIC_APPWRITE_*`); never hardcode them.

## UX
- Every list: loading skeleton, error with retry, empty state, pull to refresh.
- Every destructive action: confirm dialog.
- Touch targets >= 44pt; inputs have labels; forms avoid the keyboard.
- Currency is INR, formatted with `Intl.NumberFormat('en-IN')`.

## Adding a module
1. Create the Appwrite table (with `weddingId` + row security); add its ID to `.env` and `config.ts`.
2. Create `src/features/<module>/` with `*.schema.ts`, `*.service.ts`, `*.constants.ts`, `hooks/`, `components/`.
3. Add routes under `src/app/(app)/<module>/` (`index`, `new`, `[id]/index`, `[id]/edit`).
4. Flip/add its entry in `registry.ts` to `status: 'live'`.
5. Use only theme tokens and shared components; promote to `src/components/` if two modules need it.

## Agent workflow (skills in `.claude/skills/`)
Work flows through three roles; invoke the matching skill for the kind of task:
- `ba-agent` — turns client/business needs into scoped requirements and implementation tasks with acceptance criteria. Does not write code.
- `architect-agent` — designs UI, app and Appwrite DB structure for those requirements. Does not implement features.
- `frontend-agent` — implements the tasks from the BA, following the architect's design.

Typical order: BA -> Architect -> Frontend. Hand-off artefacts live in `user-story/` (requirements) and `user-story/design/` (architect designs).

## Working style
- Do one phase/task at a time; list files you will create/change before writing code.
- Keep files under ~200 lines; split components when larger.
- Before touching any Expo/EAS/RN API, check the `expo` major version in `package.json` and read the matching docs (see AGENTS.md).
- After changes, run `npx tsc --noEmit` and `npx expo lint` and fix errors.

## Definition of done
- [ ] Works on Android and iOS (Expo Go or dev build)
- [ ] No TypeScript or lint errors
- [ ] Uses only theme tokens and shared components
- [ ] Loading, error and empty states handled
- [ ] Data survives app restart and is visible only to its owner
