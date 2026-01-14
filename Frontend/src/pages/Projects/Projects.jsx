import { useEffect, useState } from 'react';
import './Projects.css';
import axios from 'axios';

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(<div className="loading-screen"><span className="loader"></span></div>);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URI}/api/projects`);
        setProjects(res.data.data);
        setIsLoading(false);
      } catch (err) {
        console.error("Error fetching projects:", err);
      }
    };

    fetchProjects();
  }, []);

  return (
    <section className="projects-section" id='Projects'>
      {isLoading}
      <div className="projects-container">
        <h1 className="projects-section-title">My <span>Projects</span></h1>

        <div className="projects-grid">
          {projects.map((project, index) => (
            <div
              key={index}
              className="projects-card"
              style={{ '--index': index }}
            >
              <div className="projects-image-container">
                <img
                  src={project.images?.[0]?.url || 'https://via.placeholder.com/300'}
                  alt={project.title}
                  className="projects-image"
                  loading="lazy"
                />
                <div className="projects-links">
                  <a
                    href={project.github}
                    className="projects-link projects-github-link"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <i className="fab fa-github"></i> Code
                  </a>
                  <a
                    href={project.visit}
                    className="projects-link projects-live-link"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <i className="fas fa-external-link-alt"></i> Demo
                  </a>
                </div>
              </div>

              <div className="projects-content">
                <div className="projects-meta">
                  <span className="projects-date">{project.date}</span>
                </div>
                <h3 className="projects-title">{project.title}</h3>
                <p className="projects-description">{project.description}</p>

                <div className="projects-tags">
                  {project.tags.map((tag, tagIndex) => (
                    <span
                      key={tagIndex}
                      className="projects-tag"
                      style={{ color: tag === 'Private Repositery' ? 'red' : '' }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
