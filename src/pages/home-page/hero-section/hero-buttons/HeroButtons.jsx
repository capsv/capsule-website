import React from 'react';
import './HeroButtons.css';

const HeroButtons = () => {
    return (
        <div className="hero-buttons">
            <a href="https://t.me/capsx" className="button telegram-button">
                <img src="/icons/cib-telegram-plane-white.svg" alt="Telegram" className="button-icon"/> Contact us
            </a>
            <a href="https://github.com/capsv" className="button github-button">
                <img src="/icons/github-icon.svg" alt="GitHub" className="button-icon"/> GitHub
            </a>
        </div>
    );
};

export default HeroButtons;
