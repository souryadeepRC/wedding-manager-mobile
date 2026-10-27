import { AppwriteException } from 'react-native-appwrite';

export function friendlyMessage(e: unknown): string {
  if (e instanceof AppwriteException) {
    if (e.code === 401 || e.code === 403) return 'You do not have access to this data.';
    if (e.code === 404) return 'We could not find that item.';
    if (e.code === 429) return 'Too many requests. Please wait a moment.';
    if (e.code >= 500) return 'The server had a problem. Please try again.';
  }
  if (e instanceof TypeError) return 'Network problem. Check your connection and try again.';
  // In development show Appwrite's own reason (wrong table ID, missing column, bad value...).
  if (__DEV__ && e instanceof AppwriteException && e.message) return `Something went wrong: ${e.message}`;
  return 'Something went wrong. Please try again.';
}

// Returns the friendly message and shows it via the given toast function.
export function handleError(e: unknown, toast: (message: string, options?: { tone?: 'error' }) => void): string {
  console.warn('Request failed', e);
  const message = friendlyMessage(e);
  toast(message, { tone: 'error' });
  return message;
}
