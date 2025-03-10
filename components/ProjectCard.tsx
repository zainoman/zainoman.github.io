import { Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Link } from 'expo-router';

import { ThemedText } from './ThemedText';
import { ThemedView } from './ThemedView';
import type { Project } from '@/types/api';

interface Props {
  project: Project;
}

export function ProjectCard({ project }: Props) {
  return (
    <Link href={{ pathname: '/(tabs)/project/[id]', params: { id: project.id } }} asChild>
      <TouchableOpacity activeOpacity={0.7}>
        <ThemedView style={styles.card}>
          {project.image && (
            <Image
              source={{ uri: `data:image/jpeg;base64,${project.image}` }}
              style={styles.image}
              resizeMode="cover"
            />
          )}
          <ThemedView style={styles.content}>
            <ThemedText type="subtitle">{project.project_name}</ThemedText>
            <ThemedText numberOfLines={2}>{project.description}</ThemedText>
          </ThemedView>
        </ThemedView>
      </TouchableOpacity>
    </Link>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 16,
  },
  image: {
    width: '100%',
    height: 200,
  },
  content: {
    padding: 16,
    gap: 8,
  }
});
