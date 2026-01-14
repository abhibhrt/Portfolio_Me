import { useState, useEffect } from 'react';
import './Home.css';
import skills from './skills.json';
import { Link } from "react-router-dom";
import { FaGithub, FaLinkedin, FaTwitter } from 'react-icons/fa';
import { SiLeetcode } from 'react-icons/si';

export default function Home() {
    const [hidden, setHidden] = useState(null);
    const [isLoading, setIsLoading] = useState(
        <div className="loading-screen"><span className="loader"></span></div>
    );

    function handleSkillClick(item) {
        setHidden(item);
    }

    useEffect(() => {
        const images = document.querySelectorAll(".home-portfolio-image");
        let loadedImages = 0;

        if (images.length === 0) {
            setIsLoading(null);
            return;
        }

        const handleImageLoad = () => {
            loadedImages++;
            if (loadedImages === images.length) {
                setIsLoading(null);
            }
        };

        images.forEach((img) => {
            if (img.complete) {
                handleImageLoad();
            } else {
                img.addEventListener("load", handleImageLoad);
            }
        });

        return () => {
            images.forEach((img) => img.removeEventListener("load", handleImageLoad));
        };
    }, []);

    return (
        <div className="home-container">
            {isLoading}
            <img
                className='home-bg home-portfolio-image'
                src="https://raw.githubusercontent.com/abhishekbharti2/Assets/refs/heads/main/Portfolio/Home/background.webp"
                alt="Background"
            />

            <section className="home-hero-section" id='Intro-Section'>
                <div className="home-hero-content">
                    <div className='home-hero-text'>
                        <h3 className="home-hero-greeting">Hey There! <span className="home-wave">&#128400;</span></h3>
                        <h1 className="home-hero-title">I'm <span>Abhishek Bharti</span></h1>
                        <h2 className="home-hero-subtitle">Full Stack Developer</h2>
                    </div>

                    <div className="home-project-cta">
                        <Link to="/contact" className="styled-home-btn learn-more">
                            <span className="circle" aria-hidden="true">
                                <span className="icon arrow"></span>
                            </span>
                            <span className="button-text">Start Project</span>
                        </Link>
                    </div>

                    <div className="home-social-links">
                        <a href="https://x.com/abhibhrt" target="_blank" rel="noopener noreferrer">
                            <FaTwitter size={24} />
                        </a>
                        <a href="https://github.com/abhibhrt" target="_blank" rel="noopener noreferrer">
                            <FaGithub size={24} />
                        </a>
                        <a href="https://www.linkedin.com/in/abhibhrt/" target="_blank" rel="noopener noreferrer">
                            <FaLinkedin size={24} />
                        </a>
                        <a href="https://leetcode.com/u/abhishekbhrt/" target="_blank" rel="noopener noreferrer">
                            <SiLeetcode size={24} />
                        </a>
                    </div>
                </div>

                <div className="home-hero-image">
                    <img
                        src="https://raw.githubusercontent.com/abhishekbharti2/Assets/refs/heads/main/Portfolio/Home/introduction.webp"
                        alt="Profile"
                        className='home-portfolio-image'
                        loading='lazy'
                    />
                </div>
            </section>

            <section className="home-about-section" id='About-Section'>
                <div className="home-about-content">
                    <div>
                        <h2 className="home-section-title">About Me</h2>
                        <p className="home-about-text">
                            Full-Stack Developer with a B.Tech in Electronics and Communication Engineering from IIIT Bhopal. Proficient in React.js, JavaScript, Node.js, Express, and MongoDB, with experience in building full-stack web applications. Skilled in frontend and backend development, API integration, and modern UI/UX practices.
                        </p>
                        <br />
                        <a
                            href='https://drive.google.com/file/d/1Yd1vTA3ZXZ82lZQIZ9hPcF6lXB2kYcaF/view?usp=drive_link'
                            className='home-resume-btn'
                        >
                            <span className="home-btn-text">Get Resume</span>
                            <span className="home-btn-hover">Thank You!</span>
                        </a>
                    </div>

                    <div className="home-skills-content">
                        <h2 className="home-section-title">My Skills</h2>
                        <div className="home-skills-grid">
                            {skills.map((item, index) => (
                                <div key={index} className="home-skill-category">
                                    <div
                                        className='home-skill-tag'
                                        onClick={() => handleSkillClick(item.skills)}
                                    >
                                        {item.category}
                                    </div>
                                    {hidden === item.skills && (
                                        <div className='home-skill-details'>
                                            <div className="home-skill-details-header">
                                                <h3>{item.category}</h3>
                                                <button
                                                    className='home-close-details'
                                                    onClick={() => setHidden(null)}
                                                >×</button>
                                            </div>
                                            <div className="home-skills-list">
                                                {hidden.map((sk, ind) => (
                                                    <div key={ind} className='home-skill-item'>
                                                        <img
                                                            src={`https://raw.githubusercontent.com/abhishekbharti2/Assets/refs/heads/main/Portfolio/symbols/${sk}.webp`}
                                                            alt={sk}
                                                            className='home-skill-icon'
                                                            loading='lazy'
                                                        />
                                                        <span className='home-skill-name'>{sk}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="home-profile-image">
                        <img
                            src="https://raw.githubusercontent.com/abhibhrt/Assets/refs/heads/main/Portfolio/Home/img.jpg"
                            alt="Profile"
                            className='home-portfolio-image'
                            loading='lazy'
                        />
                    </div>
                </div>
            </section>
        </div>
    );
}