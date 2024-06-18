import React from 'react';
import SignInForm from "./sign-in-form/SignInForm.jsx";
import SignInImage from "./sign-in-image/SignInImage.jsx";
import './SignInPage.css';
import {useLanguage} from "../../context/LanguageContext.jsx";
import {translations} from "./translations.js";

function SignInPage() {
    const { language } = useLanguage();

    const content = translations[language];

    return (
        <div className="si-container">
            <div className="si-upper-content">
                <h1>{content.signIn}</h1>
            </div>
            <div className="si-main-content">
                <SignInImage/>
                <SignInForm/>
            </div>
        </div>
    );
}

export default SignInPage;
