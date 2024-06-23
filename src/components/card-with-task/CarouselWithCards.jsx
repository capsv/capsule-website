import React, { useState } from 'react';
import { FiArrowLeftCircle, FiArrowRightCircle } from 'react-icons/fi';
import './CarouselWithCards.css';
import CardWithTask from './CardWithTask';

const CarouselWithCards = ({ cards }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    const handleNext = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % cards.length);
    };

    const handlePrev = () => {
        setCurrentIndex((prevIndex) => (prevIndex - 1 + cards.length) % cards.length);
    };

    const getCardStyle = (index) => {
        const relativeIndex = (index - currentIndex + cards.length) % cards.length;
        switch (relativeIndex) {
            case 0:
                return 'card-secondary-left';
            case 1:
                return 'card-main';
            case 2:
                return 'card-secondary-right';
            default:
                return 'card-hidden';
        }
    };

    return (
        <div className="carousel-section">
            <h2 className="carousel-title">Daily experience</h2>
            <div className="carousel-container">
                <button className="carousel-button left" onClick={handlePrev}>
                    <FiArrowLeftCircle size={40} />
                </button>
                <div className="carousel-wrapper">
                    {cards.map((card, index) => (
                        <CardWithTask
                            key={index}
                            title={card.title}
                            description={card.description}
                            className={getCardStyle(index)}
                        />
                    ))}
                </div>
                <button className="carousel-button right" onClick={handleNext}>
                    <FiArrowRightCircle size={40} />
                </button>
            </div>
        </div>
    );
};

export default CarouselWithCards;
