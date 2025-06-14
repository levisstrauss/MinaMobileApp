import React, { useState, useRef } from 'react';
import { StatusBar, StyleSheet, View, Animated, Dimensions } from 'react-native';
import { OnboardingScreen } from './screens/onboarding/OnboardingScreen';
import { EmailUsernameScreen } from './screens/auth/EmailUsernameScreen';
import { PasswordScreen } from './screens/auth/PasswordScreen';
import { VerificationScreen } from './screens/auth/VerificationScreen';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

type AppScreen = 'onboarding' | 'emailUsername' | 'password' | 'verification' | 'signup' | 'main';

interface AuthData {
  inputValue: string;
  isEmail: boolean;
}

function App() {
  const [currentScreen, setCurrentScreen] = useState<AppScreen>('onboarding');
  const [authData, setAuthData] = useState<AuthData>({ inputValue: '', isEmail: false });
  const slideAnim = useRef(new Animated.Value(0)).current;

  const navigateToScreen = (screen: AppScreen, direction: 'forward' | 'back' = 'forward') => {
    const toValue = direction === 'forward' ? -SCREEN_WIDTH : SCREEN_WIDTH;

    Animated.timing(slideAnim, {
      toValue,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setCurrentScreen(screen);
      slideAnim.setValue(direction === 'forward' ? SCREEN_WIDTH : -SCREEN_WIDTH);

      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    });
  };

  const handleEmailUsernameNext = (inputValue: string, isEmail: boolean) => {
    setAuthData({ inputValue, isEmail });

    if (isEmail) {
      console.log('Sending verification code to:', inputValue);
      navigateToScreen('verification', 'forward');
    } else {
      navigateToScreen('password', 'forward');
    }
  };

  const handleLoginSuccess = () => {
    console.log('Login successful!');
    navigateToScreen('main', 'forward');
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'onboarding':
        return (
          <OnboardingScreen
            onGetStarted={() => navigateToScreen('signup', 'forward')}
            onLogin={() => navigateToScreen('emailUsername', 'forward')}
          />
        );

      case 'emailUsername':
        return (
          <EmailUsernameScreen
            onBack={() => navigateToScreen('onboarding', 'back')}
            onNext={handleEmailUsernameNext}
            onSignUp={() => navigateToScreen('signup', 'forward')}
          />
        );

      case 'password':
        return (
          <PasswordScreen
            username={authData.inputValue}
            onBack={() => navigateToScreen('emailUsername', 'back')}
            onLogin={handleLoginSuccess}
          />
        );

      case 'verification':
        return (
          <VerificationScreen
            email={authData.inputValue}
            onBack={() => navigateToScreen('emailUsername', 'back')}
            onVerified={handleLoginSuccess}
          />
        );

      case 'signup':
        return (
          <OnboardingScreen
            onGetStarted={() => navigateToScreen('main', 'forward')}
            onLogin={() => navigateToScreen('emailUsername', 'forward')}
          />
        );

      case 'main':
        return (
          <OnboardingScreen
            onGetStarted={() => navigateToScreen('main', 'forward')}
            onLogin={() => navigateToScreen('emailUsername', 'forward')}
          />
        );

      default:
        return (
          <OnboardingScreen
            onGetStarted={() => navigateToScreen('signup', 'forward')}
            onLogin={() => navigateToScreen('emailUsername', 'forward')}
          />
        );
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      <Animated.View
        style={[
          styles.screenContainer,
          {
            transform: [{ translateX: slideAnim }],
          }
        ]}
      >
        {renderScreen()}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000', // Prevent white flash
  },
  screenContainer: {
    flex: 1,
  },
});

export default App;
