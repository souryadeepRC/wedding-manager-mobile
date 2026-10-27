import { account } from './appwrite';

let pending: Promise<string> | null = null;

// Returns the current user id, creating an anonymous session on first launch.
export function ensureSession(): Promise<string> {
  pending ??= (async () => {
    try {
      return (await account.get()).$id;
    } catch {
      await account.createAnonymousSession();
      return (await account.get()).$id;
    }
  })().catch(e => {
    pending = null;
    throw e;
  });
  return pending;
}
