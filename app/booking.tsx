import { Stack, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, TextInput, TouchableOpacity, Image, ActivityIndicator, useColorScheme } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';

import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

interface FormData {
    fullName: string;
    email: string;
    phone: string;
    notes: string;
}

interface InputFieldProps {
    label: string;
    required?: boolean;
    value: string;
    onChangeText: (text: string) => void;
    placeholder: string;
    keyboardType?: 'email-address' | 'phone-pad' | 'default';
    autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
    multiline?: boolean;
    numberOfLines?: number;
}

// API endpoint for booking
const API_BOOKING_URL = 'https://odoosahab-al-zain-realestate-stage-18771559.dev.odoo.com/api/book_property';
// No API key needed as the endpoint is public

export default function BookingScreen() {
  const params = useLocalSearchParams<{
    propertyId: string;
    projectId: string;
    propertyName: string;
    price: string;
  }>();
  const insets = useSafeAreaInsets();
  const [isLoading, setIsLoading] = useState(false);

  // Add check for undefined params
  if (!params.propertyId || !params.projectId || !params.propertyName || !params.price) {
    return (
      <ThemedView style={styles.centered}>
        <ThemedText>Invalid property details</ThemedText>
      </ThemedView>
    );
  }

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    notes: '',
  });

  const handleSubmit = async () => {
    // Validate form
    if (!formData.fullName || !formData.email || !formData.phone) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Please fill in all required fields',
        visibilityTime: 3000,
        topOffset: 50
      });
      return;
    }

    setIsLoading(true);

    try {
      // Prepare data in JSON-RPC 2.0 format
      const jsonRpcRequest = {
        jsonrpc: "2.0",
        method: "call",
        params: {
          name: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          property_id: parseInt(params.propertyId),
          notes: formData.notes
        },
        id: new Date().getTime()
      };
      
      console.log('Sending booking request:', JSON.stringify(jsonRpcRequest));

      // Make API call with proper headers but no auth
      const response = await fetch(API_BOOKING_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(jsonRpcRequest)
      });
      
      console.log('Response status:', response.status);
      
      // Get response text first for debugging
      const responseText = await response.text();
      console.log('Response body:', responseText);
      
      // Try to parse as JSON if possible
      let data;
      try {
        data = JSON.parse(responseText);
      } catch (e) {
        console.error('Failed to parse response as JSON:', e);
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: 'Received invalid response from server',
          visibilityTime: 4000,
          topOffset: 50
        });
        setIsLoading(false);
        return;
      }

      // Check for success in the result object (JSON-RPC format)
      if (data.result && data.result.success) {
        Toast.show({
          type: 'success',
          text1: 'Booking Request Sent',
          text2: 'We will contact you soon to complete your booking.',
          visibilityTime: 3000,
          topOffset: 50
        });
        
        // Reset form after successful submission
        setFormData({
          fullName: '',
          email: '',
          phone: '',
          notes: '',
        });
      } else {
        // Get error from the JSON-RPC result
        const errorMessage = data.result?.error || data.error?.message || 'Failed to submit booking request';
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: errorMessage,
          visibilityTime: 4000,
          topOffset: 50
        });
      }
    } catch (error) {
      console.error('Booking submission error:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to submit booking request. Please try again later.',
        visibilityTime: 4000,
        topOffset: 50
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <Stack.Screen 
        options={{
          headerShown: true,
          title: 'Property Booking',
          headerBackTitle: 'Back',
          headerTransparent: false,
        }}
      />
      
      <ParallaxScrollView
        headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
        headerImage={
          <Image 
            source={require('@/assets/images/icon.png')}
            style={styles.headerImage}
            resizeMode="contain"
          />
        }
      >
        <ThemedView style={[styles.contentContainer, { paddingTop: insets.top > 0 ? 0 : 10 }]}>
          <ThemedView style={styles.card}>
            <ThemedText type="title" style={styles.propertyName}>
              {params.propertyName}
            </ThemedText>
            <ThemedText type="defaultSemiBold" style={styles.price}>
              ${Number(params.price).toLocaleString()}
            </ThemedText>
          </ThemedView>

          <ThemedView style={styles.card}>
            <ThemedText type="subtitle" style={styles.formTitle}>
              Book Your Property
            </ThemedText>

            <ThemedView style={styles.form}>
              <InputField
                label="Full Name"
                required
                value={formData.fullName}
                onChangeText={(text: string) => setFormData((prev: FormData) => ({ ...prev, fullName: text }))}
                placeholder="Enter your full name"
              />

              <InputField
                label="Email"
                required
                value={formData.email}
                onChangeText={(text: string) => setFormData((prev: FormData) => ({ ...prev, email: text }))}
                placeholder="Enter your email"
                keyboardType="email-address"
                autoCapitalize="none"
              />

              <InputField
                label="Phone Number"
                required
                value={formData.phone}
                onChangeText={(text: string) => setFormData((prev: FormData) => ({ ...prev, phone: text }))}
                placeholder="Enter your phone number"
                keyboardType="phone-pad"
              />

              <InputField
                label="Additional Notes"
                value={formData.notes}
                onChangeText={(text: string) => setFormData((prev: FormData) => ({ ...prev, notes: text }))}
                placeholder="Any special requests or notes"
                multiline
                numberOfLines={4}
              />
            </ThemedView>

            <TouchableOpacity
              style={styles.submitButton}
              onPress={handleSubmit}
              activeOpacity={0.7}
              disabled={isLoading}
            >
              <ThemedView style={[styles.submitButtonInner, isLoading && styles.submitButtonDisabled]}>
                {isLoading ? (
                  <ActivityIndicator color="#fff" size="small" />
                ) : (
                  <ThemedText style={styles.submitButtonText}>
                    Submit Booking Request
                  </ThemedText>
                )}
              </ThemedView>
            </TouchableOpacity>
          </ThemedView>
        </ThemedView>
      </ParallaxScrollView>
      
      {/* Add Toast Message component at the root level */}
      <Toast />
    </ThemedView>
  );
}

