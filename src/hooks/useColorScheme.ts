import { useColorScheme as useNativeColorScheme } from 'react-native';
import { theme } from '../constants/theme';

export const useTheme = () => {
  const colorScheme = useNativeColorScheme();
  const isDark = colorScheme === 'dark';

  return {
    isDark,
    colors: {
      primary: theme.colors.primary,
      primaryDark: theme.colors.primaryDark,
      secondary: theme.colors.secondary,
      accent: theme.colors.accent,
      background: isDark ? theme.colors.backgroundDark : theme.colors.background,
      surface: isDark ? theme.colors.surfaceDark : theme.colors.surface,
      text: isDark ? theme.colors.textDark : theme.colors.text,
      textSecondary: theme.colors.textSecondary,
      textLight: theme.colors.textLight,
      success: theme.colors.success,
      warning: theme.colors.warning,
      error: theme.colors.error,
      overlay: theme.colors.overlay,
      border: isDark ? theme.colors.borderDark : theme.colors.border,
    },
    typography: theme.typography,
    spacing: theme.spacing,
    borderRadius: theme.borderRadius,
    elevation: theme.elevation,
  };
};
