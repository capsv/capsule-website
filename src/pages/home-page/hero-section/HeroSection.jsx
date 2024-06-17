import React from 'react';
import './HeroSection.css';
import PropTypes from "prop-types";

const HeroSection = ({ content }) => {

    return (
        <section className="hero-section">
            <img src="/photos/orange-3.svg" alt="Orange decoration" className="hero-decoration hero-decoration-1" />
            <h1>{content.greeting}</h1>
            <p>{content.description}</p>
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