function InputField({ label, required, ...props }: any) {
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';
  const [isFocused, setIsFocused] = useState(false);
  
  return (
    <ThemedView style={styles.inputGroup}>
      <ThemedText style={styles.label}>
        {label} {required && <ThemedText style={styles.required}>*</ThemedText>}
      </ThemedText>
      <TextInput
        style={[
          styles.input, 
          props.multiline && styles.textArea,
          { 
            color: isDarkMode ? '#FFFFFF' : '#000000',
            borderColor: isFocused ? '#0a7ea4' : 'rgba(161, 206, 220, 0.4)'
          }
        ]}
        placeholderTextColor={isDarkMode ? 'rgba(255, 255, 255, 0.6)' : 'rgba(0, 0, 0, 0.5)'}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        {...props}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerImage: {
    width: '100%',
    height: '100%',
  },
  emptyHeader: {
    height: 200,
    backgroundColor: 'transparent',
  },
  contentContainer: {
    gap: 28,
  },
  card: {
    borderWidth: 1,
    borderColor: 'rgba(161, 206, 220, 0.15)',
    borderRadius: 16,
    padding: 20,
    gap: 20,
  },
  propertyName: {
    fontSize: 32,
    textAlign: 'center',
    letterSpacing: -0.5,
  },
  price: {
    fontSize: 24,
    color: '#0a7ea4',
    textAlign: 'center',
  },
  formTitle: {
    fontSize: 22,
    letterSpacing: -0.5,
    marginBottom: 12,
  },
  form: {
    gap: 24,
  },
  inputGroup: {
    gap: 8,
  },
  label: {
    fontSize: 15,
    fontWeight: '500',
    marginLeft: 4,
    letterSpacing: 0.3,
  },
  required: {
    color: '#e74c3c',
  },
  input: {
    borderWidth: 1.5,
    borderColor: 'rgba(161, 206, 220, 0.4)',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    fontWeight: '500',
  },
  textArea: {
    minHeight: 120,
    textAlignVertical: 'top',
  },
  submitButton: {
    marginTop: 12,
  },
  submitButtonInner: {
    backgroundColor: '#0a7ea4',
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  submitButtonDisabled: {
    backgroundColor: 'rgba(10, 126, 164, 0.7)',
  },
});
