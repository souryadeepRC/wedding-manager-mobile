// Single source of truth for look & feel. Never hardcode these values in screens.

// Plus Jakarta Sans for text, Fraunces (soft, playful serif) for big headings.
export const fonts = {
  regular: 'PlusJakartaSans_400Regular',
  medium: 'PlusJakartaSans_500Medium',
  semibold: 'PlusJakartaSans_600SemiBold',
  bold: 'PlusJakartaSans_700Bold',
  heading: 'Fraunces_700Bold',
  display: 'Fraunces_800ExtraBold',
} as const;

export const spacing = { xxs: 2, xs: 4, sm: 8, md: 12, lg: 16, xl: 24, xxl: 32 } as const;
export const radius = { sm: 8, md: 12, lg: 16, xl: 24, pill: 999 } as const;

export const sizes = {
  touch: 44,
  icon: { sm: 18, md: 24, lg: 32 },
  // Round icon badges: list rows, tiles, empty/error illustrations.
  avatar: { md: 48, lg: 88 },
  swatch: 24,
  dot: 8,
  border: 1,
  tabBar: 64,
  glow: 360,
} as const;

// Hex alpha suffixes appended to theme colours for tinted fills, edges and glows.
export const alpha = { faint: '14', tint: '26', soft: '40', edge: '66', glow: '55' } as const;

export const typography = {
  hero: { fontFamily: fonts.display, fontSize: 76, lineHeight: 84 },
  display: { fontFamily: fonts.display, fontSize: 40, lineHeight: 46 },
  h1: { fontFamily: fonts.display, fontSize: 32, lineHeight: 38 },
  h2: { fontFamily: fonts.heading, fontSize: 22, lineHeight: 28 },
  title: { fontFamily: fonts.semibold, fontSize: 17, lineHeight: 24 },
  body: { fontFamily: fonts.regular, fontSize: 14, lineHeight: 22 },
  caption: { fontFamily: fonts.regular, fontSize: 12, lineHeight: 18 },
  label: { fontFamily: fonts.semibold, fontSize: 13, lineHeight: 18 },
  overline: { fontFamily: fonts.bold, fontSize: 12, lineHeight: 16, letterSpacing: 1.2, textTransform: 'uppercase' },
  amount: { fontFamily: fonts.bold, fontSize: 24, lineHeight: 32 },
  button: { fontFamily: fonts.semibold, fontSize: 15, lineHeight: 20 },
} as const;

// Soft glow under raised elements; colour is set per element from the theme.
export const shadow = {
  md: { shadowOpacity: 0.35, shadowRadius: 14, shadowOffset: { width: 0, height: 6 }, elevation: 6 },
} as const;

export type ThemeColors = {
  background: string;
  surface: string;
  surfaceAlt: string;
  border: string;
  primary: string;
  primaryPressed: string;
  onPrimary: string;
  textPrimary: string;
  textSecondary: string;
  accent: string;
  success: string;
  warning: string;
  danger: string;
  skeleton: string;
  disabled: string;
  onDisabled: string;
  overlay: string;
  // Text on the countdown hero and on the "married" (past) hero.
  onHero: string;
  onPast: string;
};

// CSS gradient strings for `backgroundImage` (supported natively since RN 0.76).
export type ThemeGradients = {
  hero: string;
  past: string;
  settled: string;
  progress: string;
};

export type AppTheme = {
  name: string;
  label: string;
  mode: 'light' | 'dark';
  colors: ThemeColors;
  gradients: ThemeGradients;
  // Cycled across the Home tiles so each section gets its own colour.
  // Order matters: 0 pink, 1 purple, 2 cyan, 3 gold, 4 mint, 5 orange, 6 lilac (party names).
  tileAccents: readonly string[];
  fonts: typeof fonts;
  typography: typeof typography;
  spacing: typeof spacing;
  radius: typeof radius;
  sizes: typeof sizes;
  alpha: typeof alpha;
  shadow: typeof shadow;
};

const base = { fonts, typography, spacing, radius, sizes, alpha, shadow } as const;

