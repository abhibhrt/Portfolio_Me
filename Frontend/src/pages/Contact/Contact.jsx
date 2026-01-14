import React, { useState, useEffect } from 'react';
import './Contact.css';
import { useAlert } from '../../components/Alert/Alert';
import { FaEnvelope, FaPhone, FaPaperPlane } from 'react-icons/fa';
import { FaWhatsapp } from 'react-icons/fa';

export default function Contact() {
    const { showAlert, AlertComponent } = useAlert();
    const [isLoading, setIsLoading] = useState(
        <div className="loading-screen"><span className="loader"></span></div>
    );
    const [details, setDetails] = useState({
        name: '',
        email: '',
        message: '',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    async function handleSubmit(e) {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const response = await fetch(`${process.env.REACT_APP_BASE_API}/api/contacts`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(details)
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const result = await response.json();
            showAlert(result.message, result.status);
            setDetails({
                name: '',
                email: '',
                message: '',
            });
            setIsSubmitting(false);
        } catch (err) {
            showAlert("Error in sending message: ", 'error');
            console.log("Error in sending message: " + err);
            setIsSubmitting(false);
        }
    }

    useEffect(() => {
        const image = document.getElementById("mapshow");
        image.addEventListener("load", () => {
            setIsLoading(null);
        });
    }, []);

    return (
        <section className="contact-section" id='contact'>
            {isLoading}
            <AlertComponent />
            <div className="contact-container">
                <h1 className="contact-section-title">Get In <span>Touch</span></h1>

                <div className="contact-content">
                    <div className="contact-map">
                        <iframe
                            src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d4027.7361966361905!2d81.57618938553246!3d23.183923540658835!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x398655b965f4535d%3A0xdb0bea3415fae9ce!2sUslapur!5e1!3m2!1sen!2sin!4v1754223807223!5m2!1sen!2sin"
                            title='location'
                            loading="lazy"
                            id='mapshow'
                            allowFullScreen
                        ></iframe>
                    </div>

                    <div className="contact-info">
                        {/* Email */}
                        <a className="contact-card" href="mailto:abhibharti365@gmail.com">
                            <div className="contact-icon">
                                <FaEnvelope size={24} />
                            </div>
                            <div className="contact-detail">
                                <h3>Email</h3>
                                <p>abhibharti365@gmail.com</p>
                            </div>
                        </a>

                        {/* WhatsApp */}
                        <a className="contact-card" href="https://wa.me/919713397975" target="_blank" rel="noopener noreferrer">
                            <div className="contact-icon whatsapp">
                                <FaWhatsapp size={24} />
                            </div>
                            <div className="contact-detail">
                                <h3>WhatsApp</h3>
                                <p>9713397975</p>
                            </div>
                        </a>

                        {/* Phone */}
                        <a className="contact-card" href="tel:+919713397975">
                            <div className="contact-icon phone">
                                <FaPhone size={24} />
                            </div>
                            <div className="contact-detail">
                                <h3>Phone</h3>
                                <p>+91 9713397975</p>
                            </div>
                        </a>
                    </div>

                    <div className="contact-form">
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <input
                                    type="text"
                                    name="Client Name"
                                    onChange={(e) => setDetails({ ...details, name: e.target.value })}
                                    className="form-input"
                                    placeholder="Your Name"
                                    value={details.name}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <input
                                    type="email"
                                    name="Client Gmail"
                                    onChange={(e) => setDetails({ ...details, email: e.target.value })}
                                    className="form-input"
                                    placeholder="Your Email"
                                    value={details.email}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <textarea
                                    name="Message"
                                    onChange={(e) => setDetails({ ...details, message: e.target.value })}
                                    className="form-textarea"
                                    placeholder="Your Message"
                                    rows="5"
                                    required
                                    value={details.message}
                                ></textarea>
                            </div>

                            <button type="submit" className={`submit-btn ${isSubmitting ? 'disabled' : ''}`} disabled={isSubmitting}>
                                {isSubmitting ? 'Sending...' : 'Send Message'} <FaPaperPlane size={18} />
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
}