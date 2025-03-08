import React, { useState, useEffect, useCallback, useRef, memo } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import VerificationModal from '../../components/verify-email/VerificationModal';
import { useLanguage } from '../../context/LanguageContext.jsx';
import { translations } from '../../translations/index.js';
import './SettingsPage.css';

// Компонент поля ввода вынесен за пределы основного компонента и мемоизирован
const InputField = memo(({ id, label, type = 'text', value, onChange, onSubmit, isLoading, error, message, saveText }) => (
    <div className="form-group">
        <label htmlFor={id}>{label}</label>
        <div className="input-container">
            <input
                type={type}
                id={id}
                name={id}
                value={value}
                onChange={onChange}
                disabled={isLoading}
            />
            <button 
                type="button" 
                className="text-button" 
                onClick={onSubmit}
                disabled={isLoading}
            >
                {isLoading ? (
                    <span className="loading-spinner">...</span>
                ) : saveText}
            </button>
        </div>
        {error && <span className="error">{error}</span>}
        {message && <span className="message">{message}</span>}
    </div>
));

function SettingsPage() {
    const { user, logout, updateUserData, refreshAccessToken } = useAuth();
    const { language } = useLanguage();
    const t = translations.settings[language] || translations.settings.ru;
    
    const [formData, setFormData] = useState({
        firstName: '',
        secondName: '',
        age: '',
    });
    const [errors, setErrors] = useState({});
    const [messages, setMessages] = useState({});
    const [showVerificationModal, setShowVerificationModal] = useState(false);
    const [isLoading, setIsLoading] = useState({});
    const navigate = useNavigate();

    // Загрузка данных пользователя
    useEffect(() => {
        const fetchUserData = async (token) => {
            try {
                const response = await fetch('http://195.80.51.69:8080/api/v1/users', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });

                if (response.status === 401) {
                    const refreshToken = localStorage.getItem('refreshToken');
                    if (refreshToken) {
                        try {
                            const { newAccessToken } = await refreshAccessToken(refreshToken);
                            localStorage.setItem('accessToken', newAccessToken);
                            await fetchUserData(newAccessToken);
                            return;
                        } catch {
                            logout();
                        }
                    } else {
                        logout();
                    }
                } else if (!response.ok) {
                    throw new Error('Failed to fetch user data');
                } else {
                    const result = await response.json();
                    const userData = result.payload[0];
                    setFormData({
                        firstName: userData.firstName || '',
                        secondName: userData.secondName || '',
                        age: userData.age || '',
                    });
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
                navigate('/');
            }
        };

        const accessToken = localStorage.getItem('accessToken');
        if (accessToken) {
            fetchUserData(accessToken);
        } else {
            navigate('/');
        }
    }, [navigate, logout, refreshAccessToken]);

    // Обработчики формы - мемоизируем для предотвращения потери фокуса
    const handleChange = useCallback((e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
        }));
        
        // Очищаем сообщения при изменении
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
        if (messages[name]) {
            setMessages(prev => ({ ...prev, [name]: '' }));
        }
    }, [errors, messages]);

    const validate = useCallback((field, value) => {
        let error = '';
        if ((field === 'firstName' || field === 'secondName') && (!value.trim() || value.length < 4 || value.length > 128)) {
            error = t.shouldBeBetween4And128;
        } else if (field === 'age' && (value <= 0 || value >= 128)) {
            error = t.shouldBeBetween1And127;
        }
        return error;
    }, [t]);

    const handleSubmit = useCallback((field) => {
        const error = validate(field, formData[field]);
        if (error) {
            setErrors(prev => ({ ...prev, [field]: error }));
            return;
        }

        setIsLoading(prev => ({ ...prev, [field]: true }));
        const updatedField = { [field]: formData[field] };

        const submitData = async () => {
            try {
                const token = localStorage.getItem('accessToken');
                const response = await fetch(`http://195.80.51.69:8080/api/v1/users`, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                    body: JSON.stringify(updatedField),
                });

                if (response.ok) {
                    setMessages(prev => ({ ...prev, [field]: t.updatedSuccessfully }));
                    updateUserData(updatedField);
                    
                    // Автоматически очищаем сообщение через 3 секунды
                    setTimeout(() => {
                        setMessages(prev => ({ ...prev, [field]: '' }));
                    }, 3000);
                } else {
                    setMessages(prev => ({ ...prev, [field]: t.failedToUpdate }));
                }
            } catch (error) {
                console.error('Error updating profile:', error);
                setMessages(prev => ({ ...prev, [field]: t.errorOccurred }));
            } finally {
                setIsLoading(prev => ({ ...prev, [field]: false }));
            }
        };

        submitData();
    }, [formData, validate, t, updateUserData]);

    const handleDeleteAccount = useCallback(async () => {
        if (!window.confirm(t.confirmDeleteAccount)) {
            return;
        }
        
        setIsLoading(prev => ({ ...prev, delete: true }));
        
        try {
            const token = localStorage.getItem('accessToken');
            const response = await fetch(`http://195.80.51.69:8080/api/v1/users`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (response.ok) {
                logout();
                navigate('/');
            } else {
                setMessages(prev => ({ ...prev, delete: t.failedToDelete }));
            }
        } catch (error) {
            console.error('Error deleting account:', error);
            setMessages(prev => ({ ...prev, delete: t.errorOccurred }));
        } finally {
            setIsLoading(prev => ({ ...prev, delete: false }));
        }
    }, [t, logout, navigate]);

    return (
        <div className="settings-container">
            <h2>{t.settings}</h2>
            <div className="settings-form">
                <div className="profile-section">
                    <h3>{t.profileInfo}</h3>
                    
                    <InputField
                        id="firstName"
                        label={t.firstName}
                        value={formData.firstName}
                        onChange={handleChange}
                        onSubmit={() => handleSubmit('firstName')}
                        isLoading={isLoading.firstName}
                        error={errors.firstName}
                        message={messages.firstName}
                        saveText={t.save}
                    />
                    
                    <InputField
                        id="secondName"
                        label={t.secondName}
                        value={formData.secondName}
                        onChange={handleChange}
                        onSubmit={() => handleSubmit('secondName')}
                        isLoading={isLoading.secondName}
                        error={errors.secondName}
                        message={messages.secondName}
                        saveText={t.save}
                    />
                    
                    <InputField
                        id="age"
                        label={t.age}
                        type="number"
                        value={formData.age}
                        onChange={handleChange}
                        onSubmit={() => handleSubmit('age')}
                        isLoading={isLoading.age}
                        error={errors.age}
                        message={messages.age}
                        saveText={t.save}
                    />
                </div>
                
                <div className="action-buttons">
                    <div className="form-group">
                        <button 
                            type="button" 
                            className="verification-button" 
                            onClick={() => setShowVerificationModal(true)}
                        >
                            {t.sendVerificationCode}
                        </button>
                    </div>
                    
                    <div className="form-group">
                        <button 
                            type="button" 
                            className="delete-button" 
                            onClick={handleDeleteAccount}
                            disabled={isLoading.delete}
                        >
                            {isLoading.delete ? 
                                <span className="loading-spinner">...</span> : 
                                t.deleteAccount
                            }
                        </button>
                        {messages.delete && <span className="error">{messages.delete}</span>}
                    </div>
                </div>
            </div>
            
            {showVerificationModal && (
                <VerificationModal
                    user={user}
                    onClose={() => setShowVerificationModal(false)}
                />
            )}
        </div>
    );
}

export default SettingsPage;
