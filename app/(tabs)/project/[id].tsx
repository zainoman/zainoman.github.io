import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Image } from 'react-native';

import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { fetchProjectDetails } from '@/services/api';
import type { ProjectDetails } from '@/types/api';

export default function ProjectDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [project, setProject] = useState<ProjectDetails>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>();

  useEffect(() => {
    loadProject();
  }, [id]);

  async function loadProject() {
    try {
      setLoading(true);
      const data = await fetchProjectDetails(Number(id));
      setProject(data);
    } catch (err) {
      setError('Failed to load project details');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <ThemedView style={styles.centered}>
        <ActivityIndicator size="large" />
      </ThemedView>
    );
  }

  if (error || !project) {
    return (
      <ThemedView style={styles.centered}>
        <ThemedText>{error || 'Project not found'}</ThemedText>
      </ThemedView>
    );
  }

  return (
    console.log('ProjectDetailsScreen:', project),
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
      headerImage={
        project.image ? (
          <ThemedView style={styles.imageContainer}>
            <Image 
              source={{ uri: `https://odoosahab-al-zain-realestate-stage-18771559.dev.odoo.com${(project.image)}` }}
              style={styles.image}
              resizeMode="cover"
            />
          </ThemedView>
        ) : (
          <ThemedView style={styles.imageContainer} />
        )
      }>
      <ThemedText type="title">{project.project_name}</ThemedText>
      <ThemedText>{project.description}</ThemedText>
      
      <ThemedView style={styles.infoContainer}>
        <ThemedText type="subtitle">Details</ThemedText>
        <ThemedText>Address: {project.address}</ThemedText>
        {project.start_date && (
          <ThemedText>Start Date: {new Date(project.start_date).toLocaleDateString()}</ThemedText>
        )}
        {project.delivery_date && (
          <ThemedText>Delivery Date: {new Date(project.delivery_date).toLocaleDateString()}</ThemedText>
        )}
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageContainer: {
    flex: 1,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  infoContainer: {
    marginTop: 20,
    gap: 8,
  },
});
