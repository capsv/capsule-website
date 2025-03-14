import React, { useState, useEffect } from 'react';
import { FiLock, FiCheck, FiSkipForward, FiPlay, FiCheckCircle, FiXCircle } from 'react-icons/fi';
import './CardWithTask.css';

const CardWithTask = ({ title, description, className, assay, taskId, token, initialStatus }) => {
    const [status, setStatus] = useState('initial');
    const [loading, setLoading] = useState(false);
    const [actionPerformed, setActionPerformed] = useState(false);
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
        if (loading) return;
        
        setLoading(true);
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
                setActionPerformed(true);
                setTimeout(() => setActionPerformed(false), 500);
            } else {
                console.error('Failed to skip task');
            }
        } catch (error) {
            console.error('Error skipping task:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleStart = async () => {
        if (loading) return;
        
        setLoading(true);
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
                setActionPerformed(true);
                setTimeout(() => setActionPerformed(false), 500);
            } else {
                console.error('Failed to start task');
            }
        } catch (error) {
            console.error('Error starting task:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleComplete = async () => {
        if (loading) return;
        
        setLoading(true);
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
                setActionPerformed(true);
                setTimeout(() => setActionPerformed(false), 500);
            } else {
                console.error('Failed to complete task');
            }
        } catch (error) {
            console.error('Error completing task:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleOpenAssayModal = () => {
        if (!isMain) return; // Игнорируем клик если карточка не основная
        
        // Диспатчим кастомное событие для открытия модального окна с тестом
        const event = new CustomEvent('openAssayModal');
        window.dispatchEvent(event);
    };

    if (!assay) {
        return (
            <div className={`card ${className} ${actionPerformed ? 'card-action' : ''}`}>
                <div className="locked-content">
                    <FiLock size={50} color="#4a6bff" className="lock-icon" />
                    <h3 className="locked-title">Пройдите тест, чтобы разблокировать задания</h3>
                    <button 
                        className={`take-test-btn ${!isMain ? 'inactive' : ''}`}
                        onClick={handleOpenAssayModal}
                        disabled={!isMain}
                    >
                        Пройти тест
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className={`card ${className} ${actionPerformed ? 'card-action' : ''}`}>
            {status === 'skipped' ? (
                <>
                    <FiXCircle size={50} color="#dc3545" style={{ marginBottom: '10px', opacity: 0.3 }} />
                    <h1 className="skipped-text">SKIPPED</h1>
                </>
            ) : status === 'completed' ? (
                <>
                    <FiCheckCircle size={50} color="#28a745" style={{ marginBottom: '10px', opacity: 0.3 }} />
                    <h1 className="success-text">SUCCESS</h1>
                </>
            ) : (
                <>
                    <h3 className="card-title">{title}</h3>
                    <p className="card-description">{description}</p>
                    <div className="card-buttons">
                        {status === 'started' ? (
                            <button 
                                className={`card-button complete-button ${!isMain || loading ? 'inactive' : ''}`}
                                onClick={handleComplete}
                                disabled={!isMain || loading}
                            >
                                {loading ? 'Updating...' : (
                                    <>
                                        <FiCheck style={{ marginRight: '5px' }} /> Complete
                                    </>
                                )}
                            </button>
                        ) : (
                            <>
                                <button
                                    className={`card-button start-button ${!isMain || loading ? 'inactive' : ''}`}
                                    onClick={handleStart}
                                    disabled={!isMain || loading}
                                >
                                    {loading ? 'Starting...' : (
                                        <>
                                            <FiPlay style={{ marginRight: '5px' }} /> Start
                                        </>
                                    )}
                                </button>
                                <button
                                    className={`card-button skip-button ${!isMain || loading ? 'inactive' : ''}`}
                                    onClick={handleSkip}
                                    disabled={!isMain || loading}
                                >
                                    {loading ? 'Skipping...' : (
                                        <>
                                            <FiSkipForward style={{ marginRight: '5px' }} /> Skip
                                        </>
                                    )}
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
