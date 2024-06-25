import React, { useState } from 'react';
import { FiLock } from 'react-icons/fi';
import './CardWithTask.css';

const CardWithTask = ({ title, description, className, assay }) => {
    const [status, setStatus] = useState('initial');
    const isMain = className === 'card-main';

    const handleSkip = () => {
        setStatus('skipped');
    };

    const handleStart = () => {
        setStatus('started');
    };

    const handleComplete = () => {
        setStatus('completed');
    };

    if (!assay) {
        return (
            <div className={`card ${className} locked-card`}>
                <FiLock size={120} color="black" />
            </div>
        );
    }

    return (
        <div className={`card ${className}`}>
            {status === 'skipped' ? (
                <h1 className="skipped-text">SKIPPED</h1>
            ) : status === 'completed' ? (
                <h1 className="success-text">SUCCESS</h1>
            ) : (
                <>
                    <h3 className="card-title">{title}</h3>
                    <p className="card-description">{description}</p>
                    <div className="card-buttons">
                        {status === 'started' ? (
                            <button className={`card-button complete-button ${!isMain ? 'inactive' : ''}`}
                                    onClick={handleComplete}
                                    disabled={!isMain}
                            >
                                Complete
                            </button>
                        ) : (
                            <>
                                <button
                                    className={`card-button start-button ${!isMain ? 'inactive' : ''}`}
                                    onClick={handleStart}
                                    disabled={!isMain}
                                >
                                    Start
                                </button>
                                <button
                                    className={`card-button skip-button ${!isMain ? 'inactive' : ''}`}
                                    onClick={handleSkip}
                                    disabled={!isMain}
                                >
                                    Skip
                                </button>
                            </>
                        )}
                    </div>
                </>
            )}
        </div>
    );
};

export default CardWithTask;
