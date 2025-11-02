export const lightColors = {
  background: '#f9fafb',
  surface: '#ffffff',
  text: '#1f2937',
  textSecondary: '#6b7280',
  textMuted: '#9ca3af',
  border: '#e5e7eb',
  borderLight: '#d1d5db',
  primary: '#2563eb',
  success: '#10b981',
  warning: '#eab308',
  error: '#ef4444',
  cardBackground: '#ffffff',
  inputBackground: '#ffffff',
  headerBackground: '#ffffff',
  statusBadge: '#d1fae5',
  statusText: '#065f46',
  themeToggleBg: '#f3f4f6',
};

export const darkColors = {
  background: '#111827',
  surface: '#1f2937',
  text: '#f9fafb',
  textSecondary: '#d1d5db',
  textMuted: '#9ca3af',
  border: '#374151',
  borderLight: '#4b5563',
  primary: '#3b82f6',
  success: '#10b981',
  warning: '#eab308',
  error: '#ef4444',
  cardBackground: '#1f2937',
  inputBackground: '#374151',
  headerBackground: '#1f2937',
  statusBadge: '#065f46',
  statusText: '#d1fae5',
  themeToggleBg: '#374151',
};

export const getThemeColors = (isDark: boolean) => {
  return isDark ? darkColors : lightColors;
};

