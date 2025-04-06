import { Image, StyleSheet, TouchableOpacity, Platform, Dimensions } from 'react-native';
import { Link } from 'expo-router';

import { ThemedText } from './ThemedText';
import { ThemedView } from './ThemedView';
import type { Project } from '@/types/api';

const BASE_URL = 'https://odoosahab-al-zain-realestate-stage-18771559.dev.odoo.com';

interface Props {
  project: Project;
}

export function ProjectCard({ project }: Props) {
  return (
    <Link href={{ pathname: '/(tabs)/project/[id]', params: { id: project.id } }} asChild>
      <TouchableOpacity activeOpacity={0.7} style={styles.touchable}>
        <ThemedView style={styles.card}>
          {project.image && (
            <Image
              source={{ uri: `${BASE_URL}${project.image}` }}
              style={styles.image}
              resizeMode="cover"
            />
          )}
          <ThemedView style={styles.content}>
            <ThemedText type="subtitle">{project.project_name}</ThemedText>
          </ThemedView>
        </ThemedView>
      </TouchableOpacity>
    </Link>
  );
}

const styles = StyleSheet.create({
  touchable: {
    outline: 'none', // Removes the focus outline on web
  },
  card: {
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
    backgroundColor: '#0c61aa', 
  },
  image: {
    width: '100%',
    height: 200,
  },
  content: {
    padding: 16,
    gap: 8,
    backgroundColor: '#0c61aa'
  },
  // For responsive text in the project card if needed
  responsiveText: {
    fontSize: Platform.OS === 'web' && Dimensions.get('window').width < 768 ? 14 : 16,
  }
});
