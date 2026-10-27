export const config = {
  endpoint: process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT ?? '',
  projectId: process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID ?? '',
  platformId: process.env.EXPO_PUBLIC_APPWRITE_PLATFORM_ID ?? '',
  databaseId: process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID ?? '',
  tables: {
    weddings: process.env.EXPO_PUBLIC_APPWRITE_TABLE_WEDDINGS_ID ?? '',
    guests: process.env.EXPO_PUBLIC_APPWRITE_TABLE_GUESTS_ID ?? '',
    expenses: process.env.EXPO_PUBLIC_APPWRITE_TABLE_EXPENSES_ID ?? '',
    payments: process.env.EXPO_PUBLIC_APPWRITE_TABLE_PAYMENTS_ID ?? '',
    shopping: process.env.EXPO_PUBLIC_APPWRITE_TABLE_SHOPPING_ID ?? '',
    checklist: process.env.EXPO_PUBLIC_APPWRITE_TABLE_CHECKLIST_ID ?? '',
  },
} as const;
