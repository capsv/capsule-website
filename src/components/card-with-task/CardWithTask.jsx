import React, { useState, useEffect } from 'react';
import { FiLock, FiCheck, FiSkipForward, FiPlay, FiCheckCircle, FiXCircle } from 'react-icons/fi';
import './CardWithTask.css';
import { useLocalization } from '../../hooks/useLocalization';

const CardWithTask = ({ title, description, className, assay, taskId, token, initialStatus }) => {
    const [status, setStatus] = useState('initial');
    const [loading, setLoading] = useState(false);
    const [actionPerformed, setActionPerformed] = useState(false);
    const isMain = className === 'card-main';
    const { t } = useLocalization();

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
                    <h3 className="locked-title">{t('cardWithTask.passTestToUnlock')}</h3>
                    <button 
                        className={`take-test-btn ${!isMain ? 'inactive' : ''}`}
                        onClick={handleOpenAssayModal}
                        disabled={!isMain}
                    >
                        {t('cardWithTask.passTest')}
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
                    <h1 className="skipped-text">{t('cardWithTask.skipped')}</h1>
                </>
            ) : status === 'completed' ? (
                <>
                    <FiCheckCircle size={50} color="#28a745" style={{ marginBottom: '10px', opacity: 0.3 }} />
                    <h1 className="success-text">{t('cardWithTask.success')}</h1>
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
                                {loading ? t('cardWithTask.updating') : (
                                    <>
                                        <FiCheck style={{ marginRight: '5px' }} /> {t('cardWithTask.complete')}
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
                                    {loading ? t('cardWithTask.starting') : (
                                        <>
                                            <FiPlay style={{ marginRight: '5px' }} /> {t('cardWithTask.start')}
                                        </>
                                    )}
                                </button>
                                <button
                                    className={`card-button skip-button ${!isMain || loading ? 'inactive' : ''}`}
                                    onClick={handleSkip}
                                    disabled={!isMain || loading}
                                >
                                    {loading ? t('cardWithTask.skipping') : (
                                        <>
                                            <FiSkipForward style={{ marginRight: '5px' }} /> {t('cardWithTask.skip')}
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
