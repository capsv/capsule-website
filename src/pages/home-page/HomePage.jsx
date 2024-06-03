import React from 'react';
import {useLanguage} from '../../context/LanguageContext.jsx';
import './HomePage.css';

function HomePage() {
    const {language} = useLanguage();

    const content = {
        en: {
            greeting: "Hi there 👋",
            description: "🙋‍♀️ capsule is not just a startup, it is an IT community where each participant is a bright, brave and creative person. Here everyone can contribute to the development of ideas and it is not necessary to be a programmer. Become a part of the capsule team and you won't regret it!"
        },
        ru: {
            greeting: "Привет 👋",
            description: "🙋‍♀️ capsule - это не просто стартап, это IT-сообщество, где каждый участник - яркая, смелая и творческая личность. Здесь каждый может внести свой вклад в развитие идей и необязательно быть программистом. Станьте частью команды capsule, и вы не пожалеете об этом!"
        }
    };

    return (
        <div className="home-container">
            <h1>{content[language].greeting}</h1>
            <p>{content[language].description}</p>
        </div>
    );
}

export default HomePage;
