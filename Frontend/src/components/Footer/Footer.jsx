import './Footer.css';
import { NavLink } from 'react-router-dom';
import { FaLinkedin, FaGithub, FaTwitter } from 'react-icons/fa';
import { SiLeetcode } from 'react-icons/si';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <div className="footer-brand">
            <h2 className="footer-title">
              Abhishek <span>Bharti</span>
            </h2>
            <p className="footer-tagline">Full Stack Developer</p>
          </div>
        </div>

        <div className="footer-section">
          <h3 className="footer-heading">About</h3>
          <p className="footer-text">
            I'm specialize in crafting dynamic, responsive, and user-friendly websites.
            Whether it's building sleek frontends with React or vanilla HTML/CSS/JavaScript,
            or powering robust backends, I ensure seamless functionality tailored to your needs.
          </p>
        </div>

        <div className="footer-section">
          <h3 className="footer-heading">Call To Action</h3>
          <div className="footer-cta">
            <p className="cta-text"><strong>Open To Work</strong></p>
            <ul className="cta-list">
              <li><a href="https://en.wikipedia.org/wiki/Frontend_and_backend">Frontend Role</a></li>
              <li><a href="https://en.wikipedia.org/wiki/Frontend_and_backend">Backend Role</a></li>
              <li><a href="https://en.wikipedia.org/wiki/Frontend_and_backend">Full Stack</a></li>
              <li><NavLink to="/admin">Admin</NavLink></li>
            </ul>
          </div>
        </div>
      </div>

      <div className="footer-social">
        <h4 className="social-title">Connect With Me</h4>
        <div className="social-icons">
          <a href="https://leetcode.com/u/abhishekbhrt/"
            className="social-icon leetcode"
            target="_blank"
            rel="noopener noreferrer">
            <SiLeetcode size={24} />
          </a>
          <a href="https://www.linkedin.com/in/abhibhrt"
            className="social-icon linkedin"
            target="_blank"
            rel="noopener noreferrer">
            <FaLinkedin size={24} />
          </a>
          <a href="https://github.com/abhibhrt"
            className="social-icon github"
            target="_blank"
            rel="noopener noreferrer">
            <FaGithub size={24} />
          </a>
          <a href="https://x.com/abhibhrt"
            className="social-icon twitter"
            target="_blank"
            rel="noopener noreferrer">
            <FaTwitter size={24} />
          </a>
        </div>
      </div>

      <div className="footer-bottom">
        <p className="copyright">
          &copy; {new Date().getFullYear()} Abhishek Bharti. All Rights Reserved.
        </p>
      </div>
    </footer>
  );
}