import * as Google from 'expo-auth-session/providers/google';
import * as AppleAuthentication from 'expo-apple-authentication';
import { Platform, Alert } from 'react-native';
import { useState } from 'react';
import { TouchableOpacity, Text } from 'react-native';
import { styles } from './styles';
import React from 'react';

export default function SignUpScreen({ navigation }) {
  const [request, response, promptAsync] = Google.useAuthRequest({
    expoClientId: '<YOUR_EXPO_CLIENT_ID>',
    iosClientId: '<YOUR_IOS_CLIENT_ID>',
    androidClientId: '<YOUR_ANDROID_CLIENT_ID>',
    webClientId: '<YOUR_WEB_CLIENT_ID>',
  });
  const [loading, setLoading] = useState(false);

  React.useEffect(() => {
    if (response?.type === 'success') {
      // Simulate signup
      Alert.alert('Google Sign Up Success', 'You are now signed up!');
      // TODO: Update global user session state
    }
  }, [response]);

  const handleAppleSignUp = async () => {
    try {
      setLoading(true);
      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      });
      Alert.alert('Apple Sign Up Success', 'You are now signed up!');
      // TODO: Update global user session state
    } catch (e) {
      if (e.code !== 'ERR_CANCELED') {
        Alert.alert('Apple Sign Up Error', e.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign Up</Text>
      {/* Existing sign up form goes here */}
      <TouchableOpacity style={styles.socialButton} onPress={() => promptAsync()}>
        <Text style={styles.socialButtonText}>Sign up with Google</Text>
      </TouchableOpacity>
      {Platform.OS === 'ios' && (
        <AppleAuthentication.AppleAuthenticationButton
          buttonType={AppleAuthentication.AppleAuthenticationButtonType.SIGN_UP}
          buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.BLACK}
          cornerRadius={8}
          style={{ width: '100%', height: 44, marginTop: 12 }}
          onPress={handleAppleSignUp}
          disabled={loading}
        />
      )}
      {/* Add Google and Apple sign up buttons below the existing sign up form */}
    </View>
  );
} 