import React, { useState } from 'react';
import './styles/Header.css';
import SignUpModal from './SignUpModal';

function Header() {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    return (
        <header className="header-container">
            <div className="logo">Capsule</div>
            <nav className="nav">
                <button className="button">Sign In</button>
                <button className="button" onClick={openModal}>Sign Up</button>
            </nav>
            <SignUpModal isOpen={isModalOpen} onClose={closeModal} />
        </header>
    );
}

export default Header;
