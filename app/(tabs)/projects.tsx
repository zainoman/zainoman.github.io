import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet } from 'react-native';

import { ProjectCard } from '@/components/ProjectCard';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { fetchProjects } from '@/services/api';
import type { Project } from '@/types/api';

export default function ProjectsScreen() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>();
  const [refreshing, setRefreshing] = useState(false);

  async function loadProjects() {
    try {
      setLoading(true);
      setError(undefined);
      
      console.log('Loading projects...'); // Debug log
      const data = await fetchProjects();
      console.log('Received data:', data); // Debug log
      
      if (!data || data.length === 0) {
        setProjects([]);
        setError('No projects available');
        return;
      }

      setProjects(Array.isArray(data) ? data : []);
    } catch (err) {
      setError('Unable to connect to server. Please try again later.');
      console.error('Projects screen error:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    loadProjects();
  }, []);

  useEffect(() => {
    loadProjects();
  }, []);

  if (loading) {
    return (
      <ThemedView style={styles.centered}>
        <ActivityIndicator size="large" />
      </ThemedView>
    );
  }

  if (error) {
    return (
      <ThemedView style={styles.centered}>
        <ThemedText>{error}</ThemedText>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <FlatList
        data={projects}
        renderItem={({ item }) => <ProjectCard project={item} />}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={styles.list}
        refreshing={refreshing}
        onRefresh={onRefresh}
        ListEmptyComponent={
          !loading && !error ? (
            <ThemedView style={styles.empty}>
              <ThemedText>No projects found</ThemedText>
            </ThemedView>
          ) : null
        }
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  list: {
    padding: 16,
  },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
});
