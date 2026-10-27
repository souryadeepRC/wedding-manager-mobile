# Wedding Manager

A mobile app for planning an Indian wedding: a countdown to the big day, the guest list, expenses and payments, shopping, and a to-do checklist, all in one place.

Built with Expo and React Native for **Android and iOS**, with data stored in [Appwrite Cloud](https://appwrite.io).

---

## Features

| Area | What it does |
| --- | --- |
| **Home** | Countdown hero ("45 Days to Go", "Tomorrow!", "Today's the day!", "Married N days ago"), total spent with % paid, and a tile for every module with a live stat. |
| **Guests** | Families or individuals with relation, event (Wedding / Reception), head count, invite-sent flag, RSVP status and notes. Search, filter by connection, status and invite, and counts per event. |
| **Expenses** | Each expense has a total and any number of payments (cash, card, GPay, PhonePe). Shows what's paid, what's left, and progress. A payment can never go over the amount still owed. Icons are matched from the title ("caterer", "photo", "mehendi"…). |
| **Shopping** | What to buy and for whom (Mother, Father, Bride, Groom), with Pending / Done tabs. |
| **Checklist** | Tasks with optional due dates, sorted soonest first, and overdue / due-today / due-soon labels. |
| **Settings** | Bride's and groom's names, wedding and reception dates, and theme (Party, Light, Dark). Warns before leaving with unsaved changes. |

Every list has a loading skeleton, an error state with retry, an empty state and pull-to-refresh. Destructive actions ask for confirmation. Amounts are shown in INR with Indian digit grouping (₹12,50,000).

There is no sign-up. On first launch the app creates an **anonymous Appwrite session**, and every row is readable and writable only by that user.

## Tech stack

| Concern | Library |
| --- | --- |
| App framework | [Expo SDK 58](https://docs.expo.dev) (managed), React Native 0.88, React 19, TypeScript (strict) |
| Navigation | [Expo Router](https://docs.expo.dev/router/introduction/) (file-based, tabs + stacks) |
| Backend | [Appwrite Cloud](https://appwrite.io) via `react-native-appwrite` (TablesDB) |
| Server state | [TanStack Query](https://tanstack.com/query) |
| App state | [Zustand](https://zustand.docs.pmnd.rs) (persisted with AsyncStorage) |
| Forms & validation | react-hook-form + zod |
| UI | Plus Jakarta Sans + Fraunces (Google Fonts), Ionicons, Reanimated, date-fns |

## Getting started

### Prerequisites

- Node.js 20+ and npm
- An [Appwrite Cloud](https://cloud.appwrite.io) project
- Expo Go on a device, or an Android emulator / iOS simulator

### 1. Install

```bash
git clone https://github.com/souryadeepRC/wedding-manager-mobile.git
cd wedding-manager-mobile
npm install
```

### 2. Set up Appwrite

In the Appwrite console:

1. Create a project and add an **Android** and an **Apple** platform. The bundle ID / package name must match `app.json`.
2. Under **Auth → Settings**, enable **Anonymous** sessions.
3. Create a database with the tables below. For each table, turn **row security on** and give the role **Users** the **create** permission. The app sets per-row read/update/delete permissions for the owner.

| Table | Columns |
| --- | --- |
| `weddings` | `brideName` string, `groomName` string, `weddingDate` datetime, `receptionDate` datetime |
| `guests` | `weddingId` string, `title` string, `connection` string, `eventType` string, `guestCount` integer, `inviteSent` boolean, `status` string, `notes` string |
| `expenses` | `weddingId` string, `title` string, `totalAmount` integer |
| `payments` | `weddingId` string, `expenseId` string, `amount` integer, `paidOn` datetime, `mode` string |
| `shopping` | `weddingId` string, `title` string, `itemFor` string, `status` string |
| `checklist` | `weddingId` string, `title` string, `dueDate` datetime, `status` string |

Enum-like values are stored in `snake_case` (for example `my_friend`, `credit_card`). Display labels live in each module's `*.constants.ts`. See `src/features/*/*.service.ts` for the exact payloads.

### 3. Configure environment

Create a `.env` file in the project root:

```bash
EXPO_PUBLIC_APPWRITE_ENDPOINT=https://<region>.cloud.appwrite.io/v1
EXPO_PUBLIC_APPWRITE_PROJECT_ID=
EXPO_PUBLIC_APPWRITE_PLATFORM_ID=
EXPO_PUBLIC_APPWRITE_DATABASE_ID=
EXPO_PUBLIC_APPWRITE_TABLE_WEDDINGS_ID=
EXPO_PUBLIC_APPWRITE_TABLE_GUESTS_ID=
EXPO_PUBLIC_APPWRITE_TABLE_EXPENSES_ID=
EXPO_PUBLIC_APPWRITE_TABLE_PAYMENTS_ID=
EXPO_PUBLIC_APPWRITE_TABLE_SHOPPING_ID=
EXPO_PUBLIC_APPWRITE_TABLE_CHECKLIST_ID=
```

`.env` is git-ignored. IDs are read only through `src/lib/config.ts`, so never hardcode them.

### 4. Run

```bash
npx expo start        # then press a (Android), i (iOS) or scan the QR code with Expo Go
npm run android       # shortcut for Android
npm run ios           # shortcut for iOS
```

## Scripts

| Command | Purpose |
| --- | --- |
| `npx expo start` | Start the dev server |
| `npx tsc --noEmit` | Type-check |
| `npx expo lint` | Lint (ESLint, `eslint-config-expo`) |

Run the type-check and the linter before every commit.

## Project structure

```
src/
├── app/                  # Expo Router routes only (thin: each file renders a screen)
│   ├── _layout.tsx       # Fonts, providers, session bootstrap
│   ├── (app)/            # Bottom tabs: Home, Guests, Expenses, Settings
│   ├── shopping/         # Stack pushed from Home
│   └── checklist/        # Stack pushed from Home
├── features/<module>/    # One folder per module: schema, constants, service, hooks, components, screens
├── components/           # Shared UI (AppText, AppButton, PageHeader, EmptyState, Toast, …)
├── theme/                # theme.ts: the single source of colours, fonts, spacing, gradients
├── modules/registry.ts   # Home tiles; a new module is one new entry
├── lib/                  # Appwrite client, config, session, query client
├── store/                # Zustand: currentWeddingId and themeName only
└── utils/                # Dates, currency, errors, confirm dialog
```

Data flows **screen → hook → `<module>.service.ts` → Appwrite**. Screens never talk to Appwrite directly, and `src/lib/appwrite.ts` is the only Appwrite client.

## Theming

All colours, fonts, sizes, spacing and gradients come from `src/theme/theme.ts` through `useTheme()` and `makeStyles(theme => …)`. No other file contains hex codes, font names or magic spacing values. Text always uses `<AppText variant="…">` and buttons use `<AppButton>`.

There are three themes: **Party** (default: midnight purple, hot pink and gold), **Light** (beige and dark brown) and **Dark**. To add a theme, add an object to `themes` in `theme.ts` with every colour and gradient key. The Settings picker lists it automatically.

## Adding a module

1. Create the Appwrite table (with `weddingId` and row security), then add its ID to `.env` and `src/lib/config.ts`.
2. Create `src/features/<module>/` with `*.schema.ts`, `*.service.ts`, `*.constants.ts`, `hooks/` and `components/`.
3. Add routes under `src/app/` (`index`, `new`, `[id]/edit`).
4. Add an entry to `src/modules/registry.ts` with `status: 'live'` (use `'soon'` for a locked "Coming soon" tile).
5. Use only theme tokens and shared components. Promote a component to `src/components/` once two modules need it.

## Contributing

- Work on a feature branch and open a pull request against `main`.
- Keep files under ~200 lines, and split components when they grow.
- Before touching an Expo API, check the docs for the installed SDK version (see `AGENTS.md`).
- Requirements and designs live in `user-story/` and `user-story/design/`. Project rules for AI-assisted work are in `CLAUDE.md`.
