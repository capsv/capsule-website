import React from 'react';
import {useLanguage} from '../../context/LanguageContext.jsx';
import HeroSection from "./hero-section/HeroSection.jsx";
import RelevanceSection from "./relevance-section/RelevanceSection.jsx";
import './HomePage.css';

function HomePage() {
    const {language} = useLanguage();

    const content = {
        en: {
            greeting: "Hi there 👋",
            description: "🙋‍♀️ capsule is not just a startup, it is an IT community where each participant is a bright, brave and creative person. Here everyone can contribute to the development of ideas and it is not necessary to be a programmer. Become a part of the capsule team and you won't regret it!",
            relevance: "Project Relevance",
            relevanceDescriptionCardOne: "According to wordstat.yandex, the number of requests on the topic of anxiety from January 2018 to April 2024 increased from 61k to 260k requests per month (4 times)",
            relevanceDescriptionCardTwo: "According to wordstat.yandex, the number of requests on the topic fight against anxiety from January 2018 to April 2024 increased from 66 to 1146 requests per month (17 times)"
        },
        ru: {
            greeting: "Привет 👋",
            description: "🙋‍♀️ capsule - это не просто стартап, это IT-сообщество, где каждый участник - яркая, смелая и творческая личность. Здесь каждый может внести свой вклад в развитие идей и необязательно быть программистом. Станьте частью команды capsule, и вы не пожалеете об этом!",
            relevance: "Актуальность проекта",
            relevanceDescriptionCardOne: "Согласно wordstat.yandex количество запросов по теме тревожность с января 2018 по апрель 2024 выросла с 61к до 260к запросов в месяц (в 4 раза)",
            relevanceDescriptionCardTwo: "Согласно wordstat.yandex количество запросов по теме борьба с тревожностью с января 2018 по апрель 2024 выросла с 66 до 1146 запросов в месяц (в 17 раз)"
        }
    };

    return (
        <div className="home-container">
            <HeroSection content={content[language]}/>
            <RelevanceSection content={content[language]}/>
        </div>
    );
}

export default HomePage;
