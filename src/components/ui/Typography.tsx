import React from 'react';
import { Text, TextStyle, StyleSheet } from 'react-native';
import { useTheme } from '../../hooks/useColorScheme';

interface TypographyProps {
  children: React.ReactNode;
  variant?: 'h1' | 'h2' | 'h3' | 'h4' | 'body1' | 'body2' | 'caption' | 'overline';
  color?: 'primary' | 'secondary' | 'text' | 'textSecondary' | 'textLight' | 'error' | 'success';
  align?: 'left' | 'center' | 'right';
  style?: TextStyle;
}

export const Typography: React.FC<TypographyProps> = ({
                                                        children,
                                                        variant = 'body1',
                                                        color = 'text',
                                                        align = 'left',
                                                        style,
                                                      }) => {
  const { colors, typography } = useTheme();

  const getTextStyle = (): TextStyle => {
    const variantStyles = {
      h1: {
        fontSize: typography.fontSize['4xl'],
        fontFamily: typography.fontFamily.bold,
        lineHeight: typography.fontSize['4xl'] * typography.lineHeight.tight,
      },
      h2: {
        fontSize: typography.fontSize['3xl'],
        fontFamily: typography.fontFamily.bold,
        lineHeight: typography.fontSize['3xl'] * typography.lineHeight.tight,
      },
      h3: {
        fontSize: typography.fontSize['2xl'],
        fontFamily: typography.fontFamily.semiBold,
        lineHeight: typography.fontSize['2xl'] * typography.lineHeight.normal,
      },
      h4: {
        fontSize: typography.fontSize.xl,
        fontFamily: typography.fontFamily.semiBold,
        lineHeight: typography.fontSize.xl * typography.lineHeight.normal,
      },
      body1: {
        fontSize: typography.fontSize.base,
        fontFamily: typography.fontFamily.regular,
        lineHeight: typography.fontSize.base * typography.lineHeight.normal,
      },
      body2: {
        fontSize: typography.fontSize.sm,
        fontFamily: typography.fontFamily.regular,
        lineHeight: typography.fontSize.sm * typography.lineHeight.normal,
      },
      caption: {
        fontSize: typography.fontSize.xs,
        fontFamily: typography.fontFamily.medium,
        lineHeight: typography.fontSize.xs * typography.lineHeight.normal,
      },
      overline: {
        fontSize: typography.fontSize.xs,
        fontFamily: typography.fontFamily.bold,
        textTransform: 'uppercase' as const,
        letterSpacing: 1.5,
      },
    };

    const colorStyles = {
      primary: colors.primary,
      secondary: colors.secondary,
      text: colors.text,
      textSecondary: colors.textSecondary,
      textLight: colors.textLight,
      error: colors.error,
      success: colors.success,
    };

    return {
      ...variantStyles[variant],
      color: colorStyles[color],
      textAlign: align,
    };
  };

  return <Text style={[getTextStyle(), style]}>{children}</Text>;
};
