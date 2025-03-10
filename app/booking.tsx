import { Stack, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, TextInput, TouchableOpacity, Alert, Image } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

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

export default function BookingScreen() {
  const params = useLocalSearchParams<{
    propertyId: string;
    projectId: string;
    propertyName: string;
    price: string;
  }>();
  const insets = useSafeAreaInsets();

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
    if (!formData.fullName || !formData.email || !formData.phone) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    try {
      Alert.alert(
        'Booking Request Sent',
        'We will contact you soon to complete your booking.',
        [{ text: 'OK' }]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to submit booking request');
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
            >
              <ThemedView style={styles.submitButtonInner}>
                <ThemedText style={styles.submitButtonText}>
                  Submit Booking Request
                </ThemedText>
              </ThemedView>
            </TouchableOpacity>
          </ThemedView>
        </ThemedView>
      </ParallaxScrollView>
    </ThemedView>
  );
}

function InputField({ label, required, ...props }: any) {
  return (
    <ThemedView style={styles.inputGroup}>
      <ThemedText style={styles.label}>
        {label} {required && <ThemedText style={styles.required}>*</ThemedText>}
      </ThemedText>
      <TextInput
        style={[styles.input, props.multiline && styles.textArea]}
        placeholderTextColor="rgba(128, 128, 128, 0.7)"
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
    color: '#2c3e50', // Adding text color for better contrast
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
});
