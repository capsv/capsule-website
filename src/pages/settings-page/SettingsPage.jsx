import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import VerificationModal from '../../components/verify-email/VerificationModal';
import { useLanguage } from '../../context/LanguageContext.jsx'; // Импортируем контекст языка
import './SettingsPage.css';

function SettingsPage() {
    const { user, logout, updateUserData, refreshAccessToken } = useAuth();
    const { language } = useLanguage(); // Получаем текущий язык из контекста языка

    const translations = {
        en: {
            settings: 'Settings',
            firstName: 'First Name',
            secondName: 'Second Name',
            age: 'Age',
            save: 'Save',
            sendVerificationCode: 'Send Verification Code',
            deleteAccount: 'Delete Account',
            updatedSuccessfully: 'Updated successfully',
            failedToUpdate: 'Failed to update',
            failedToDelete: 'Failed to delete account',
            errorOccurred: 'An error occurred',
            shouldBeBetween4And128: 'should be between 4 and 128 characters',
            shouldBeBetween1And127: 'should be between 1 and 127',
        },
        ru: {
            settings: 'Настройки',
            firstName: 'Имя',
            secondName: 'Фамилия',
            age: 'Возраст',
            save: 'Сохранить',
            sendVerificationCode: 'Отправить код подтверждения',
            deleteAccount: 'Удалить аккаунт',
            updatedSuccessfully: 'Успешно обновлено',
            failedToUpdate: 'Не удалось обновить',
            failedToDelete: 'Не удалось удалить аккаунт',
            errorOccurred: 'Произошла ошибка',
            shouldBeBetween4And128: 'должно быть от 4 до 128 символов',
            shouldBeBetween1And127: 'должно быть от 1 до 127',
        },
    };

    const t = translations[language]; // Функция для получения переводов на текущем языке

    const [formData, setFormData] = useState({
        firstName: '',
        secondName: '',
        age: '',
    });
    const [errors, setErrors] = useState({});
    const [messages, setMessages] = useState({});
    const [showVerificationModal, setShowVerificationModal] = useState(false);
    const navigate = useNavigate();

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

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const validate = (field, value) => {
        let error = '';
        if ((field === 'firstName' || field === 'secondName') && (!value.trim() || value.length < 4 || value.length > 128)) {
            error = t.shouldBeBetween4And128;
        } else if (field === 'age' && (value <= 0 || value >= 128)) {
            error = t.shouldBeBetween1And127;
        }
        return error;
    };

    const handleSubmit = async (field) => {
        const error = validate(field, formData[field]);
        if (error) {
            setErrors({ ...errors, [field]: error });
            return;
        } else {
            setErrors({ ...errors, [field]: '' });
        }

        const updatedField = { [field]: formData[field] };

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

            const result = await response.json();
            if (response.ok) {
                setMessages({ ...messages, [field]: t.updatedSuccessfully });
                updateUserData(updatedField);
            } else {
                setMessages({ ...messages, [field]: t.failedToUpdate });
            }
        } catch (error) {
            console.error('Error updating profile:', error);
            setMessages({ ...messages, [field]: t.errorOccurred });
        }
    };

    const handleDeleteAccount = async () => {
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
                setMessages({ ...messages, delete: t.failedToDelete });
            }
        } catch (error) {
            console.error('Error deleting account:', error);
            setMessages({ ...messages, delete: t.errorOccurred });
        }
    };

    return (
        <div className="settings-container">
            <h2>{t.settings}</h2>
            <div className="settings-form">
                <div className="form-group">
                    <label htmlFor="firstName">{t.firstName}</label>
                    <div className="input-container">
                        <input
                            type="text"
                            id="firstName"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleChange}
                        />
                        <button type="button" className="text-button" onClick={() => handleSubmit('firstName')}>
                            {t.save}
                        </button>
                    </div>
                    {errors.firstName && <span className="error">{errors.firstName}</span>}
                    {messages.firstName && <span className="message">{messages.firstName}</span>}
                </div>
                <div className="form-group">
                    <label htmlFor="secondName">{t.secondName}</label>
                    <div className="input-container">
                        <input
                            type="text"
                            id="secondName"
                            name="secondName"
                            value={formData.secondName}
                            onChange={handleChange}
                        />
                        <button type="button" className="text-button" onClick={() => handleSubmit('secondName')}>
                            {t.save}
                        </button>
                    </div>
                    {errors.secondName && <span className="error">{errors.secondName}</span>}
                    {messages.secondName && <span className="message">{messages.secondName}</span>}
                </div>
                <div className="form-group">
                    <label htmlFor="age">{t.age}</label>
                    <div className="input-container">
                        <input
                            type="number"
                            id="age"
                            name="age"
                            value={formData.age}
                            onChange={handleChange}
                        />
                        <button type="button" className="text-button" onClick={() => handleSubmit('age')}>
                            {t.save}
                        </button>
                    </div>
                    {errors.age && <span className="error">{errors.age}</span>}
                    {messages.age && <span className="message">{messages.age}</span>}
                </div>
                <div className="form-group">
                    <button type="button" className="verification-button" onClick={() => setShowVerificationModal(true)}>
                        {t.sendVerificationCode}
                    </button>
                </div>
                <div className="form-group">
                    <button type="button" className="delete-button" onClick={handleDeleteAccount}>
                        {t.deleteAccount}
                    </button>
                    {messages.delete && <span className="error">{messages.delete}</span>}
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
