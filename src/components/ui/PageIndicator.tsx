import React from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { useTheme } from '../../hooks/useColorScheme';

interface PageIndicatorProps {
  totalPages: number;
  currentPage: number;
  scrollX?: Animated.Value;
}

export const PageIndicator: React.FC<PageIndicatorProps> = ({
                                                              totalPages,
                                                              currentPage,
                                                              scrollX,
                                                            }) => {
  const { colors, spacing } = useTheme();

  return (
    <View style={styles.container}>
      {Array.from({ length: totalPages }).map((_, index) => {
        const isActive = index === currentPage;

        return (
          <View
            key={index}
            style={[
              styles.dot,
              {
                backgroundColor: isActive ? colors.primary : colors.textLight,
                width: isActive ? spacing.lg : spacing.sm,
              },
            ]}
          />
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dot: {
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
});
