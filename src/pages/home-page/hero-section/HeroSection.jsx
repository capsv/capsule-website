import React from 'react';
import './HeroSection.css';
import PropTypes from "prop-types";
import HeroButtons from "./hero-buttons/HeroButtons.jsx";

const HeroSection = ({ content }) => {

    return (
        <section className="hero-section">
            <div className="hero-content">
                <div className="hero-text">
                    <h1>{content.greeting}</h1>
                    <p>{content.description}</p>
                </div>
                <div className="hero-image">
                    <img src="/public/photos/journal-woman-playing-jenga-at-game-night.png" alt="Capsule Logo"/>
                </div>
            </div>
            <HeroButtons />
            <img src="/photos/orange-3.svg" alt="Orange decoration" className="hero-decoration hero-decoration-1"/>
        </section>
    );
};

HeroSection.propTypes = {
    content: PropTypes.shape({
        greeting: PropTypes.string.isRequired,
        description: PropTypes.string.isRequired,
    }).isRequired,
};

export default HeroSection;