import React, { useEffect, useState } from 'react';
import { useAlert } from '../../Alert/Alert';
import './projects.css';

const ProjectManager = () => {
  const [projects, setProjects] = useState([]);
  const { showAlert, AlertComponent } = useAlert();
  const [formData, setFormData] = useState({
    title: '',
    github: '',
    visit: '',
    description: '',
    date: '',
    tags: '',
    images: null
  });
  const [preview, setPreview] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const token = localStorage.getItem('token');

  const API = import.meta.env.VITE_API_URI;

  const fetchProjects = async () => {
    try {
      const res = await fetch(`${API}/api/projects`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      setProjects(data.data);
    } catch (err) {
      console.error('Error fetching projects:', err);
    }
  };

  useEffect(() => {
    fetchProjects();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData((prev) => ({ ...prev, images: reader.result }));
    };
    const previewURL = URL.createObjectURL(file);
    setPreview(previewURL);
    reader.readAsDataURL(file);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      let url = `${API}/api/projects`;
      let method = 'POST';

      if (editingId) {
        url = `${API}/api/projects/${editingId}`;
        method = 'PUT';
      }

      await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      setFormData({
        title: '',
        github: '',
        visit: '',
        description: '',
        date: '',
        tags: '',
        images: '',
      });
      setPreview(null);
      showAlert(editingId ? 'Updated Successfully' : 'Project Added', 'success');
      setEditingId(null);
      fetchProjects();
    } catch (err) {
      console.error('Error saving project:', err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await fetch(`${API}/api/projects/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      showAlert('Project Deleted', 'success');
      fetchProjects();
    } catch (err) {
      console.error('Error deleting project:', err);
    }
  };

  const handleEdit = (project) => {
    setFormData({
      title: project.title || '',
      github: project.github || '',
      visit: project.visit || '',
      description: project.description || '',
      date: project.date || '',
      tags: Array.isArray(project.tags) ? project.tags.join(', ') : '',
      images: '',
    });
    setPreview(project.images?.[0]?.url || '');
    setEditingId(project._id);
  };

  return (
    <div className="project-manager-container">
      <AlertComponent />

      {/* Project List */}
      <div className="projects-list-container">
        <h2 className="projects-list-title">Projects</h2>
        {projects.map((proj) => (
          <div key={proj._id} className="project-item">
            <div>
              <h3 className="project-title">{proj.title}</h3>
              <p className="project-description">{proj.description}</p>
            </div>
            <div className="project-actions">
              <button onClick={() => handleEdit(proj)} className="edit-btn">
                Edit
              </button>
              <button
                onClick={() => handleDelete(proj._id)}
                className="delete-btn"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Project Form */}
      <div className="project-form-container">
        <h2 className="project-form-title">
          {editingId ? 'Edit Project' : 'Add Project'}
        </h2>
        <form onSubmit={handleSubmit} className="project-form">
          <input
            type="text"
            name="title"
            value={formData.title || ''}
            onChange={handleChange}
            placeholder="Title"
            className="form-input"
          />
          <input
            type="text"
            name="github"
            value={formData.github || ''}
            onChange={handleChange}
            placeholder="GitHub URL"
            className="form-input"
          />
          <input
            type="text"
            name="visit"
            value={formData.visit || ''}
            onChange={handleChange}
            placeholder="Live URL"
            className="form-input"
          />
          <input
            type="text"
            name="date"
            value={formData.date || ''}
            onChange={handleChange}
            placeholder="Date"
            className="form-input"
          />
          <textarea
            name="description"
            value={formData.description || ''}
            onChange={handleChange}
            placeholder="Description"
            className="form-input form-textarea"
          />
          <input
            type="text"
            name="tags"
            value={formData.tags || ''}
            onChange={handleChange}
            placeholder="Tags (comma separated)"
            className="form-input"
          />

          <label className="file-input-label">
            {formData.images ? 'Change Image' : 'Upload Image'}
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="file-input"
            />
          </label>

          {preview && (
            <img src={preview} alt="Preview" className="image-preview" />
          )}

          <button type="submit" className="submit-btn">
            {editingId ? 'Update Project' : 'Add Project'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProjectManager;