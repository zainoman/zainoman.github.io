import React, { useEffect, useState, useCallback } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Image, View, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

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
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();

  // Calculate columns based on screen width
  const getColumnCount = useCallback(() => {
    if (width >= 1024) return 4;      // Desktop: 3 columns
    if (width >= 768) return 2;       // Tablet: 2 columns
    return 1;                         // Mobile: 1 column (single item per row)
  }, [width]);

  const columnCount = getColumnCount();

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

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadProjects();
  }, []);

  useEffect(() => {
    loadProjects();
  }, []);

  // Hero section component
  const HeroSection = () => (
    <ThemedView style={styles.heroContainer}>
      <Image 
        source={require('@/assets/images/zain-icon.png')} 
        style={styles.logo} 
        resizeMode="contain"
      />
      <ThemedText type="title" style={styles.heroTitle}>
        Al-Zain Real Estate
      </ThemedText>
      <ThemedText style={styles.heroSubtitle}>
        Find your perfect property investment
      </ThemedText>
    </ThemedView>
  );

  // Create responsive grid layout
  const renderGrid = () => {
    // Create chunks of projects based on column count
    const chunks = [];
    for (let i = 0; i < projects.length; i += columnCount) {
      chunks.push(projects.slice(i, i + columnCount));
    }

    return (
      <View style={styles.gridContainer}>
        {chunks.map((chunk, rowIndex) => (
          <View key={`row-${rowIndex}`} style={styles.row}>
            {chunk.map((project, index) => (
              <View
                key={project.id}
                style={[
                  styles.gridItem,
                  { width: `${100 / columnCount}%` }
                ]}
              >
                <ProjectCard project={project} />
              </View>
            ))}
            {/* Add empty placeholder cells if row is not complete */}
            {columnCount > chunk.length &&
              Array(columnCount - chunk.length)
                .fill(null)
                .map((_, i) => (
                  <View
                    key={`empty-${i}`}
                    style={[
                      styles.gridItem, 
                      { width: `${100 / columnCount}%` }
                    ]}
                  />
                ))}
          </View>
        ))}
      </View>
    );
  };

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
        ListHeaderComponent={<HeroSection />}
        ListEmptyComponent={
          !loading && !error ? (
            <ThemedView style={styles.empty}>
              <ThemedText>No projects found</ThemedText>
            </ThemedView>
          ) : null
        }
        data={[{ key: 'grid' }]} // We only need one item since we're rendering the grid manually
        renderItem={() => renderGrid()}
        contentContainerStyle={[
          styles.list, 
          { paddingTop: insets.top > 0 ? insets.top + 10 : 30 }
        ]}
        refreshing={refreshing}
        onRefresh={onRefresh}
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
  // Hero section styles
  heroContainer: {
    alignItems: 'center',
    marginBottom: 32,
    paddingVertical: 24,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(161, 206, 220, 0.2)',
    backgroundColor: 'rgba(161, 206, 220, 0.05)',
  },
  logo: {
    width: '100%',
    height: 120,
    marginBottom: 16,
  },
  heroTitle: {
    textAlign: 'center',
    marginBottom: 8,
    fontSize: 26,
    fontWeight: 'bold',
  },
  heroSubtitle: {
    textAlign: 'center',
    opacity: 0.8,
    fontSize: 16,
    marginBottom: 8,
  },
  // Grid layout styles
  gridContainer: {
    width: '100%',
  },
  row: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  gridItem: {
    paddingHorizontal: 8,
  }
});
