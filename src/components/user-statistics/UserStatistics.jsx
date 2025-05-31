import React from 'react';
import { useLocalization } from '../../hooks/useLocalization';
import './UserStatistics.css';

function UserStatistics({ statistics }) {
    const { t } = useLocalization();

    return (
        <div className="statistics-container">
            <h3 className="statistics-header">{t('userPage.statistics')}</h3>
            <div className="statistics-metrics">
                <div className="statistics-metric">
                    <i className="fas fa-star"></i>
                    <div className="metric-info">
                        <span className="metric-value">{statistics?.score || 0}</span>
                        <span className="metric-label">{t('userPage.totalScore')}</span>
                    </div>
                </div>
                <div className="statistics-metric">
                    <i className="fas fa-check-circle"></i>
                    <div className="metric-info">
                        <span className="metric-value">{statistics?.completedTasks || 0}</span>
                        <span className="metric-label">{t('userPage.completed')}</span>
                    </div>
                </div>
                <div className="statistics-metric">
                    <i className="fas fa-times-circle"></i>
                    <div className="metric-info">
                        <span className="metric-value">{statistics?.missedTasks || 0}</span>
                        <span className="metric-label">{t('userPage.missed')}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default UserStatistics; 