import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  StyleSheet,
  StatusBar,
  SafeAreaView,
  Text,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Animated,
} from 'react-native';

// Navigation Props Interface
interface EmailUsernameScreenProps {
  onBack: () => void;
  onNext: (inputValue: string, isEmail: boolean) => void;
  onSignUp: () => void;
}

// Theme colors
const colors = {
  primary: '#00C7BE',
  background: '#000000',
  text: '#FFFFFF',
  textSecondary: '#CCCCCC',
  textLight: '#999999',
  inputBackground: '#1A1A1A',
  inputBorder: '#333333',
};

// MINA Logo Component
const MinaLogo: React.FC = () => {
  return (
    <View style={styles.logoContainer}>
      <View style={styles.logoCircle}>
        <Text style={styles.logoText}>🗺️</Text>
      </View>
    </View>
  );
};

// Button Component
interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'google';
  disabled?: boolean;
  style?: any;
}

const Button: React.FC<ButtonProps> = ({
                                         title,
                                         onPress,
                                         variant = 'primary',
                                         disabled = false,
                                         style
                                       }) => {
  const getButtonStyle = () => {
    const baseStyle = [styles.button];

    switch (variant) {
      case 'primary':
        return [...baseStyle, styles.primaryButton, style];
      case 'google':
        return [...baseStyle, styles.googleButton, style];
      default:
        return [...baseStyle, style];
    }
  };

  const getTextStyle = () => {
    switch (variant) {
      case 'primary':
        return styles.primaryButtonText;
      case 'google':
        return styles.googleButtonText;
      default:
        return styles.primaryButtonText;
    }
  };

  return (
    <TouchableOpacity
      style={getButtonStyle()}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.8}
    >
      {variant === 'google' && (
        <Text style={styles.googleIcon}>G</Text>
      )}
      <Text style={getTextStyle()}>{title}</Text>
    </TouchableOpacity>
  );
};

// Back Button Component
const BackButton: React.FC<{ onPress: () => void }> = ({ onPress }) => {
  return (
    <TouchableOpacity style={styles.backButton} onPress={onPress} activeOpacity={0.7}>
      <Text style={styles.backButtonText}>←</Text>
    </TouchableOpacity>
  );
};

// Utility function to check if input is email
const isEmailFormat = (input: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(input);
};

// Main Email/Username Input Screen
export const EmailUsernameScreen: React.FC<EmailUsernameScreenProps> = ({
                                                                          onBack,
                                                                          onNext,
                                                                          onSignUp
                                                                        }) => {
  const [inputValue, setInputValue] = useState('');

  // Simple animation for screen entrance
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideUpAnim = useRef(new Animated.Value(30)).current;

  // Screen enter animation
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.timing(slideUpAnim, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleNext = () => {
    if (inputValue.trim()) {
      const isEmail = isEmailFormat(inputValue.trim());
      onNext(inputValue.trim(), isEmail);
    }
  };

  const handleGoogleLogin = () => {
    console.log('Google login pressed');
  };

  const isInputValid = inputValue.trim().length > 0;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header */}
          <Animated.View
            style={[
              styles.header,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideUpAnim }],
              }
            ]}
          >
            <BackButton onPress={onBack} />
          </Animated.View>

          {/* Logo and Welcome */}
          <Animated.View
            style={[
              styles.welcomeSection,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideUpAnim }],
              }
            ]}
          >
            <MinaLogo />
            <Text style={styles.welcomeTitle}>Welcome back, Navigator!</Text>
            <Text style={styles.welcomeSubtitle}>
              Continue your intelligent journey with MINA
            </Text>
          </Animated.View>

          {/* Input Form */}
          <Animated.View
            style={[
              styles.formSection,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideUpAnim }],
              }
            ]}
          >
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Email or username"
                placeholderTextColor={colors.textLight}
                value={inputValue}
                onChangeText={setInputValue}
                keyboardType="email-address"
                autoCapitalize="none"
                selectionColor={colors.primary}
                autoFocus
              />
            </View>

            <Button
              title="Next"
              onPress={handleNext}
              variant="primary"
              disabled={!isInputValid}
              style={[styles.nextButton, !isInputValid && styles.disabledButton]}
            />

            {/* Divider */}
            <View style={styles.dividerContainer}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>OR</Text>
              <View style={styles.dividerLine} />
            </View>

            {/* Google Login */}
            <Button
              title="Log in with Google"
              onPress={handleGoogleLogin}
              variant="google"
            />
          </Animated.View>

          {/* Footer Links */}
          <Animated.View
            style={[
              styles.footerSection,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideUpAnim }],
              }
            ]}
          >
            <View style={styles.signupContainer}>
              <Text style={styles.signupText}>Don't have an account? </Text>
              <TouchableOpacity onPress={onSignUp} activeOpacity={0.7}>
                <Text style={styles.signupLinkText}>Sign up</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 32,
  },
  header: {
    paddingTop: 20,
    marginBottom: 20,
  },
  backButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButtonText: {
    fontSize: 24,
    color: colors.text,
    fontWeight: '300',
  },
  welcomeSection: {
    alignItems: 'center',
    marginBottom: 48,
  },
  logoContainer: {
    marginBottom: 24,
  },
  logoCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(0, 199, 190, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.primary,
  },
  logoText: {
    fontSize: 40,
  },
  welcomeTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text,
    textAlign: 'center',
    marginBottom: 8,
  },
  welcomeSubtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  formSection: {
    marginBottom: 32,
  },
  inputContainer: {
    marginBottom: 24,
  },
  input: {
    backgroundColor: colors.inputBackground,
    borderWidth: 1,
    borderColor: colors.inputBorder,
    borderRadius: 12,
    paddingHorizontal: 20,
    paddingVertical: 18,
    fontSize: 16,
    color: colors.text,
    fontWeight: '400',
  },
  button: {
    borderRadius: 50,
    paddingVertical: 18,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  primaryButton: {
    backgroundColor: colors.primary,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  googleButton: {
    backgroundColor: colors.inputBackground,
    borderWidth: 1,
    borderColor: colors.inputBorder,
  },
  googleButtonText: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: '600',
  },
  googleIcon: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.primary,
    marginRight: 12,
    width: 20,
    textAlign: 'center',
  },
  nextButton: {
    marginBottom: 24,
  },
  disabledButton: {
    backgroundColor: colors.inputBorder,
    shadowOpacity: 0,
    elevation: 0,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.inputBorder,
  },
  dividerText: {
    color: colors.textLight,
    fontSize: 14,
    fontWeight: '500',
    marginHorizontal: 16,
  },
  footerSection: {
    alignItems: 'center',
    paddingBottom: 32,
  },
  signupContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  signupText: {
    color: colors.textSecondary,
    fontSize: 16,
  },
  signupLinkText: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: '600',
  },
});
