# Personal Expense Budget Tracker

A mobile app for recording expenses in Philippine pesos and checking how much of a monthly budget remains. Built for the CS15L React Native final project.

## Team

- Ramil Alexander Gabriel M. Mabanag
- Dwyane L. Malia

## Features

- Dashboard with this month's spending, remaining balance, category totals, and recent activity
- Add, view, edit, delete, and filter expenses
- Create, rename, and delete custom categories
- Choose expense dates with the native date picker
- Set a monthly budget
- Save expenses, categories, and the budget in a local SQLite database

## Tech stack

Expo SDK 57, React Native, JSX, React Navigation, `expo-sqlite`, and `@react-native-community/datetimepicker`.

## Run the project

1. Install Node.js and npm.
2. In this folder, run `npm ci`.
3. Run `npx expo start` and open the app on a compatible device or emulator.
4. Run `npm run lint` to check the JavaScript and JSX files.

The app stores data in a SQLite file on the device. Each installation has its own data; uninstalling the app removes that installation's local database. No account or internet connection is needed for expense entry. New installations start with a ₱0 budget; existing saved budgets stay as they are and can be changed in Budget Settings.

## How the files work together

`App.jsx` wraps `AppNavigator.jsx` in `src/context/BudgetContext.jsx`. The navigator selects a screen. Screens call `useBudget()` to read expenses, categories, and the monthly budget or to save changes. The context calls the query functions in `src/database/`, then reloads SQLite data so the screens show the latest saved values. Reusable controls are in `src/components/`, and shared colors are in `src/theme/`.

## Database structure

`src/database/db.js` creates and seeds three SQLite tables:

| Table | Main fields | Purpose |
| --- | --- | --- |
| `categories` | `id`, unique `name`, `created_at` | Available expense categories |
| `transactions` | `id`, positive `amount`, `description`, `date`, `category_id`, `created_at` | Saved expenses; `category_id` references `categories.id` |
| `settings` | `key`, `value` | The monthly budget and setup marker |

`categoryQueries.js`, `transactionQueries.js`, and `settingsQueries.js` contain database reads and writes. SQLite's foreign key restriction prevents deleting a category used by an expense.

## Android APK

The `preview` profile in `eas.json` requests an installable APK. With an Expo account, run:

```text
npx eas-cli@latest build --platform android --profile preview
```

Install the resulting APK on an Android device and verify that expenses, categories, and the budget remain after closing and reopening the app. The default Android App Bundle is not the APK required for direct installation.
