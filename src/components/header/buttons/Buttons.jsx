import {Link} from "react-router-dom";
import React from "react";
import "./Buttons.css";

const Buttons = () => {
    return (
        <div className="header-buttons">
            <Link to="/auth/in" className="header-button login-button">Login</Link>
            <Link to="/auth/up" className="header-button get-started-button">Get started</Link>
        </div>
    );
}

export default Buttons;