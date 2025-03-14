import React, { useState, useEffect } from 'react';
import { FiArrowLeftCircle, FiArrowRightCircle, FiClock } from 'react-icons/fi';
import './CarouselWithCards.css';
import CardWithTask from './CardWithTask';

const CarouselWithCards = ({ cards, assay, token }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [timeLeft, setTimeLeft] = useState("");
    const [animating, setAnimating] = useState(false);

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
        if (animating || cards.length <= 1) return;
        
        setAnimating(true);
        setCurrentIndex((prevIndex) => (prevIndex + 1) % cards.length);
        setTimeout(() => setAnimating(false), 400); // Соответствует длительности transition в CSS
    };

    const handlePrev = () => {
        if (animating || cards.length <= 1) return;
        
        setAnimating(true);
        setCurrentIndex((prevIndex) => (prevIndex - 1 + cards.length) % cards.length);
        setTimeout(() => setAnimating(false), 400); // Соответствует длительности transition в CSS
    };
    
    const handleDotClick = (index) => {
        if (animating || index === currentIndex) return;
        
        setAnimating(true);
        setCurrentIndex(index);
        setTimeout(() => setAnimating(false), 400);
    };

    const getCardStyle = (index) => {
        // Если всего одна карточка, просто показываем ее как основную
        if (cards.length === 1) return 'card-main';
        
        // Вычисляем относительный индекс с учетом текущей позиции карусели
        const relativeIndex = (index - currentIndex + cards.length) % cards.length;
        
        // Для лучшей читаемости используем константы
        const MAIN_CARD = 'card-main';
        const LEFT_CARD = 'card-secondary-left';
        const RIGHT_CARD = 'card-secondary-right';
        const HIDDEN_CARD = 'card-hidden';
        
        // Если две карточки, показываем основную и одну справа
        if (cards.length === 2) {
            return relativeIndex === 0 ? MAIN_CARD : RIGHT_CARD;
        }
        
        // Если ровно три карточки, то показываем всех
        if (cards.length === 3) {
            switch (relativeIndex) {
                case 0: return MAIN_CARD;
                case 1: return RIGHT_CARD;
                case 2: return LEFT_CARD;
                default: return HIDDEN_CARD;
            }
        }
        
        // Для большего количества карточек
        switch (relativeIndex) {
            case 0: // Текущая карточка - всегда главная
                return MAIN_CARD;
            case cards.length - 1: // Последняя относительно текущей - слева
                return LEFT_CARD;
            case 1: // Следующая после текущей - справа
                return RIGHT_CARD;
            default:
                return HIDDEN_CARD;
        }
    };

    return (
        <div className="carousel-section">
            <h2 className="carousel-title">Daily Experience</h2>
            <div className="timer">
                {timeLeft}
            </div>
            <div className="carousel-container">
                <button 
                    className="carousel-button left" 
                    onClick={handlePrev}
                    disabled={animating || cards.length <= 1}
                    aria-label="Previous card"
                >
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
                <button 
                    className="carousel-button right" 
                    onClick={handleNext}
                    disabled={animating || cards.length <= 1}
                    aria-label="Next card"
                >
                    <FiArrowRightCircle size={40} />
                </button>
            </div>
            
            {/* Индикаторы карточек */}
            {cards.length > 1 && (
                <div className="carousel-indicators">
                    {cards.map((_, index) => (
                        <button
                            key={index}
                            className={`carousel-indicator ${index === currentIndex ? 'active' : ''}`}
                            onClick={() => handleDotClick(index)}
                            aria-label={`Go to card ${index + 1}`}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default CarouselWithCards;
