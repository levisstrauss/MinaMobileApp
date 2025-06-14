import React, { useState, useRef, useEffect } from 'react';
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
  Linking,
  Animated,
} from 'react-native';

// Navigation Props Interface
interface VerificationScreenProps {
  email: string;
  onBack: () => void;
  onVerified: () => void;
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
  progressBlue: '#007AFF',
};

// Email Verification Logo Component
const VerificationLogo: React.FC = () => {
  return (
    <View style={styles.logoContainer}>
      <View style={styles.logoCircle}>
        <Text style={styles.envelopeEmoji}>✉️</Text>
        <Text style={styles.carEmoji}>🚗</Text>
        <View style={styles.lockBadge}>
          <Text style={styles.lockEmoji}>🔒</Text>
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

// Code Input Component
interface CodeInputProps {
  value: string;
  onChangeText: (text: string) => void;
}

const CodeInput: React.FC<CodeInputProps> = ({ value, onChangeText }) => {
  const inputRefs = useRef<TextInput[]>([]);
  const [focusedIndex, setFocusedIndex] = useState(0);

  const handleChangeText = (text: string, index: number) => {
    const newValue = value.split('');
    newValue[index] = text;

    // Fill the array to ensure it has 5 elements
    while (newValue.length < 5) {
      newValue.push('');
    }

    onChangeText(newValue.join(''));

    // Auto focus next input
    if (text && index < 4) {
      inputRefs.current[index + 1]?.focus();
      setFocusedIndex(index + 1);
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && !value[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
      setFocusedIndex(index - 1);
    }
  };

  return (
    <View style={styles.codeInputContainer}>
      {[0, 1, 2, 3, 4].map((index) => (
        <TextInput
          key={index}
          ref={(ref) => {
            if (ref) inputRefs.current[index] = ref;
          }}
          style={[
            styles.codeInput,
            focusedIndex === index && styles.focusedCodeInput,
            value[index] && styles.filledCodeInput,
          ]}
          value={value[index] || ''}
          onChangeText={(text) => handleChangeText(text, index)}
          onFocus={() => setFocusedIndex(index)}
          onKeyPress={(e) => handleKeyPress(e, index)}
          keyboardType="number-pad"
          maxLength={1}
          selectionColor={colors.primary}
        />
      ))}
    </View>
  );
};

// Progress Bar Component
const ProgressBar: React.FC<{ progress: number }> = ({ progress }) => {
  return (
    <View style={styles.progressContainer}>
      <View style={styles.progressBackground}>
        <View style={[styles.progressFill, { width: `${progress * 20}%` }]} />
        {[0, 1, 2, 3, 4].map((index) => (
          <View
            key={index}
            style={[
              styles.progressSegment,
              { left: `${index * 20}%` },
              progress > index && styles.activeProgressSegment,
            ]}
          />
        ))}
      </View>
    </View>
  );
};

// Button Component
interface ButtonProps {
  title: string;
  onPress: () => void;
  style?: any;
}

const Button: React.FC<ButtonProps> = ({ title, onPress, style }) => {
  return (
    <TouchableOpacity style={[styles.button, style]} onPress={onPress} activeOpacity={0.8}>
      <Text style={styles.buttonText}>{title}</Text>
    </TouchableOpacity>
  );
};

// Keypad Component
interface KeypadProps {
  onNumberPress: (number: string) => void;
  onBackspace: () => void;
}

const Keypad: React.FC<KeypadProps> = ({ onNumberPress, onBackspace }) => {
  const keypadNumbers = [
    ['1', '2', '3'],
    ['4', '5', '6'],
    ['7', '8', '9'],
    ['0', 'backspace'],
  ];

  return (
    <View style={styles.keypadContainer}>
      {keypadNumbers.map((row, rowIndex) => (
        <View key={rowIndex} style={[styles.keypadRow, rowIndex === 3 && styles.lastRow]}>
          {rowIndex === 3 ? (
            // Last row with 0 and backspace
            <>
              <View style={styles.emptySpace} />
              <TouchableOpacity
                style={styles.keypadKey}
                onPress={() => onNumberPress('0')}
                activeOpacity={0.7}
              >
                <Text style={styles.keypadText}>0</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.keypadKey}
                onPress={onBackspace}
                activeOpacity={0.7}
              >
                <Text style={styles.backspaceText}>⌫</Text>
              </TouchableOpacity>
            </>
          ) : (
            // Regular rows with 3 numbers
            row.map((key, keyIndex) => (
              <TouchableOpacity
                key={keyIndex}
                style={styles.keypadKey}
                onPress={() => onNumberPress(key)}
                activeOpacity={0.7}
              >
                <Text style={styles.keypadText}>{key}</Text>
                <Text style={styles.keypadSubText}>
                  {key === '2' && 'ABC'}
                  {key === '3' && 'DEF'}
                  {key === '4' && 'GHI'}
                  {key === '5' && 'JKL'}
                  {key === '6' && 'MNO'}
                  {key === '7' && 'PQRS'}
                  {key === '8' && 'TUV'}
                  {key === '9' && 'WXYZ'}
                </Text>
              </TouchableOpacity>
            ))
          )}
        </View>
      ))}
    </View>
  );
};

// Main Verification Screen
export const VerificationScreen: React.FC<VerificationScreenProps> = ({
                                                                        email,
                                                                        onBack,
                                                                        onVerified
                                                                      }) => {
  const [code, setCode] = useState('');

  const handleNumberPress = (number: string) => {
    if (code.length < 5) {
      setCode(prev => prev + number);
    }
  };

  const handleBackspace = () => {
    setCode(prev => prev.slice(0, -1));
  };

  const handleOpenInbox = () => {
    // Try to open default email app
    Linking.openURL('mailto:').catch(() => {
      console.log('Cannot open email app');
    });
  };

  const handleHelpCenter = () => {
    console.log('Help Center pressed');
    // TODO: Navigate to help center
  };

  // Auto-verify when code is complete (for demo)
  useEffect(() => {
    if (code.length === 5) {
      // Simulate verification delay
      setTimeout(() => {
        onVerified();
      }, 500);
    }
  }, [code, onVerified]);

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
          <View style={styles.header}>
            <BackButton onPress={onBack} />
          </View>

          {/* Logo and Title */}
          <View style={styles.contentSection}>
            <VerificationLogo />
            <Text style={styles.title}>Almost done!</Text>
            <Text style={styles.subtitle}>
              Check your inbox for the verification email sent to{'\n'}
              <Text style={styles.emailText}>{email}</Text>
            </Text>

            {/* Progress and Code Input */}
            <View style={styles.verificationSection}>
              <ProgressBar progress={code.length} />
              <CodeInput value={code} onChangeText={setCode} />
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionSection}>
            <Button
              title="Open inbox"
              onPress={handleOpenInbox}
              style={styles.openInboxButton}
            />

            <TouchableOpacity onPress={handleHelpCenter} activeOpacity={0.7}>
              <Text style={styles.helpCenterText}>Help Center</Text>
            </TouchableOpacity>
          </View>

          {/* Keypad */}
          <Keypad onNumberPress={handleNumberPress} onBackspace={handleBackspace} />
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
  contentSection: {
    alignItems: 'center',
    marginBottom: 16,
  },
  logoContainer: {
    marginBottom: 16,
    position: 'relative',
  },
  logoCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
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
  envelopeEmoji: {
    fontSize: 32,
    position: 'absolute',
    top: 18,
    left: 20,
  },
  carEmoji: {
    fontSize: 20,
    position: 'absolute',
    bottom: 12,
    right: 16,
  },
  lockBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#FFD700',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.background,
  },
  lockEmoji: {
    fontSize: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text,
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 20,
  },
  emailText: {
    color: colors.text,
    fontWeight: '600',
  },
  verificationSection: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 16,
  },
  progressContainer: {
    width: '80%',
    marginBottom: 16,
  },
  progressBackground: {
    height: 4,
    backgroundColor: colors.inputBorder,
    borderRadius: 2,
    position: 'relative',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.progressBlue,
    borderRadius: 2,
    position: 'absolute',
    left: 0,
    top: 0,
  },
  progressSegment: {
    position: 'absolute',
    top: -2,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.inputBorder,
  },
  activeProgressSegment: {
    backgroundColor: colors.progressBlue,
  },
  codeInputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '70%',
  },
  codeInput: {
    width: 40,
    height: 40,
    borderWidth: 1,
    borderColor: colors.inputBorder,
    borderRadius: 6,
    textAlign: 'center',
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
    backgroundColor: colors.inputBackground,
  },
  focusedCodeInput: {
    borderColor: colors.primary,
    backgroundColor: colors.inputBackground,
  },
  filledCodeInput: {
    borderColor: colors.progressBlue,
    backgroundColor: colors.inputBackground,
  },
  actionSection: {
    alignItems: 'center',
    marginBottom: 16,
  },
  button: {
    backgroundColor: colors.primary,
    borderRadius: 50,
    paddingVertical: 14,
    paddingHorizontal: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  openInboxButton: {
    width: '100%',
  },
  helpCenterText: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
  },
  keypadContainer: {
    paddingBottom: 20,
    paddingTop: 10,
  },
  keypadRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
    paddingHorizontal: 20,
  },
  lastRow: {
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  emptySpace: {
    flex: 1,
    maxWidth: 80,
    marginHorizontal: 6,
  },
  keypadKey: {
    flex: 1,
    height: 60,
    borderRadius: 8,
    backgroundColor: colors.inputBackground,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 6,
    maxWidth: 80,
  },
  keypadText: {
    fontSize: 22,
    fontWeight: '400',
    color: colors.text,
    marginBottom: 1,
  },
  keypadSubText: {
    fontSize: 8,
    color: colors.textLight,
    fontWeight: '500',
    letterSpacing: 0.5,
  },
  backspaceText: {
    fontSize: 20,
    color: colors.text,
  },
});
