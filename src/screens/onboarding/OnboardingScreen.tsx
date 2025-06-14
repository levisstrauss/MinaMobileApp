import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  FlatList,
  StatusBar,
  SafeAreaView,
  Text,
  TouchableOpacity,
  Animated,
} from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Simple theme without external dependencies
const colors = {
  primary: '#00C7BE',
  background: '#000000',
  text: '#FFFFFF',
  textSecondary: '#CCCCCC',
  textLight: '#999999',
};

// Onboarding data with descriptions
const ONBOARDING_SLIDES = [
  {
    id: '1',
    title: 'AI-Powered Navigation',
    description: 'Smart routing that adapts to\nyour driving style',
    subtitle: 'Experience intelligent routing that learns from your preferences and predicts traffic 60 minutes ahead',
    illustration: '🤖🗺️',
    backgroundColor: '#667EEA',
    accentColor: '#764BA2',
  },
  {
    id: '2',
    title: 'Community-Driven Routes',
    description: 'Real-time updates from\nmillions of drivers',
    subtitle: 'Join millions of drivers sharing real-time updates, building better maps together',
    illustration: '🚗👥',
    backgroundColor: '#F093FB',
    accentColor: '#F5576C',
  },
  {
    id: '3',
    title: 'Smart & Sustainable',
    description: 'Track your impact and\nearn green rewards',
    subtitle: 'Track your environmental impact, find eco-friendly routes, and earn rewards for green driving',
    illustration: '🌱⚡',
    backgroundColor: '#4FACFE',
    accentColor: '#00F2FE',
  },
];

// Navigation Props Interface
interface OnboardingScreenProps {
  onGetStarted: () => void;
  onLogin: () => void;
}

// Simple Button Component
interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'ghost';
  style?: any;
}

const Button: React.FC<ButtonProps> = ({ title, onPress, variant = 'primary', style }) => {
  const buttonStyle = variant === 'primary'
    ? [styles.primaryButton, style]
    : [styles.ghostButton, style];

  const textStyle = variant === 'primary'
    ? styles.primaryButtonText
    : styles.ghostButtonText;

  return (
    <TouchableOpacity style={buttonStyle} onPress={onPress} activeOpacity={0.8}>
      <Text style={textStyle}>{title}</Text>
    </TouchableOpacity>
  );
};

// Page Indicator Component
interface PageIndicatorProps {
  totalPages: number;
  currentPage: number;
}

const PageIndicator: React.FC<PageIndicatorProps> = ({ totalPages, currentPage }) => {
  return (
    <View style={styles.indicatorContainer}>
      {Array.from({ length: totalPages }).map((_, index) => {
        const isActive = index === currentPage;
        return (
          <View
            key={index}
            style={[
              styles.dot,
              {
                backgroundColor: isActive ? colors.primary : colors.textLight,
                width: isActive ? 24 : 8,
              },
            ]}
          />
        );
      })}
    </View>
  );
};

// Slide Item Component with animation
interface OnboardingSlideItemProps {
  item: typeof ONBOARDING_SLIDES[0];
  index: number;
  isActive: boolean;
}

const OnboardingSlideItem: React.FC<OnboardingSlideItemProps> = ({ item, isActive }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    if (isActive) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 1200,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 40,
          friction: 8,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0.2,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 0.9,
          duration: 500,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [isActive, fadeAnim, scaleAnim]);

  return (
    <View style={[styles.slide, { width: SCREEN_WIDTH }]}>
      <View style={styles.topSection}>
        <Animated.View
          style={[
            styles.illustrationContainer,
            {
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }],
            }
          ]}
        >
          <View style={styles.illustrationCard}>
            <Text style={styles.illustration}>{item.illustration}</Text>
          </View>
          <Text style={styles.description}>{item.description}</Text>
        </Animated.View>
      </View>

      <View style={styles.contentSection}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.subtitle}>{item.subtitle}</Text>
      </View>
    </View>
  );
};

// Main Onboarding Screen with auto-transition
export const OnboardingScreen: React.FC<OnboardingScreenProps> = ({ onGetStarted, onLogin }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-transition effect
  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setCurrentIndex((prevIndex) => {
        const nextIndex = (prevIndex + 1) % ONBOARDING_SLIDES.length;
        flatListRef.current?.scrollToIndex({ index: nextIndex, animated: true });
        return nextIndex;
      });
    }, 3000); // Change slide every 3 seconds

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const handleNext = () => {
    // Clear auto-transition when user interacts
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    if (currentIndex < ONBOARDING_SLIDES.length - 1) {
      const nextIndex = currentIndex + 1;
      flatListRef.current?.scrollToIndex({ index: nextIndex, animated: true });
      setCurrentIndex(nextIndex);
    } else {
      onGetStarted();
    }
  };

  const handleSkip = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    onGetStarted();
  };

  const onViewableItemsChanged = ({ viewableItems }: any) => {
    if (viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index);
    }
  };

  const onScrollBeginDrag = () => {
    // Stop auto-transition when user starts scrolling
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  };

  const viewabilityConfig = {
    itemVisiblePercentThreshold: 50,
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

      <FlatList
        ref={flatListRef}
        data={ONBOARDING_SLIDES}
        renderItem={({ item, index }) => (
          <OnboardingSlideItem
            item={item}
            index={index}
            isActive={index === currentIndex}
          />
        )}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        onScrollBeginDrag={onScrollBeginDrag}
        bounces={false}
      />

      <View style={styles.bottomContainer}>
        <PageIndicator totalPages={ONBOARDING_SLIDES.length} currentPage={currentIndex} />

        <View style={styles.buttonContainer}>
          <Button
            title="Get started"
            onPress={onGetStarted}
            variant="primary"
            style={styles.primaryButton}
          />

          <Button
            title="Log in"
            onPress={onLogin}
            variant="ghost"
            style={styles.secondaryButton}
          />

          <View style={styles.legalContainer}>
            <Text style={styles.legalText}>
              By continuing you agree to MINA's{' '}
              <Text style={styles.linkText}>Terms of Service</Text>
              {' '}and{' '}
              <Text style={styles.linkText}>Privacy Policy</Text>
            </Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  slide: {
    flex: 1,
  },
  topSection: {
    height: SCREEN_HEIGHT * 0.55,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  illustrationContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  illustrationCard: {
    width: 160,
    height: 160,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  illustration: {
    fontSize: 100,
  },
  description: {
    fontSize: 18,
    color: colors.textSecondary,
    textAlign: 'center',
    fontWeight: '500',
    lineHeight: 24,
  },
  contentSection: {
    flex: 1,
    paddingHorizontal: 32,
    paddingTop: 48,
    justifyContent: 'flex-start',
    backgroundColor: colors.background,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text,
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 34,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    fontWeight: '400',
  },
  bottomContainer: {
    backgroundColor: colors.background,
    paddingHorizontal: 32,
    paddingBottom: 48,
    paddingTop: 24,
  },
  indicatorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dot: {
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  buttonContainer: {
    marginTop: 32,
  },
  primaryButton: {
    backgroundColor: colors.primary,
    paddingVertical: 18,
    paddingHorizontal: 32,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  ghostButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingVertical: 18,
    paddingHorizontal: 32,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  ghostButtonText: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '600',
  },
  secondaryButton: {
    // Additional styling if needed
  },
  legalContainer: {
    alignItems: 'center',
    marginTop: 0,
  },
  legalText: {
    fontSize: 12,
    color: colors.textLight,
    textAlign: 'center',
    lineHeight: 18,
  },
  linkText: {
    color: colors.primary,
    fontWeight: '500',
  },
});
