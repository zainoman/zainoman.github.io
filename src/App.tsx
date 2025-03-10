import { useState, useEffect } from 'react'
import { projectsApi } from './services/api'
import { Project, Property } from './types/api'
import { getImageUrl } from './utils/image'
import './App.css'

function App() {
  const [projects, setProjects] = useState<Project[]>([])
  const [selectedProject, setSelectedProject] = useState<number | null>(null)
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [retryCount, setRetryCount] = useState(0)

  useEffect(() => {
    loadProjects()
  }, [retryCount]) // Add retryCount to dependencies to allow manual retries

  useEffect(() => {
    if (selectedProject) {
      loadProjectProperties(selectedProject)
    }
  }, [selectedProject])

  const loadProjects = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await projectsApi.getAllProjects(searchQuery)
      setProjects(data)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load projects'
      setError(errorMessage)
      console.error('Error loading projects:', errorMessage)
      setProjects([]) // Clear projects on error
    } finally {
      setLoading(false)
    }
  }

  const loadProjectProperties = async (projectId: number) => {
    try {
      setLoading(true)
      setError(null)
      const data = await projectsApi.getProjectProperties(projectId)
      setProperties(data.properties)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load properties'
      setError(errorMessage)
      console.error('Error loading properties:', errorMessage)
      setProperties([]) // Clear properties on error
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    loadProjects()
  }

  const handleRetry = () => {
    setRetryCount(count => count + 1)
  }

  return (
    <div className="container">
      <h1>Real Estate Projects</h1>
      
      <form onSubmit={handleSearch} className="search-form">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search projects..."
          className="search-input"
        />
        <button type="submit" className="search-button">Search</button>
      </form>

      {error && (
        <div className="error">
          <p>{error}</p>
          <button onClick={handleRetry} className="retry-button">
            Retry
          </button>
        </div>
      )}
      
      {loading ? (
        <div className="loading">Loading...</div>
      ) : (
        <>
          <div className="projects">
            {projects.length > 0 ? (
              <>
                <h2>Projects</h2>
                {projects.map(project => (
                  <div
                    key={project.id}
                    className={`project-card ${selectedProject === project.id ? 'selected' : ''}`}
                    onClick={() => setSelectedProject(project.id)}
                  >
                    {project.image && (
                      <img 
                        src={getImageUrl(project.image)}
                        alt={project.project_name}
                        className="project-image"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                        }}
                      />
                    )}
                    <h3>{project.project_name}</h3>
                    <p>{project.description}</p>
                  </div>
                ))}
              </>
            ) : !error && !loading && (
              <p className="no-results">No projects found</p>
            )}
          </div>

          {selectedProject && (
            <div className="properties">
              <h2>Properties</h2>
              {properties.length > 0 ? (
                properties.map(property => (
                  <div key={property.id} className="property-card">
                    <h3>{property.name}</h3>
                    <p>{property.description}</p>
                    <p>Price: ${property.unit_price.toLocaleString()}</p>
                    <p>Type: {property.property_for}</p>
                  </div>
                ))
              ) : !error && !loading && (
                <p className="no-results">No properties found for this project</p>
              )}
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default App