import React, { useState, useEffect } from 'react';
import { FiArrowLeftCircle, FiArrowRightCircle } from 'react-icons/fi';
import './CarouselWithCards.css';
import CardWithTask from './CardWithTask';

const CarouselWithCards = ({ cards, assay, token }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [timeLeft, setTimeLeft] = useState("");

    useEffect(() => {
        const calculateTimeLeft = () => {
            const now = new Date();
            const next3AM = new Date();
            next3AM.setDate(now.getDate() + 1);
            next3AM.setHours(3, 0, 0, 0);
            const difference = next3AM - now;
            let timeLeft = {};

            if (difference > 0) {
                timeLeft = {
                    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                    minutes: Math.floor((difference / 1000 / 60) % 60),
                    seconds: Math.floor((difference / 1000) % 60)
                };
            }
            return timeLeft;
        };

        const updateTimer = () => {
            const timeLeft = calculateTimeLeft();
            setTimeLeft(`${timeLeft.hours}h ${timeLeft.minutes}m ${timeLeft.seconds}s`);
        };

        const timer = setInterval(updateTimer, 1000);
        updateTimer();

        return () => clearInterval(timer);
    }, []);

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
            <div className="timer">{timeLeft}</div>
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
                            assay={assay}
                            taskId={card.id}
                            token={token}
                            initialStatus={card.status}
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