const light: AppTheme = {
  ...base,
  mode: 'light',
  name: 'light',
  label: 'Light',
  tileAccents: ['#B08D57', '#4F7942', '#C58B2A', '#A63D40', '#7B5E57', '#4E342E', '#B08D57'],
  colors: {
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
    skeleton: '#E8DCC8',
    disabled: '#EFE8DA',
    onDisabled: '#A79A8C',
    overlay: '#3E2723CC',
    onHero: '#FAF6F0',
    onPast: '#3E2723',
  },
  gradients: {
    hero: 'linear-gradient(160deg, #6D4C41 0%, #4E342E 100%)',
    past: 'linear-gradient(160deg, #EBD3A6 0%, #C9A56B 100%)',
    settled: 'linear-gradient(160deg, #E6EEDF 0%, #D3E0C8 100%)',
    progress: 'linear-gradient(90deg, #4E342E 0%, #B08D57 100%)',
  },
};

const dark: AppTheme = {
  ...base,
  mode: 'dark',
  name: 'dark',
  label: 'Dark',
  tileAccents: ['#D7B98A', '#7FB069', '#E0A84A', '#E07A7D', '#B8A596', '#D7B98A', '#B08D57'],
  colors: {
    background: '#1E1512',
    surface: '#2A1F1B',
    surfaceAlt: '#3A2C26',
    border: '#4E3C34',
    primary: '#D7B98A',
    primaryPressed: '#C4A574',
    onPrimary: '#1E1512',
    textPrimary: '#F3EBDD',
    textSecondary: '#B8A596',
    accent: '#B08D57',
    success: '#7FB069',
    warning: '#E0A84A',
    danger: '#E07A7D',
    skeleton: '#3A2C26',
    disabled: '#2F2420',
    onDisabled: '#7B6A5F',
    overlay: '#000000CC',
    onHero: '#1E1512',
    onPast: '#1E1512',
  },
  gradients: {
    hero: 'linear-gradient(160deg, #E8CFA6 0%, #C9A774 100%)',
    past: 'linear-gradient(160deg, #F2CC7A 0%, #E0A84A 100%)',
    settled: 'linear-gradient(160deg, #2E3D2B 0%, #263322 100%)',
    progress: 'linear-gradient(90deg, #D7B98A 0%, #E0A84A 100%)',
  },
};

// Midnight purple with hot-pink and gold: the celebration look.
const party: AppTheme = {
  ...base,
  mode: 'dark',
  name: 'party',
  label: 'Party',
  tileAccents: ['#FF4FA3', '#7C5CFF', '#22D3EE', '#FFC857', '#3DDC97', '#FF8A4C', '#C084FC'],
  colors: {
    background: '#140A24',
    surface: '#221238',
    surfaceAlt: '#33194F',
    border: '#4A2A73',
    primary: '#FF4FA3',
    primaryPressed: '#E03888',
    onPrimary: '#2A0A1F',
    textPrimary: '#FFF4FB',
    textSecondary: '#BFA8DC',
    accent: '#FFC857',
    success: '#3DDC97',
    warning: '#FFB020',
    danger: '#FF6B81',
    skeleton: '#33194F',
    disabled: '#1C0F2E',
    onDisabled: '#6F5A8C',
    overlay: '#0B0514D9',
    onHero: '#2A0A1F',
    onPast: '#2A1A05',
  },
  gradients: {
    hero: 'linear-gradient(160deg, #FF86C4 0%, #FF4FA3 55%, #FF3D97 100%)',
    past: 'linear-gradient(160deg, #FFE39A 0%, #FFC857 100%)',
    settled: 'linear-gradient(160deg, #2C3550 0%, #23363F 100%)',
    progress: 'linear-gradient(90deg, #FF4FA3 0%, #FFC857 100%)',
  },
};

// Stored locally on the device (not in the database).
export const themes = { party, light, dark } as const;
export type ThemeName = keyof typeof themes;
export const themeNames = Object.keys(themes) as [ThemeName, ...ThemeName[]];
export const defaultThemeName: ThemeName = 'party';
export const isThemeName = (v: unknown): v is ThemeName =>
  typeof v === 'string' && v in themes;
