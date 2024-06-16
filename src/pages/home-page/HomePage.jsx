import React from 'react';
import { useLanguage } from '../../context/LanguageContext.jsx';
import { useInView } from 'react-intersection-observer';
import './HomePage.css';

function HomePage() {
    const { language } = useLanguage();
    const { ref: refCard1, inView: inViewCard1 } = useInView({ triggerOnce: true });
    const { ref: refCard2, inView: inViewCard2 } = useInView({ triggerOnce: true });
    const { ref: refImage, inView: inViewImage } = useInView({ triggerOnce: true });

    const content = {
        en: {
            greeting: "Hi there 👋",
            description: "🙋‍♀️ capsule is not just a startup, it is an IT community where each participant is a bright, brave and creative person. Here everyone can contribute to the development of ideas and it is not necessary to be a programmer. Become a part of the capsule team and you won't regret it!",
            relevance: "Project Relevance",
            relevanceDescription1: "According to wordstat.yandex, the number of requests on the topic of anxiety from January 2018 to April 2024 increased from 61k to 260k requests per month (4 times).",
            relevanceDescription2: "According to wordstat.yandex, the number of requests on the topic 'fight against anxiety' from January 2018 to April 2024 increased from 66 to 1146 requests per month (17 times)."
        },
        ru: {
            greeting: "Привет 👋",
            description: "🙋‍♀️ capsule - это не просто стартап, это IT-сообщество, где каждый участник - яркая, смелая и творческая личность. Здесь каждый может внести свой вклад в развитие идей и необязательно быть программистом. Станьте частью команды capsule, и вы не пожалеете об этом!",
            relevance: "Актуальность проекта",
            relevanceDescription1: "Согласно wordstat.yandex количество запросов по теме тревожность с января 2018 по апрель 2024 выросла с 61к до 260к запросов в месяц (в 4 раза).",
            relevanceDescription2: "Согласно wordstat.yandex количество запросов по теме 'борьба с тревожностью' с января 2018 по апрель 2024 выросла с 66 до 1146 запросов в месяц (в 17 раз)."
        }
    };

    return (
        <div className="home-container">
            <section className="hero-section">
                <img src="/photos/orange-3.svg" alt="Orange decoration" className="hero-decoration hero-decoration-1" />
                <h1>{content[language].greeting}</h1>
                <p>{content[language].description}</p>
            </section>
            <section className="relevance-section">
                <h2>{content[language].relevance}</h2>
                <div className="relevance-cards">
                    <div ref={refCard1} className={`relevance-card ${inViewCard1 ? 'fade-in-left' : ''}`}>
                        <h3>Word stat</h3>
                        <p>{content[language].relevanceDescription1}</p>
                        <img src="/photos/Anxiety-rafiki.svg" alt="Anxiety" className="relevance-image-svg" />
                    </div>
                    <div ref={refCard2} className={`relevance-card ${inViewCard2 ? 'fade-in-right' : ''}`}>
                        <h3>Word stat</h3>
                        <p>{content[language].relevanceDescription2}</p>
                        <img src="/photos/Social anxiety-rafiki.svg" alt="Social Anxiety" className="relevance-image-svg" />
                    </div>
                </div>
                <div ref={refImage} className={`relevance-image-container ${inViewImage ? 'fade-in-up' : ''}`}>
                    <h3>Word stat</h3>
                    <img src="/photos/chart.png" alt="Relevance" className="relevance-image" />
                </div>
            </section>
        </div>
    );
}

export default HomePage;
