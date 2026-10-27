// Lets the tab bar ask Settings before leaving it with unsaved edits.
// A plain module (not Zustand): it holds a callback, not app state.
type Guard = { isDirty: () => boolean; onBlocked: (leave: () => void) => void };

let current: Guard | null = null;

export const settingsGuard = {
  register(guard: Guard) {
    current = guard;
    return () => { if (current === guard) current = null; };
  },
  shouldBlock: () => !!current?.isDirty(),
  block: (leave: () => void) => current?.onBlocked(leave),
};
