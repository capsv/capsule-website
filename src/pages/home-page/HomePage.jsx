import React from 'react';
import {useLanguage} from '../../context/LanguageContext.jsx';
import HeroSection from "./hero-section/HeroSection.jsx";
import RelevanceSection from "./relevance-section/RelevanceSection.jsx";
import './HomePage.css';

function HomePage() {
    const {language} = useLanguage();

    const content = {
        en: {
            greeting: "We are an IT team\n" +
                "that makes fintech\n" +
                "accessible",
            description: "Our products are distributed by model Open-Source Software and allow everyone to build their own business based on our code.",
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
