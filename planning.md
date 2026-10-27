# Wedding Manager — App Planning Doc

## Overview

Wedding Manager is an Android and iOS app, built with Expo and React Native on an Appwrite backend, that ships first with a home dashboard and full guest management. Every later feature (budget, vendors, tasks, events) plugs in as a separate module without touching the core.

**MVP scope (v1)**

- Home screen: "Wedding Manager" title, "N Days to Go" countdown, total expenses card, a grid of section tiles (CTA boxes)
- Guests: list split into Wedding and Reception tabs, with add, view, edit and delete
- Guest fields: title (name), number of guests, invite sent (yes/no), status, connection, event type
- Settings: wedding profile (couple names, wedding date, reception date, budget)
- Light theme in beige and dark brown, Poppins font, all from one theme file

**Out of scope for v1, planned as modules:** sign-in / sign-up (email auth), expense tracking, vendors, checklist, events schedule, gifts, theme picker, multi-user sharing.

**Guiding rules**

- No colour, font size or spacing value is typed inside a screen; everything comes from the theme.
- Each feature lives in its own folder under `src/features/` and registers itself once.
- Appwrite is reached only through service files, never directly from a screen.

## Tech stack

Use the current stable Expo SDK with TypeScript and Expo Router; at the time of writing that is [Expo SDK 56](https://expo.dev/changelog/sdk-56.md), which ships React Native 0.85 and React 19.2.

| Layer | Choice | Why |
| --- | --- | --- |
| Framework | Expo (managed), `npx create-expo-app@latest` | One codebase for Android and iOS, OTA updates via EAS |
| Language | TypeScript, strict mode | Typed Appwrite rows and safer refactors |
| Navigation | Expo Router (file-based) | New screens and modules are just new files |
| Backend | Appwrite Cloud, `react-native-appwrite` + `react-native-url-polyfill` | Auth, database (TablesDB), storage in one service |
| Server state | TanStack Query | Caching, loading/error states, refetch after CRUD |
| App state | Zustand | Small global state: current wedding, theme choice |
| Forms | react-hook-form + zod | Guest form validation, reusable for later modules |
| Fonts | `expo-font` + `@expo-google-fonts/poppins` | Poppins 400, 500, 600, 700 |
| Dates | date-fns | "N Days to Go" countdown |
| Icons | `@expo/vector-icons` (Ionicons) | Tile and button icons |
| Builds | EAS Build | APK/AAB and iOS builds without a Mac for Android |

Install Appwrite packages with `npx expo install react-native-appwrite react-native-url-polyfill`, as the [Appwrite React Native SDK](https://github.com/appwrite/sdk-for-react-native) README shows. The SDK targets Appwrite server 1.8.x and uses the TablesDB API (tables, columns, rows) rather than the older collections/documents naming.

**Auth for v1:** no sign-in screens. On first launch the app silently calls `account.createAnonymousSession()`; the anonymous user owns every row, so row security works exactly as it will with real accounts. Data is tied to the device install until email auth is added.

**Auth later:** add email + password screens and upgrade the anonymous account in place with `account.updateEmail()` / `account.updatePassword()`. The user ID stays the same, so no rows or permissions need migrating.

## Folder structure

Routes live in `app/` and stay thin; all logic lives in `src/features/<module>/`, so a new segment is one new feature folder plus one route folder.

```
wedding-manager/
├── app/                          # Expo Router routes only (thin wrappers)
│   ├── _layout.tsx               # Fonts, ThemeProvider, QueryClient, session bootstrap
│   └── (app)/
│       ├── _layout.tsx           # Stack header styled from theme
│       ├── index.tsx             # Home / landing
│       ├── settings.tsx          # Wedding profile (date, names, budget)
│       └── guests/
│           ├── index.tsx         # Guest list (Wedding | Reception tabs)
│           ├── new.tsx           # Add guest
│           └── [id]/
│               ├── index.tsx     # Guest detail
│               └── edit.tsx      # Edit guest
├── src/
│   ├── theme/                    # THE single source for look and feel
│   │   ├── theme.ts              # colors, fonts, sizes, spacing, radius, shadows
│   │   ├── ThemeProvider.tsx     # context + useTheme()
│   │   └── index.ts
│   ├── components/               # Shared UI built only from theme tokens
│   │   ├── AppText.tsx
│   │   ├── AppButton.tsx
│   │   ├── AppInput.tsx
│   │   ├── Card.tsx
│   │   ├── SegmentedTabs.tsx
│   │   ├── OptionChips.tsx       # single-select chips for enums
│   │   ├── Badge.tsx
│   │   ├── EmptyState.tsx
│   │   └── Screen.tsx            # safe area + background
│   ├── features/
│   │   ├── home/                 # countdown, expense summary, tile grid
│   │   ├── guests/
│   │   │   ├── components/       # GuestCard, GuestForm, GuestSummary
│   │   │   ├── hooks/            # useGuests, useCreateGuest, ...
│   │   │   ├── guest.service.ts  # Appwrite calls only
│   │   │   ├── guest.schema.ts   # zod schema + TS types
│   │   │   ├── guest.constants.ts# enum options + labels
│   │   │   └── index.ts
│   │   ├── wedding/              # wedding profile: schema, service, hooks
│   │   ├── settings/             # Settings screen (edits the wedding profile)
│   │   └── expenses/             # v1: total only; full module later
│   ├── modules/
│   │   └── registry.ts           # list of home tiles / segments
│   ├── lib/
│   │   ├── appwrite.ts           # single Client, account, tablesDB
│   │   ├── session.ts            # ensureSession(): anonymous session on first launch
│   │   ├── config.ts             # IDs read from env
│   │   └── queryClient.ts
│   ├── store/                    # Zustand stores
│   └── utils/                    # date, currency, errors
├── assets/
├── .env                          # EXPO_PUBLIC_APPWRITE_* values
├── app.json
└── CLAUDE.md                     # rules for Claude (see last section)
```

All Appwrite IDs come from `.env` as `EXPO_PUBLIC_APPWRITE_ENDPOINT`, `EXPO_PUBLIC_APPWRITE_PROJECT_ID`, `EXPO_PUBLIC_APPWRITE_DATABASE_ID` and one `EXPO_PUBLIC_APPWRITE_TABLE_<NAME>_ID` per table.

## Theme & font system

One file, `src/theme/theme.ts`, holds every colour, font, size, spacing and radius; screens read it only through `useTheme()`. Today it exports one `light` theme; adding a theme later means adding one more object with the same shape.

**Palette (beige + dark brown)**

| Token | Hex | Used for |
| --- | --- | --- |
| `background` | #FAF6F0 | Screen background (warm beige) |
| `surface` | #F3EBDD | Cards, tiles, inputs |
| `surfaceAlt` | #E8DCC8 | Pressed tiles, selected chips background |
| `border` | #D9C7A7 | Card and input borders |
| `primary` | #4E342E | Buttons, header, active tab (dark brown) |
| `primaryPressed` | #3E2723 | Button pressed state |
| `onPrimary` | #FAF6F0 | Text on brown buttons |
| `textPrimary` | #3E2723 | Headings, body text |
| `textSecondary` | #7B5E57 | Labels, captions |
| `accent` | #B08D57 | Countdown highlight, icons (muted gold) |
| `success` | #4F7942 | Status: Confirmed |
| `warning` | #C58B2A | Status: Waiting |
| `danger` | #A63D40 | Status: Declined, delete |

**Typography (Poppins)**

| Variant | Font | Size / line height |
| --- | --- | --- |
| `display` | Poppins\_700Bold | 32 / 40 (home title) |
| `h1` | Poppins\_600SemiBold | 24 / 32 |
| `h2` | Poppins\_600SemiBold | 20 / 28 |
| `title` | Poppins\_500Medium | 16 / 24 |
| `body` | Poppins\_400Regular | 14 / 22 |
| `caption` | Poppins\_400Regular | 12 / 18 |
| `button` | Poppins\_600SemiBold | 15 / 20 |

**`src/theme/theme.ts`**

```ts
// Single source of truth for look & feel. Never hardcode these values in screens.

export const fonts = {
  regular: 'Poppins_400Regular',
  medium: 'Poppins_500Medium',
  semibold: 'Poppins_600SemiBold',
  bold: 'Poppins_700Bold',
} as const;

export const spacing = { xxs: 2, xs: 4, sm: 8, md: 12, lg: 16, xl: 24, xxl: 32 } as const;
export const radius = { sm: 8, md: 12, lg: 16, xl: 24, pill: 999 } as const;

export const typography = {
  display: { fontFamily: fonts.bold, fontSize: 32, lineHeight: 40 },
  h1: { fontFamily: fonts.semibold, fontSize: 24, lineHeight: 32 },
  h2: { fontFamily: fonts.semibold, fontSize: 20, lineHeight: 28 },
  title: { fontFamily: fonts.medium, fontSize: 16, lineHeight: 24 },
  body: { fontFamily: fonts.regular, fontSize: 14, lineHeight: 22 },
  caption: { fontFamily: fonts.regular, fontSize: 12, lineHeight: 18 },
  button: { fontFamily: fonts.semibold, fontSize: 15, lineHeight: 20 },
} as const;

const lightColors = {
  background: '#FAF6F0',
  surface: '#F3EBDD',
  surfaceAlt: '#E8DCC8',
  border: '#D9C7A7',
  primary: '#4E342E',
  primaryPressed: '#3E2723',
  onPrimary: '#FAF6F0',
  textPrimary: '#3E2723',
  textSecondary: '#7B5E57',
  accent: '#B08D57',
  success: '#4F7942',
  warning: '#C58B2A',
  danger: '#A63D40',
} as const;

export type ThemeColors = { [K in keyof typeof lightColors]: string };

export type AppTheme = {
  name: string;
  mode: 'light' | 'dark';
  colors: ThemeColors;
  fonts: typeof fonts;
  typography: typeof typography;
  spacing: typeof spacing;
  radius: typeof radius;
};

export const lightTheme: AppTheme = {
  name: 'classicBeige',
  mode: 'light',
  colors: lightColors,
  fonts, typography, spacing, radius,
};

// Add future themes here (e.g. darkTheme, roseGoldTheme) with the same shape.
export const themes = { classicBeige: lightTheme } as const;
export type ThemeName = keyof typeof themes;
export const defaultThemeName: ThemeName = 'classicBeige';
```

**How it is consumed**

- `ThemeProvider` holds the current `ThemeName` (from Zustand, later persisted with AsyncStorage) and exposes `useTheme()`.
- `app/_layout.tsx` loads the four Poppins weights with `useFonts` and keeps the splash screen up until they load.
- Shared components (`AppText variant="h1"`, `AppButton variant="primary"`) map props to tokens, so screens never pass raw styles for colour or type.
- Styles are built with a `makeStyles(theme => ({...}))` helper so they react to a theme switch.

**Adding a theme later:** add `darkTheme` to `themes`, add a picker in Settings that sets the store value. No screen changes.

## Screens & navigation

v1 has six screens and no sign-in: Home, Settings, Guest list, Add guest, Guest detail and Edit guest. Navigation is one Expo Router stack; Wedding and Reception are tabs inside the Guest list, not separate routes.

&#91;embedded content: navigation map · v1 screens\]

Home is the hub; deleting from Guest detail returns to the Guest list, and dashed tiles are modules not built yet.

### 1. Home (`app/(app)/index.tsx`)

- **Title:** "Wedding Manager" in `display` type, centred, with a settings (gear) icon in the header that opens Settings.
- **Countdown chip:** "N Days to Go" using `differenceInCalendarDays(weddingDate, today)`. Edge cases: 1 → "1 Day to Go", 0 → "Today's the day!", past → "Married N days ago", no date → "Set your wedding date" button that opens Settings.
- **Total expenses card:** sum of all expense amounts in ₹ (INR), with "of ₹budget" underneath when a budget is set.
- **Section tiles:** 2-column grid of square cards, each with icon, label and a one-line stat. Tiles come from the module registry. Guests shows "120 guests · 80 confirmed"; unbuilt modules show a "Coming soon" badge and are disabled.
- Pull to refresh re-fetches the wedding profile, expense total and guest counts.

### 2. Guest list (`app/(app)/guests/index.tsx`)

- **Segmented tabs:** Wedding | Reception, kept in the URL as `?type=wedding` so back navigation returns to the same tab.
- **Summary strip** for the active tab: total headcount (sum of No. of guests), Confirmed, Waiting, Declined, Invites not sent.
- **Search** by title, plus filter chips for Status and Connection.
- **Guest card:** title, "4 guests", connection label, coloured status badge, invite-sent icon. Tap opens detail; long-press offers Edit / Delete.
- **Add Guest CTA:** bottom primary button (or FAB) → `/guests/new?type=<active tab>`.
- Empty state per tab with an "Add your first guest" button.

### 3. Add guest (`app/(app)/guests/new.tsx`) and 4. Edit guest (`[id]/edit.tsx`)

Both use the same `GuestForm` component; Edit pre-fills it.

| Field | Control | Rules | Default |
| --- | --- | --- | --- |
| Title | Text input | Required, 2 to 80 characters (e.g. "Sharma family") | Empty |
| No. of guests | Number stepper | Integer, 1 to 50 | 1 |
| Invite sent? | Yes / No switch | Boolean | No |
| Status | Chips: Confirmed, Waiting, Declined | One required | Waiting |
| Connection | Chips: Relative, My friend, Dad's friend, Mom's friend, Others | One required | None |
| Type | Chips: Wedding, Reception | One required | Active tab |
| Notes (optional) | Multiline input | Up to 500 characters | Empty |

- Save validates with the zod schema, shows field errors inline, disables the button while saving, then returns to the list with a toast.
- Unsaved changes prompt a "Discard changes?" dialog on back.

### 5. Guest detail (`app/(app)/guests/[id]/index.tsx`)

- All fields in a card, with quick actions: change Status (chips) and toggle Invite sent without opening Edit.
- Edit button → `[id]/edit`; Delete button → confirm dialog → delete → back to list.

### 6. Settings (`app/(app)/settings.tsx`)

Reached from the Home header gear icon, the "Set your wedding date" button, and the Settings tile.

| Field | Control | Rules |
| --- | --- | --- |
| Couple names | Text input | Optional, up to 120 characters (e.g. "Riya & Arjun") |
| Wedding date | Date picker | Optional; drives the Home countdown |
| Reception date | Date picker | Optional |
| Budget | Number input (₹) | Optional, ≥ 0 |

- Uses react-hook-form + a zod `weddingSchema`; Save updates the wedding row, invalidates `['wedding']`, toasts and goes back.
- Later sections of this screen: theme picker, export guests to CSV, account (sign in / sign out once auth exists).

### Session bootstrap (no auth screens in v1)

- `app/_layout.tsx` calls `ensureSession()` while the splash screen is up: `account.get()`, and on failure `account.createAnonymousSession()`.
- It then calls `weddingService.ensure(uid)`: fetch the user's wedding row, or create an empty one (currency `INR`, everything else blank). Its ID goes into the Zustand store as `currentWeddingId`.
- The app always opens straight to Home.

## Data model & Appwrite setup

One database, `wedding_manager`, with three tables in v1: `weddings`, `guests` and `expenses`. Every row carries a `weddingId`, so future modules (vendors, tasks, events) follow the same pattern and multi-user sharing can be added by changing permissions only.

### Table: `weddings`

| Column | Type | Required | Notes |
| --- | --- | --- | --- |
| `coupleNames` | string (120) | No | e.g. "Riya & Arjun"; set in Settings |
| `weddingDate` | datetime | No | Drives the countdown; set in Settings |
| `receptionDate` | datetime | No | Shown on Reception tab later |
| `budget` | float | No | Total budget in ₹ |
| `currency` | string (3) | Yes | Default `INR` |

The row is created empty on first launch, so every field the user fills in Settings is optional.

### Table: `guests`

| Column | Type | Required | Notes |
| --- | --- | --- | --- |
| `weddingId` | string (36) | Yes | Row ID from `weddings` |
| `title` | string (80) | Yes | Guest or family name |
| `guestCount` | integer, min 1, max 50 | Yes | "No. of guests", default 1 |
| `inviteSent` | boolean | Yes | Default `false` |
| `status` | enum: `confirmed`, `waiting`, `declined` | Yes | Default `waiting` |
| `connection` | enum: `relative`, `my_friend`, `dad_friend`, `mom_friend`, `others` | Yes |  |
| `eventType` | enum: `wedding`, `reception` | Yes | Named `eventType` to avoid the reserved-sounding `type` |
| `notes` | string (500) | No |  |

Indexes on `guests`: key index on `weddingId` + `eventType` (list per tab), key index on `status`, and a fulltext index on `title` (search).

### Table: `expenses` (minimal in v1)

TO be defined later

v1 only reads this table to show the home total; the Expenses module adds the CRUD screens later.

### Display labels live in code, not the database

`guest.constants.ts` maps stored values to labels and badge colours, so wording can change without a data migration:

```ts
export const GUEST_STATUS = [
  { value: 'confirmed', label: 'Confirmed', color: 'success' },
  { value: 'waiting',   label: 'Waiting',   color: 'warning' },
  { value: 'declined',  label: 'Declined',  color: 'danger'  },
] as const;

export const GUEST_CONNECTION = [
  { value: 'relative',   label: 'Relative' },
  { value: 'my_friend',  label: 'My friend' },
  { value: 'dad_friend', label: "Dad's friend" },
  { value: 'mom_friend', label: "Mom's friend" },
  { value: 'others',     label: 'Others' },
] as const;

export const EVENT_TYPES = [
  { value: 'wedding',   label: 'Wedding' },
  { value: 'reception', label: 'Reception' },
] as const;
```

### Permissions

- Each table: allow role **Users** to create; turn on **row security**.
- Every create passes `[Permission.read(Role.user(uid)), Permission.update(Role.user(uid)), Permission.delete(Role.user(uid))]`, so each person only sees their own rows. In v1 `uid` is the anonymous user; anonymous users count as role **Users**, so nothing changes when email auth arrives.
- Sharing with a partner later: create an Appwrite **Team** per wedding and switch row permissions to `Role.team(teamId)`.

### Appwrite console checklist

- [ ] Create project on Appwrite Cloud; note endpoint and project ID
- [ ] Add Android platform (package, e.g. `com.yourname.weddingmanager`) and Apple platform (same bundle ID)
- [ ] Enable Anonymous auth (Auth → Settings); Email/Password comes later with the auth module
- [ ] Create database `wedding_manager` and the three tables with the columns above
- [ ] Add the indexes on `guests`
- [ ] Set table permissions and enable row security
- [ ] Copy all IDs into `.env`

Optional: keep the schema in `appwrite.config.json` with the Appwrite CLI so table changes are versioned in git alongside the code.

## Guest CRUD: service layer & state

Screens call hooks, hooks call the service, and only the service talks to Appwrite. Swapping or extending the backend then touches one file per feature.

**`src/lib/appwrite.ts`** (one Client for the whole app)

```ts
import 'react-native-url-polyfill/auto';
import { Client, Account, TablesDB } from 'react-native-appwrite';
import { config } from './config';

export const client = new Client()
  .setEndpoint(config.endpoint)
  .setProject(config.projectId)
  .setPlatform(config.platformId); // Android package / iOS bundle ID

export const account = new Account(client);
export const tablesDB = new TablesDB(client);
```

**`src/features/guests/guest.service.ts`**

```ts
import { ID, Permission, Role, Query } from 'react-native-appwrite';
import { tablesDB } from '@/lib/appwrite';
import { config } from '@/lib/config';
import type { Guest, GuestInput, EventType } from './guest.schema';

const base = { databaseId: config.databaseId, tableId: config.tables.guests };
const owner = (uid: string) => [
  Permission.read(Role.user(uid)),
  Permission.update(Role.user(uid)),
  Permission.delete(Role.user(uid)),
];

export const guestService = {
  async list(weddingId: string, eventType?: EventType): Promise<Guest[]> {
    const queries = [Query.equal('weddingId', weddingId), Query.orderAsc('title'), Query.limit(100)];
    if (eventType) queries.push(Query.equal('eventType', eventType));
    // Paginate with Query.cursorAfter(lastId) until fewer than 100 rows return.
    const res = await tablesDB.listRows<Guest>({ ...base, queries });
    return res.rows;
  },
  get: (rowId: string) => tablesDB.getRow<Guest>({ ...base, rowId }),
  create: (uid: string, data: GuestInput) =>
    tablesDB.createRow<Guest>({ ...base, rowId: ID.unique(), data, permissions: owner(uid) }),
  update: (rowId: string, data: Partial<GuestInput>) =>
    tablesDB.updateRow<Guest>({ ...base, rowId, data }),
  remove: (rowId: string) => tablesDB.deleteRow({ ...base, rowId }),
};
```

**Hooks (`src/features/guests/hooks/`)**

| Hook | Does | Cache key |
| --- | --- | --- |
| `useGuests(weddingId, eventType)` | List for one tab | `['guests', weddingId, eventType]` |
| `useGuestStats(weddingId)` | Headcount and status counts for Home and the summary strip | `['guests', weddingId, 'stats']` |
| `useGuest(id)` | One guest for detail and edit | `['guest', id]` |
| `useCreateGuest()` | Create, then invalidate `['guests', weddingId]` | — |
| `useUpdateGuest()` | Update with optimistic status / invite toggle | — |
| `useDeleteGuest()` | Delete after confirm, then invalidate | — |

**Rules**

- `guest.schema.ts` defines one zod schema; the form, the TS types and the service all use it.
- Every Appwrite error goes through `utils/errors.ts`, which turns an `AppwriteException` into a short user message and a toast.
- Loading shows skeleton cards; errors show a retry button; empty lists show `EmptyState`.
- `Zustand` keeps only `currentWeddingId` and `themeName`; server data stays in TanStack Query.

## Future expansion

The Home tile grid is generated from `src/modules/registry.ts`, so a new segment appears on Home by adding one entry and one feature folder; no Home code changes.

```ts
// src/modules/registry.ts
import type { ComponentProps } from 'react';
import type { Ionicons } from '@expo/vector-icons';

export type AppModule = {
  id: string;
  title: string;
  icon: ComponentProps<typeof Ionicons>['name'];
  route: string;           // Expo Router path
  status: 'live' | 'soon';
  order: number;
  useStat?: () => string | undefined; // one-line stat on the tile
};

export const modules: AppModule[] = [
  { id: 'guests',    title: 'Guests',    icon: 'people-outline',   route: '/guests',    status: 'live', order: 1, useStat: useGuestTileStat },
  { id: 'expenses',  title: 'Expenses',  icon: 'wallet-outline',   route: '/expenses',  status: 'soon', order: 2 },
  { id: 'vendors',   title: 'Vendors',   icon: 'storefront-outline', route: '/vendors', status: 'soon', order: 3 },
  { id: 'checklist', title: 'Checklist', icon: 'checkbox-outline', route: '/checklist', status: 'soon', order: 4 },
  { id: 'events',    title: 'Events',    icon: 'calendar-outline', route: '/events',    status: 'soon', order: 5 },
  { id: 'gifts',     title: 'Gifts',     icon: 'gift-outline',     route: '/gifts',     status: 'soon', order: 6 },
  { id: 'settings',  title: 'Settings',  icon: 'settings-outline', route: '/settings',  status: 'live', order: 7 },
];
```

**Candidate modules**

| Module | What it adds | New table |
| --- | --- | --- |
| Expenses | Add/edit expenses by category, budget vs spent | `expenses` (exists) |
| Vendors | Caterer, decorator, photographer contacts, advance paid | `vendors` |
| Checklist | Tasks with due dates and owners | `tasks` |
| Events | Mehendi, Haldi, Sangeet, Wedding, Reception with date, venue, guest list per event | `events` |
| Gifts | Gifts and shagun received per guest, thank-you sent | `gifts` |
| Settings (extend) | v1 has the wedding profile; later add theme picker and export guest list to CSV | none |
| Auth | Email + password sign in / sign up, upgrading the anonymous account in place; sign out in Settings | none |

**Adding a module (the recipe Claude follows)**

1. Create the table in Appwrite with a `weddingId` column and row security; add its ID to `.env` and `config.ts`.
2. Create `src/features/<module>/` with `*.schema.ts`, `*.service.ts`, `*.constants.ts`, `hooks/`, `components/`.
3. Add routes under `app/(app)/<module>/` (`index`, `new`, `[id]/index`, `[id]/edit`).
4. Add or flip its entry in `registry.ts` to `status: 'live'`.
5. Use only theme tokens and shared components; add a new shared component to `src/components/` if two modules need it.

**When guests are tied to many events:** the Events module would replace the single `eventType` column with an `eventIds` array (or a `guest_events` link table), migrated once by a script.

## Build plan & Claude prompts

Build in eight phases, one prompt per phase, and run the app on a device after each before moving on. Keep this doc and `CLAUDE.md` in the repo so every prompt can say "follow the plan".

### Phase 0: Project setup

```text
Create a new Expo app called "wedding-manager" with TypeScript and Expo Router using the latest stable SDK.
Set up the folder structure exactly as in the planning doc (app/ for routes, src/ for theme, components,
features, modules, lib, store, utils). Add the "@/*" path alias to src. Install: react-native-appwrite,
react-native-url-polyfill, @tanstack/react-query, zustand, react-hook-form, zod, @hookform/resolvers,
date-fns, expo-font, @expo-google-fonts/poppins, @react-native-community/datetimepicker.
Create .env.example with the EXPO_PUBLIC_APPWRITE_* keys and src/lib/config.ts that reads them.
Create CLAUDE.md from the planning doc's last section. Do not build any screens yet.
```

**Done when:** `npx expo start` opens a blank app on a phone with no errors.

### Phase 1: Theme, fonts, shared components

```text
Create src/theme/theme.ts exactly as in the planning doc, plus ThemeProvider.tsx with useTheme()
and a makeStyles helper. In app/_layout.tsx load Poppins 400/500/600/700 with useFonts and keep the
splash screen visible until loaded. Build shared components using ONLY theme tokens: Screen, AppText
(variants display/h1/h2/title/body/caption), AppButton (primary/secondary/danger, loading state),
AppInput (label + error), Card, Badge, SegmentedTabs, OptionChips (single select), NumberStepper,
EmptyState. Add a temporary /dev/components screen that shows every component.
```

**Done when:** every component renders in Poppins with beige/brown colours and no hex value exists outside `theme.ts`.

### Phase 2: Appwrite, session, Settings

```text
Create src/lib/appwrite.ts (single Client, account, tablesDB) and src/lib/queryClient.ts.
No sign-in screens in this phase. Create src/lib/session.ts with ensureSession(): account.get(),
and if that fails account.createAnonymousSession(). Create src/features/wedding (schema, service,
hooks) with weddingService.ensure(uid) that returns the user's wedding row or creates an empty one
(currency INR) with user-only permissions; store currentWeddingId in a Zustand store. Run both in
app/_layout.tsx before hiding the splash screen. Build app/(app)/settings.tsx (screen in
src/features/settings) to edit couple names, wedding date, reception date and budget with
react-hook-form + zod and the datetimepicker. Map AppwriteException to friendly messages in
src/utils/errors.ts.
```

**Done when:** a fresh install opens to a placeholder Home; you set a date in Settings, close the app, reopen it and the date is still there.

### Phase 3: Home screen

```text
Build the Home screen per the planning doc: "Wedding Manager" title with a gear icon to Settings,
countdown chip with all edge cases (N days, 1 day, today, past, no date → button to Settings),
total expenses card (sum of "expenses" rows in INR,
formatted with en-IN locale, showing "of ₹budget" if set), and a 2-column tile grid generated
from src/modules/registry.ts. Live tiles navigate; "soon" tiles show a Coming soon badge and are
disabled. Add pull to refresh.
```

**Done when:** countdown is correct for today, tomorrow and a past date; Guests tile opens a placeholder.

### Phase 4: Guest list

```text
Create src/features/guests with guest.schema.ts (zod), guest.constants.ts (status, connection,
event type labels from the doc), guest.service.ts (TablesDB list/get/create/update/remove with
user permissions and cursor pagination) and TanStack Query hooks. Build app/(app)/guests/index.tsx:
SegmentedTabs Wedding|Reception synced to ?type=, summary strip (headcount, confirmed, waiting,
declined, invites not sent), search by title, status and connection filter chips, GuestCard list,
empty state, pull to refresh, and an "Add Guest" primary button to /guests/new?type=<tab>.
```

**Done when:** rows added in the Appwrite console appear under the right tab with correct counts.

### Phase 5: Add and edit guest

```text
Build a reusable GuestForm (react-hook-form + zod) with the fields, controls, rules and defaults
from the planning doc table. Use it in app/(app)/guests/new.tsx (type pre-selected from the query
param) and app/(app)/guests/[id]/edit.tsx (pre-filled). On save: validate, disable button while
saving, call the mutation, invalidate guest queries, toast, go back. Warn on unsaved changes.
```

**Done when:** a new guest shows instantly in the list and edits persist after an app restart.

### Phase 6: Guest detail and delete

```text
Build app/(app)/guests/[id]/index.tsx showing all fields in a Card, with quick status chips and an
invite-sent switch that update optimistically. Add Edit and Delete buttons; Delete opens a confirm
dialog, deletes, invalidates queries and returns to the list. Add long-press Edit/Delete on GuestCard.
```

**Done when:** all four CRUD actions work on both tabs and Home tile stats update.

### Phase 7: Polish and release build

```text
Review every screen against CLAUDE.md: no hardcoded colours/fonts, loading skeletons, error retry,
empty states, keyboard-avoiding forms, accessible labels, min 44pt touch targets. Set app name
"Wedding Manager", icon and splash in beige/brown, Android package and iOS bundle ID matching the
Appwrite platforms. Configure eas.json with preview (APK) and production profiles.
```

**Done when:** an EAS preview APK installs on Android and the full guest flow works on mobile data.

## CLAUDE.md (rules for vibe coding)

Save this as `CLAUDE.md` in the repo root; Claude reads it on every task, which keeps generated code consistent across phases.

```markdown
# Wedding Manager — rules for Claude

## Stack
Expo (latest stable SDK) + React Native + TypeScript (strict) + Expo Router.
Backend: Appwrite via react-native-appwrite (TablesDB: tables/rows/columns).
Server state: TanStack Query. App state: Zustand. Forms: react-hook-form + zod.

## Structure
- app/ = routes only. Each route file imports a screen from src/features and renders it.
- src/features/<module>/ = schema, constants, service, hooks, components for one module.
- src/components/ = shared UI used by 2+ modules.
- src/modules/registry.ts = Home tiles. New module => new registry entry.
- src/lib/appwrite.ts = the ONLY Appwrite Client. Never create another.

## Theme (non-negotiable)
- All colours, fonts, font sizes, spacing, radius come from src/theme/theme.ts via useTheme().
- No hex codes, rgb(), fontFamily strings or magic numbers for spacing in any other file.
- Text always uses <AppText variant=...>. Buttons always use <AppButton>.
- Font is Poppins (Poppins_400Regular, _500Medium, _600SemiBold, _700Bold).
- Light theme only for now; write styles with makeStyles(theme => ...) so themes can switch later.

## Data
- Screens never import tablesDB. Screens -> hooks -> <module>.service.ts -> Appwrite.
- Every row has weddingId and user-only permissions (Permission.read/update/delete(Role.user(uid))).
- v1 has no sign-in: uid comes from an anonymous session created in src/lib/session.ts. Don't build auth screens until asked.
- Wedding profile (date, names, budget) is edited only in Settings.
- Stored enum values are snake_case; labels live in <module>.constants.ts.
- Validate every form with the module's zod schema; derive TS types from it.
- After a mutation, invalidate the matching query keys.

## UX
- Every list: loading skeleton, error with retry, empty state, pull to refresh.
- Every destructive action: confirm dialog.
- Touch targets >= 44pt; inputs have labels; forms avoid the keyboard.
- Currency is INR, formatted with Intl.NumberFormat('en-IN').

## Working style
- Do one phase at a time; list files you will create/change before writing code.
- Don't add libraries not listed above without asking.
- Keep files under ~200 lines; split components when larger.
- After changes, run `npx tsc --noEmit` and `npx expo lint` and fix errors.
```

**Definition of done for any feature**

- [ ] Works on Android and iOS (Expo Go or dev build)
- [ ] No TypeScript or lint errors
- [ ] Uses only theme tokens and shared components
- [ ] Loading, error and empty states handled
- [ ] Data survives app restart and is visible only to its owner (the anonymous user in v1)
