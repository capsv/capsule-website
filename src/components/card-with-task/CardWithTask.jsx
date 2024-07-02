import React, { useState, useEffect } from 'react';
import { FiLock } from 'react-icons/fi';
import './CardWithTask.css';

const CardWithTask = ({ title, description, className, assay, taskId, token, initialStatus }) => {
    const [status, setStatus] = useState('initial');
    const isMain = className === 'card-main';

    useEffect(() => {
        switch (initialStatus) {
            case 'IN_PROGRESS':
                setStatus('started');
                break;
            case 'COMPLETED':
                setStatus('completed');
                break;
            case 'SKIPPED':
                setStatus('skipped');
                break;
            default:
                setStatus('initial');
        }
    }, [initialStatus]);

    const handleSkip = async () => {
        try {
            const response = await fetch('http://195.80.51.69:8080/api/v1/tasks/skip', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ taskId })
            });
            if (response.status === 200) {
                setStatus('skipped');
            } else {
                console.error('Failed to skip task');
            }
        } catch (error) {
            console.error('Error skipping task:', error);
        }
    };

    const handleStart = async () => {
        try {
            const response = await fetch('http://195.80.51.69:8080/api/v1/tasks/start', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ taskId })
            });
            if (response.status === 200) {
                setStatus('started');
            } else {
                console.error('Failed to start task');
            }
        } catch (error) {
            console.error('Error starting task:', error);
        }
    };

    const handleComplete = async () => {
        try {
            const response = await fetch('http://195.80.51.69:8080/api/v1/tasks/complete', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ taskId })
            });
            if (response.status === 200) {
                setStatus('completed');
            } else {
                console.error('Failed to complete task');
            }
        } catch (error) {
            console.error('Error completing task:', error);
        }
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
