import { useState } from 'react';
import { FaProjectDiagram, FaEnvelope, FaChartLine, FaTimes } from 'react-icons/fa';
import ProjectManager from './Portfolio/Projects';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';
import Progress from './Portfolio/Progress';

export default function Dashboard() {
    const [activeComponent, setActiveComponent] = useState(null);
    const navigate = useNavigate();

    const renderComponent = () => {
        switch (activeComponent) {
            case 'projects':
                return <ProjectManager />;
            case 'messages':
                return ;
            case 'progress':
                return <Progress />;
            default:
                return (
                    <div className="dashboard-welcome">
                        <div className="dashboard-welcome-icon">
                            <FaChartLine />
                        </div>
                        <h2>Welcome to Admin Dashboard</h2>
                        <p>Select a section from the menu to get started</p>
                    </div>
                );
        }
    };

    const ProjectsComponent = () => (
        <div className="dashboard-component">
            <div className="component-header">
                <h3>Projects Management</h3>
                <button 
                    className="component-close-btn"
                    onClick={() => setActiveComponent(null)}
                >
                    <FaTimes />
                </button>
            </div>
            <div className="component-content">
                <p>Projects content will be displayed here...</p>
                {/* Add your projects content here */}
            </div>
        </div>
    );

    const MessagesComponent = () => (
        <div className="dashboard-component">
            <div className="component-header">
                <h3>Messages Center</h3>
                <button 
                    className="component-close-btn"
                    onClick={() => setActiveComponent(null)}
                >
                    <FaTimes />
                </button>
            </div>
            <div className="component-content">
                <p>Messages content will be displayed here...</p>
                {/* Add your messages content here */}
            </div>
        </div>
    );

    const ProgressComponent = () => (
        <div className="dashboard-component">
            <div className="component-header">
                <h3>Progress Analytics</h3>
                <button 
                    className="component-close-btn"
                    onClick={() => setActiveComponent(null)}
                >
                    <FaTimes />
                </button>
            </div>
            <div className="component-content">
                <p>Progress analytics will be displayed here...</p>
                {/* Add your progress content here */}
            </div>
        </div>
    );

    function handleSignout(){
        localStorage.clear('token');
        navigate('/');
    }

    return (
        <div className="dashboard-container">
            <header className="dashboard-header">
                <div className="dashboard-header-content">
                    <h1>Admin Dashboard</h1>
                    <p>Manage your platform efficiently</p>
                </div>
                <div className="dashboard-token-info">
                    <button className="token-badge" onClick={handleSignout}>Signout</button>
                </div>
            </header>

            <div className="dashboard-layout">
                <aside className="dashboard-sidebar">
                    <nav className="dashboard-nav">
                        <button 
                            className={`dashboard-nav-btn ${activeComponent === 'projects' ? 'dashboard-nav-btn-active' : ''}`}
                            onClick={() => setActiveComponent('projects')}
                        >
                            <FaProjectDiagram className="dashboard-nav-icon" />
                            <span>Projects</span>
                        </button>

                        <button 
                            className={`dashboard-nav-btn ${activeComponent === 'messages' ? 'dashboard-nav-btn-active' : ''}`}
                            onClick={() => setActiveComponent('messages')}
                        >
                            <FaEnvelope className="dashboard-nav-icon" />
                            <span>Messages</span>
                        </button>

                        <button 
                            className={`dashboard-nav-btn ${activeComponent === 'progress' ? 'dashboard-nav-btn-active' : ''}`}
                            onClick={() => setActiveComponent('progress')}
                        >
                            <FaChartLine className="dashboard-nav-icon" />
                            <span>Progress</span>
                        </button>
                    </nav>
                </aside>

                <main className="dashboard-main">
                    <div className="dashboard-content">
                        {renderComponent()}
                    </div>
                </main>
            </div>
        </div>
    );
}