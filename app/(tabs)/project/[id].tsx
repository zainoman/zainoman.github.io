import { Stack, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Link } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { fetchProjectDetails, fetchProjectProperties } from '@/services/api';
import type { ProjectDetails, ProjectProperties } from '@/types/api';

export default function ProjectDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const [project, setProject] = useState<ProjectDetails>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>();
  const [properties, setProperties] = useState<ProjectProperties>();

  useEffect(() => {
    loadProject();
    loadProperties();
  }, [id]);

  async function loadProject() {
    try {
      setLoading(true);
      const projectId = id ? Number(id) : 1;
      const data = await fetchProjectDetails(projectId);
      setProject(data);
    } catch (err) {
      setError('Failed to load project details');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function loadProperties() {
    try {
      const projectId = id ? Number(id) : 1;
      const data = await fetchProjectProperties(projectId);
      setProperties(data);
    } catch (err) {
      console.error('Failed to load properties:', err);
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
    <ThemedView style={styles.container}>
      <Stack.Screen 
        options={{
          headerShown: true,
          headerTitle: project?.project_name || 'Project Details',
          headerBackTitle: 'Back',
          headerBackVisible: true,
        }}
      />
      
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
        <ThemedView style={[styles.contentContainer, { paddingTop: insets.top > 0 ? 0 : 10 }]}>
          <ThemedText type="title" style={styles.title}>{project.project_name}</ThemedText>
          <ThemedText style={styles.description}>{project.description}</ThemedText>
          
          <ThemedView style={styles.statsContainer}>
            {project.property_count !== undefined && (
              <ThemedView style={styles.statBox}>
                <ThemedText type="defaultSemiBold" style={styles.statNumber}>{project.property_count}</ThemedText>
                <ThemedText style={styles.statLabel}>Total Units</ThemedText>
              </ThemedView>
            )}
            {project.available_unit_count !== undefined && (
              <ThemedView style={styles.statBox}>
                <ThemedText type="defaultSemiBold" style={styles.statNumber}>{project.available_unit_count}</ThemedText>
                <ThemedText style={styles.statLabel}>Available</ThemedText>
              </ThemedView>
            )}
            {project.sold_unit_count !== undefined && (
              <ThemedView style={styles.statBox}>
                <ThemedText type="defaultSemiBold" style={styles.statNumber}>{project.sold_unit_count}</ThemedText>
                <ThemedText style={styles.statLabel}>Sold</ThemedText>
              </ThemedView>
            )}
          </ThemedView>

          <ThemedView style={styles.card}>
            <ThemedText type="subtitle" style={styles.cardTitle}>Project Details</ThemedText>
            <ThemedView style={styles.detailsGrid}>
              <DetailItem label="Address" value={project.address} />
              <DetailItem label="Type" value={project.type} />
              <DetailItem label="Location" value={project.location} />
              <DetailItem label="Area" value={project.building_area} />
              <DetailItem label="Price" value={project.price?.toString()} />
              <DetailItem label="Status" value={project.state} />
              {project.start_date && (
                <DetailItem label="Start Date" value={new Date(project.start_date).toLocaleDateString()} />
              )}
              {project.delivery_date && (
                <DetailItem label="Delivery Date" value={new Date(project.delivery_date).toLocaleDateString()} />
              )}
            </ThemedView>
          </ThemedView>

          {properties && properties.properties.length > 0 && (
            <ThemedView style={styles.card}>
              <ThemedText type="subtitle" style={styles.cardTitle}>Available Properties</ThemedText>
              <ThemedView style={styles.propertiesGrid}>
                {properties.properties.map(property => (
                  <Link 
                    key={property.id} 
                    href={{
                      pathname: "/booking",
                      params: { 
                        propertyId: property.id,
                        projectId: project.id,
                        propertyName: property.name,
                        price: property.unit_price
                      }
                    }}
                    asChild
                  >
                    <TouchableOpacity activeOpacity={0.7}>
                      <ThemedView style={styles.propertyCard}>
                        <ThemedText type="defaultSemiBold" style={styles.propertyName}>{property.name}</ThemedText>
                        <ThemedText style={styles.propertyDescription} numberOfLines={2}>{property.description}</ThemedText>
                        <ThemedView style={styles.propertyFooter}>
                          <ThemedText style={styles.propertyPrice}>${property.unit_price.toLocaleString()}</ThemedText>
                          <ThemedText style={styles.propertyType}>{property.property_for}</ThemedText>
                        </ThemedView>
                      </ThemedView>
                    </TouchableOpacity>
                  </Link>
                ))}
              </ThemedView>
            </ThemedView>
          )}
        </ThemedView>
      </ParallaxScrollView>
    </ThemedView>
  );
}

function DetailItem({ label, value }: { label: string; value?: string }) {
  if (!value) return null;
  return (
    <ThemedView style={styles.detailItem}>
      <ThemedText style={styles.detailLabel}>{label}</ThemedText>
      <ThemedText style={styles.detailValue}>{value}</ThemedText>
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
  propertiesContainer: {
    marginTop: 20,
    gap: 16,
  },
  propertyItem: {
    padding: 12,
    borderRadius: 8,
    backgroundColor: 'rgba(0,0,0,0.05)',
    gap: 4,
  },
  contentContainer: {
    gap: 28,
  },
  title: {
    fontSize: 32,
    marginBottom: 12,
    letterSpacing: -0.5,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    opacity: 0.85,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 16,
    paddingVertical: 8,
  },
  statBox: {
    alignItems: 'center',
    padding: 16,
    minWidth: 100,
    borderWidth: 1,
    borderColor: 'rgba(161, 206, 220, 0.2)',
    borderRadius: 12,
  },
  statNumber: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    opacity: 0.7,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  card: {
    borderWidth: 1,
    borderColor: 'rgba(161, 206, 220, 0.15)',
    borderRadius: 16,
    padding: 20,
    gap: 20,
  },
  cardTitle: {
    fontSize: 22,
    letterSpacing: -0.5,
    marginBottom: 12,
  },
  detailsGrid: {
    gap: 16,
  },
  detailItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(161, 206, 220, 0.1)',
  },
  detailLabel: {
    fontSize: 15,
    opacity: 0.7,
  },
  detailValue: {
    fontSize: 15,
    fontWeight: '500',
  },
  propertiesGrid: {
    gap: 20,
  },
  propertyCard: {
    borderWidth: 1,
    borderColor: 'rgba(161, 206, 220, 0.15)',
    borderRadius: 12,
    padding: 16,
    gap: 12,
  },
  propertyName: {
    fontSize: 20,
    letterSpacing: -0.3,
  },
  propertyDescription: {
    fontSize: 15,
    lineHeight: 22,
    opacity: 0.8,
  },
  propertyFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(161, 206, 220, 0.1)',
  },
  propertyPrice: {
    fontSize: 18,
    fontWeight: '600',
    letterSpacing: -0.3,
  },
  propertyType: {
    fontSize: 14,
    opacity: 0.8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  }
});
