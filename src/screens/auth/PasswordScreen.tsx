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
interface PasswordScreenProps {
  username: string;
  onBack: () => void;
  onLogin: () => void;
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

// Waze-style Logo Component
const WazeStyleLogo: React.FC = () => {
  return (
    <View style={styles.logoContainer}>
      <View style={styles.logoCircle}>
        <Text style={styles.logoEmoji}>🗺️</Text>
        <View style={styles.logoAccessory}>
          <Text style={styles.accessoryText}>😎</Text>
        </View>
      </View>
    </View>
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

// Button Component
interface ButtonProps {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  style?: any;
}

const Button: React.FC<ButtonProps> = ({
                                         title,
                                         onPress,
                                         disabled = false,
                                         style
                                       }) => {
  return (
    <TouchableOpacity
      style={[styles.loginButton, disabled && styles.disabledButton, style]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.8}
    >
      <Text style={[styles.loginButtonText, disabled && styles.disabledButtonText]}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};

// Main Password Screen
export const PasswordScreen: React.FC<PasswordScreenProps> = ({
                                                                username,
                                                                onBack,
                                                                onLogin
                                                              }) => {
  const [password, setPassword] = useState('');

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

  const handleLogin = () => {
    if (password.trim()) {
      console.log('Login attempted', { username, password });
      onLogin();
    }
  };

  const handleForgotPassword = () => {
    console.log('Forgot password pressed');
  };

  const isPasswordValid = password.trim().length > 0;

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

          {/* Logo and Title */}
          <Animated.View
            style={[
              styles.welcomeSection,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideUpAnim }],
              }
            ]}
          >
            <WazeStyleLogo />
            <Text style={styles.title}>What's your password?</Text>
          </Animated.View>

          {/* Password Input */}
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
              <Text style={styles.inputIcon}>🔒</Text>
              <TextInput
                style={styles.input}
                placeholder="Password"
                placeholderTextColor={colors.textLight}
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                selectionColor={colors.primary}
                autoFocus
              />
            </View>
          </Animated.View>

          {/* Footer */}
          <Animated.View
            style={[
              styles.footerSection,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideUpAnim }],
              }
            ]}
          >
            <Button
              title="Log in"
              onPress={handleLogin}
              disabled={!isPasswordValid}
            />

            <TouchableOpacity onPress={handleForgotPassword} activeOpacity={0.7}>
              <Text style={styles.forgotPasswordText}>Forgot your password?</Text>
            </TouchableOpacity>
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
    marginBottom: 40,
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
    marginBottom: 60,
  },
  logoContainer: {
    marginBottom: 32,
    position: 'relative',
  },
  logoCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#4A90E2',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  logoEmoji: {
    fontSize: 50,
  },
  logoAccessory: {
    position: 'absolute',
    bottom: 5,
    right: 10,
    width: 35,
    height: 35,
    borderRadius: 17.5,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#4A90E2',
  },
  accessoryText: {
    fontSize: 18,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: colors.text,
    textAlign: 'center',
  },
  formSection: {
    marginBottom: 40,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.inputBackground,
    borderWidth: 1,
    borderColor: colors.inputBorder,
    borderRadius: 12,
    paddingHorizontal: 20,
    paddingVertical: 18,
  },
  inputIcon: {
    fontSize: 20,
    marginRight: 12,
    color: colors.textLight,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: colors.text,
    fontWeight: '400',
  },
  footerSection: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingBottom: 32,
  },
  loginButton: {
    backgroundColor: colors.primary,
    borderRadius: 50,
    paddingVertical: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  disabledButton: {
    backgroundColor: colors.inputBorder,
    shadowOpacity: 0,
    elevation: 0,
  },
  disabledButtonText: {
    color: colors.textLight,
  },
  forgotPasswordText: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
  },
});
