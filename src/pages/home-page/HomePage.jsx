import React from 'react';
import {useLanguage} from '../../context/LanguageContext.jsx';
import HeroSection from "./hero-section/HeroSection.jsx";
import RelevanceSection from "./relevance-section/RelevanceSection.jsx";
import './HomePage.css';

function HomePage() {
    const {language} = useLanguage();

    const content = {
        en: {
            greeting: <>We are an IT team that makes <span style={{color: 'rgb(253, 147, 43)'}}>the capsule community</span></>,
            description: "Our products are distributed using the Open-Source Software model, so everyone can participate in the development!",
            relevance: "Project Relevance",
            relevanceDescriptionCardOne: "According to wordstat.yandex, the number of requests on the topic of anxiety from January 2018 to April 2024 increased from 61k to 260k requests per month (4 times)",
            relevanceDescriptionCardTwo: "According to wordstat.yandex, the number of requests on the topic fight against anxiety from January 2018 to April 2024 increased from 66 to 1146 requests per month (17 times)"
        },
        ru: {
            greeting: <>Мы it-команда, образующая <span style={{color: 'rgb(253, 147, 43)'}}>сообщество capsule</span></>,
                description: "Наши продукты распространяются по модели Open-Source Software, поэтому каждый может принять участие в разработке!",
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
