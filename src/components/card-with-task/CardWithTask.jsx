import React from 'react';
import './CardWithTask.css';

const CardWithTask = ({ title, description, className }) => {
    return (
        <div className={`card ${className}`}>
            <h3 className="card-title">{title}</h3>
            <p className="card-description">{description}</p>
        </div>
    );
};

export default CardWithTask;
