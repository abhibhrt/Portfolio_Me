import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import './Navbar.css';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleScroll = () => {
    setScrolled(window.scrollY > 10);
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <nav className={`nav-container ${scrolled ? "scrolled" : ""}`}>
        <div className="navbar-header" onClick={toggleSidebar}> ☰ </div>
        <ul className="link-container desktop">
          <li><NavLink to="/" className="navbar-link">Home</NavLink></li>
          <li><NavLink to="/projects" className="navbar-link">Projects</NavLink></li>
          <li><NavLink to="/contact" className="navbar-link">Contact</NavLink></li>
          <li><NavLink to="/progress" className="navbar-link">Progress</NavLink></li>
        </ul>
      </nav>
      <div className={`sidebar ${sidebarOpen ? "open" : ""}`}>
        <img src="logo.png" alt="nav-image" className='navimage'/>
        <ul>
          <li><NavLink to="/" onClick={toggleSidebar}>Home</NavLink></li>
          <li><NavLink to="/projects" onClick={toggleSidebar}>Projects</NavLink></li>
          <li><NavLink to="/contact" onClick={toggleSidebar}>Contact</NavLink></li>
          <li><NavLink to="/progress" onClick={toggleSidebar}>Progress</NavLink></li>
        </ul>
      </div>

      {sidebarOpen && <div className="backdrop" onClick={toggleSidebar}></div>}
    </>
  );
}
