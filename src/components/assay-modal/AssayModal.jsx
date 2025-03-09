import React, { useState, useEffect } from 'react';
import './AssayModal.css';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';

const AssayModal = ({ onClose }) => {
    const [assayText, setAssayText] = useState('');
    const [message, setMessage] = useState('');
    const [score, setScore] = useState(null);
    const [loading, setLoading] = useState(false);
    const [textLength, setTextLength] = useState(0);
    const { setUser } = useAuth();
    const { language } = useLanguage();
    
    // Минимальная длина текста для анализа
    const MIN_LENGTH = 30;

    // Сбрасываем сообщение об ошибке при изменении языка
    useEffect(() => {
        if (message) setMessage('');
    }, [language]);

    const handleSubmit = async () => {
        // Проверка минимальной длины текста
        if (assayText.length < MIN_LENGTH) {
            setMessage(language === 'en' 
                ? `Text is too short. Please write at least ${MIN_LENGTH} characters.` 
                : `Текст слишком короткий. Напишите не менее ${MIN_LENGTH} символов.`);
            return;
        }
        
        setLoading(true);
        setMessage('');
        const token = localStorage.getItem('accessToken');
        
        try {
            const response = await fetch('http://195.80.51.69:8080/api/v1/assays/pass', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ assay: assayText }),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => null);
                throw new Error(errorData?.message || 'Failed to submit assessment');
            }

            const result = await response.json();
            if (result?.payload && Array.isArray(result.payload) && result.payload.length > 0) {
                const score = result.payload[0].score;
                setScore(score);
            } else {
                throw new Error('Invalid response format');
            }
        } catch (error) {
            console.error('Error submitting assessment:', error);
            setMessage(language === 'en' 
                ? 'An error occurred. Please try again.' 
                : 'Произошла ошибка. Пожалуйста, попробуйте снова.');
        } finally {
            setLoading(false);
        }
    };

    const handleClose = async () => {
        if (score === null) {
            onClose();
            return;
        }
        
        setLoading(true);
        const token = localStorage.getItem('accessToken');
        
        try {
            const [authResponse, statsResponse] = await Promise.all([
                fetch('http://195.80.51.69:8080/api/v1/auth', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                }),
                fetch('http://195.80.51.69:8080/api/v1/statistics', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                }),
            ]);

            if (!authResponse.ok || !statsResponse.ok) {
                throw new Error('Failed to fetch data');
            }

            const authData = await authResponse.json();
            const statsData = await statsResponse.json();

            const userData = {
                ...authData.payload[0],
                score: statsData.score,
                completedTasks: statsData.completedTasks,
                missedTasks: statsData.missedTasks,
            };

            setUser(userData);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
            onClose();
        }
    };
    
    const handleTextChange = (e) => {
        setAssayText(e.target.value);
        setTextLength(e.target.value.length);
        
        // Очищаем сообщение об ошибке при изменении текста
        if (message) setMessage('');
    };

    // Определяем класс прогресс-бара в зависимости от длины текста
    const getProgressBarClass = () => {
        if (textLength < MIN_LENGTH) return 'too-short';
        if (textLength < MIN_LENGTH * 2) return 'acceptable';
        return 'good';
    };
    
    // Вычисляем процент заполнения (максимум 100%)
    const getProgressPercentage = () => {
        const percentage = (textLength / (MIN_LENGTH * 3)) * 100;
        return Math.min(percentage, 100);
    };

    return (
        <div className="assay-modal-overlay" onClick={handleClose}>
            <div className="assay-modal-content" onClick={(e) => e.stopPropagation()}>
                <button className="close-button" onClick={handleClose}>
                    <i className="fas fa-times"></i>
                </button>
                
                {score === null ? (
                    <>
                        <h2>{language === 'en' ? 'Self-Assessment' : 'Самооценка'}</h2>
                        <p className="modal-description">
                            {language === 'en' 
                                ? 'Please describe your current emotional and mental state in 2-3 sentences. This will help us personalize tasks for you.' 
                                : 'Опишите ваше текущее эмоциональное и психическое состояние в 2-3 предложениях. Это поможет нам подобрать персонализированные задачи.'}
                        </p>
                        
                        <div className="textarea-container">
                            <textarea
                                placeholder={language === 'en' ? "Write about how you feel..." : "Напишите о своих чувствах..."}
                                value={assayText}
                                onChange={handleTextChange}
                                disabled={loading}
                                aria-label={language === 'en' ? "Assessment text" : "Текст оценки"}
                            />
                            
                            <div className="text-length-indicator">
                                <div 
                                    className={`progress-bar ${getProgressBarClass()}`}
                                    style={{ width: `${getProgressPercentage()}%` }}
                                ></div>
                            </div>
                            
                            <div className="character-count-container">
                                <span className="character-count">
                                    {textLength}/{MIN_LENGTH} {language === 'en' ? 'characters' : 'символов'}
                                </span>
                            </div>
                            
                            {textLength < MIN_LENGTH && (
                                <p className="length-warning">
                                    {language === 'en' 
                                        ? `Please write at least ${MIN_LENGTH} characters.` 
                                        : `Пожалуйста, напишите не менее ${MIN_LENGTH} символов.`}
                                </p>
                            )}
                        </div>
                        
                        {message && <p className="message-text">{message}</p>}
                        
                        <div className="modal-buttons">
                            <button 
                                className="primary-button" 
                                onClick={handleSubmit}
                                disabled={loading || textLength < MIN_LENGTH}
                            >
                                {loading ? (
                                    <><span className="spinner"></span> {language === 'en' ? 'Processing...' : 'Обработка...'}</>
                                ) : (
                                    language === 'en' ? 'Submit Assessment' : 'Отправить оценку'
                                )}
                            </button>
                            <button 
                                className="secondary-button" 
                                onClick={handleClose}
                                disabled={loading}
                            >
                                {language === 'en' ? 'Cancel' : 'Отмена'}
                            </button>
                        </div>
                    </>
                ) : (
                    <div className="results-container">
                        <h2>{language === 'en' ? 'Assessment Results' : 'Результаты оценки'}</h2>
                        
                        <div className="score-display">
                            <div className="score-circle">
                                <span className="score-number">{score}</span>
                            </div>
                            <p className="score-label">
                                {language === 'en' ? 'Anxiety Score' : 'Уровень тревожности'}
                            </p>
                        </div>
                        
                        <p className="results-description">
                            {language === 'en' 
                                ? 'Based on your assessment, we have created personalized tasks to help you reduce anxiety and improve wellbeing.' 
                                : 'На основе вашей оценки мы создали персонализированные задачи, которые помогут снизить тревожность и улучшить самочувствие.'}
                        </p>
                        
                        <button 
                            className="primary-button full-width" 
                            onClick={handleClose}
                            disabled={loading}
                        >
                            {loading ? (
                                <><span className="spinner"></span> {language === 'en' ? 'Loading...' : 'Загрузка...'}</>
                            ) : (
                                language === 'en' ? 'View Your Tasks' : 'Смотреть задачи'
                            )}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AssayModal;
