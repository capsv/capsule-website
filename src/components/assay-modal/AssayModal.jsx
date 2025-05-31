import React, { useState, useEffect } from 'react';
import './AssayModal.css';
import { useAuth } from '../../context/AuthContext';
import { useLocalization } from '../../hooks/useLocalization';

const AssayModal = ({ onClose }) => {
    const [answers, setAnswers] = useState({});
    const [currentPage, setCurrentPage] = useState(0);
    const [score, setScore] = useState(null);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const { setUser } = useAuth();
    const { t } = useLocalization();
    
    const QUESTIONS_PER_PAGE = 6;
    const TOTAL_QUESTIONS = 24;
    const TOTAL_PAGES = Math.ceil(TOTAL_QUESTIONS / QUESTIONS_PER_PAGE);

    // Получаем вопросы для текущей страницы
    const getCurrentPageQuestions = () => {
        const startIndex = currentPage * QUESTIONS_PER_PAGE;
        const endIndex = Math.min(startIndex + QUESTIONS_PER_PAGE, TOTAL_QUESTIONS);
        return Array.from({ length: endIndex - startIndex }, (_, i) => startIndex + i);
    };

    // Проверяем, заполнены ли все ответы на текущей странице
    const isCurrentPageComplete = () => {
        const pageQuestions = getCurrentPageQuestions();
        return pageQuestions.every(questionIndex => 
            answers[questionIndex] && 
            answers[questionIndex].fear !== undefined && 
            answers[questionIndex].avoidance !== undefined
        );
    };

    // Проверяем, заполнены ли все ответы во всем тесте
    const isTestComplete = () => {
        for (let i = 0; i < TOTAL_QUESTIONS; i++) {
            if (!answers[i] || answers[i].fear === undefined || answers[i].avoidance === undefined) {
                return false;
            }
        }
        return true;
    };

    // Вычисляем прогресс
    const getProgress = () => {
        let answeredCount = 0;
        for (let i = 0; i < TOTAL_QUESTIONS; i++) {
            if (answers[i] && answers[i].fear !== undefined && answers[i].avoidance !== undefined) {
                answeredCount++;
            }
        }
        return (answeredCount / TOTAL_QUESTIONS) * 100;
    };

    // Обработка изменения ответа
    const handleAnswerChange = (questionIndex, type, value) => {
        setAnswers(prev => ({
            ...prev,
            [questionIndex]: {
                ...prev[questionIndex],
                [type]: parseInt(value)
            }
        }));
    };

    // Переход к следующей странице
    const handleNext = () => {
        if (currentPage < TOTAL_PAGES - 1) {
            setCurrentPage(prev => prev + 1);
        }
    };

    // Переход к предыдущей странице
    const handleBack = () => {
        if (currentPage > 0) {
            setCurrentPage(prev => prev - 1);
        }
    };

    // Отправка теста
    const handleSubmit = async () => {
        if (!isTestComplete()) {
            setMessage(t('lsas.processing'));
            return;
        }
        
        setLoading(true);
        setMessage('');
        const token = localStorage.getItem('accessToken');
        
        // Формируем текст ответов для отправки на сервер
        let assayText = 'LSAS Results:\n';
        for (let i = 0; i < TOTAL_QUESTIONS; i++) {
            const question = t(`lsas.questions.${i}`);
            const fear = answers[i]?.fear || 0;
            const avoidance = answers[i]?.avoidance || 0;
            assayText += `${i + 1}. ${question} - Fear: ${fear}, Avoidance: ${avoidance}\n`;
        }
        
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
            setMessage(t('lsas.processing'));
        } finally {
            setLoading(false);
        }
    };

    // Закрытие модального окна
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

    return (
        <div className="assay-modal-overlay" onClick={handleClose}>
            <div className="assay-modal-content" onClick={(e) => e.stopPropagation()}>
                <button className="close-button" onClick={handleClose}>
                    <i className="fas fa-times"></i>
                </button>
                
                {score === null ? (
                    <div className="lsas-container">
                        <div className="lsas-header">
                            <h2>{t('lsas.title')}</h2>
                            <p className="modal-description">{t('lsas.description')}</p>
                        </div>

                        {/* Прогресс-бар */}
                        <div className="progress-container">
                            <div className="progress-label">
                                <span>{t('lsas.progress')}</span>
                                <span>{Math.round(getProgress())}%</span>
                            </div>
                            <div className="progress-bar-container">
                                <div 
                                    className="progress-bar-fill" 
                                    style={{ width: `${getProgress()}%` }}
                                ></div>
                            </div>
                        </div>

                        {/* Индикатор страницы */}
                        <div className="page-indicator">
                            Страница {currentPage + 1} из {TOTAL_PAGES}
                        </div>

                        {/* Вопросы текущей страницы */}
                        <div className="questions-container">
                            {getCurrentPageQuestions().map(questionIndex => (
                                <div key={questionIndex} className="question-item">
                                    <div className="question-text">
                                        {questionIndex + 1}. {t(`lsas.questions.${questionIndex}`)}
                                    </div>
                                    <div className="rating-containers">
                                        {/* Оценка страха */}
                                        <div className="rating-container">
                                            <label className="rating-label">{t('lsas.fearLabel')}</label>
                                            <select
                                                className={`rating-select ${answers[questionIndex]?.fear !== undefined ? 'answered' : ''}`}
                                                value={answers[questionIndex]?.fear || ''}
                                                onChange={(e) => handleAnswerChange(questionIndex, 'fear', e.target.value)}
                                            >
                                                <option value="">{t('lsas.selectOption')}</option>
                                                {t('lsas.fearOptions').map((option, index) => (
                                                    <option key={index} value={index}>{option}</option>
                                                ))}
                                            </select>
                                        </div>
                                        
                                        {/* Оценка избегания */}
                                        <div className="rating-container">
                                            <label className="rating-label">{t('lsas.avoidanceLabel')}</label>
                                            <select
                                                className={`rating-select ${answers[questionIndex]?.avoidance !== undefined ? 'answered' : ''}`}
                                                value={answers[questionIndex]?.avoidance || ''}
                                                onChange={(e) => handleAnswerChange(questionIndex, 'avoidance', e.target.value)}
                                            >
                                                <option value="">{t('lsas.selectOption')}</option>
                                                {t('lsas.avoidanceOptions').map((option, index) => (
                                                    <option key={index} value={index}>{option}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {message && <p className="message-text">{message}</p>}

                        {/* Навигация */}
                        <div className="navigation-buttons">
                            <button 
                                className="nav-button back" 
                                onClick={handleBack}
                                disabled={currentPage === 0}
                            >
                                {t('lsas.back')}
                            </button>
                            
                            {currentPage === TOTAL_PAGES - 1 ? (
                                <button 
                                    className="nav-button complete" 
                                    onClick={handleSubmit}
                                    disabled={loading || !isTestComplete()}
                                >
                                    {loading ? (
                                        <><span className="spinner"></span> {t('lsas.processing')}</>
                                    ) : (
                                        t('lsas.complete')
                                    )}
                                </button>
                            ) : (
                                <button 
                                    className="nav-button next" 
                                    onClick={handleNext}
                                    disabled={!isCurrentPageComplete()}
                                >
                                    {t('lsas.next')}
                                </button>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="results-container">
                        <h2>{t('lsas.resultsTitle')}</h2>
                        
                        <div className="score-display">
                            <div className="score-circle">
                                <span className="score-number">{score}</span>
                            </div>
                            <p className="score-label">{t('lsas.anxietyScore')}</p>
                        </div>
                        
                        <p className="results-description">{t('lsas.resultsDescription')}</p>
                        
                        <button 
                            className="primary-button full-width" 
                            onClick={handleClose}
                            disabled={loading}
                        >
                            {loading ? (
                                <><span className="spinner"></span> {t('lsas.loading')}</>
                            ) : (
                                t('lsas.viewTasks')
                            )}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AssayModal;
