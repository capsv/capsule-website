import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import './AssayModal.css';

const AssayModal = ({ onClose, user }) => {
    const { login } = useAuth();
    const [assayText, setAssayText] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async () => {
        const token = localStorage.getItem('accessToken');
        try {
            // Отправка анализа
            const response = await fetch('http://localhost:8080/api/v1/assays/pass', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ username: user.username, assay: assayText }),
            });

            if (!response.ok) {
                throw new Error('Failed to submit assay');
            }

            const result = await response.json();
            const score = result.payload[0].score;

            // Сохранение оценки в localStorage
            const userData = JSON.parse(localStorage.getItem('userData'));
            userData.score = score;
            userData.assay = true; // Обновляем значение assay на true
            localStorage.setItem('userData', JSON.stringify(userData));

            setMessage('Assay submitted successfully!');

            // Обновление токенов
            const authTokenResponse = await fetch('http://localhost:8080/api/v1/auth/token/authenticate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ token: localStorage.getItem('refreshToken') }),
            });

            if (!authTokenResponse.ok) {
                throw new Error('Failed to authenticate token');
            }

            const authTokenResult = await authTokenResponse.json();
            const { access, refresh, data } = authTokenResult.payload[0];

            // Сохранение новых токенов и данных пользователя
            localStorage.setItem('accessToken', access.token);
            localStorage.setItem('refreshToken', refresh.token);
            login(data);

            onClose();
        } catch (error) {
            console.error('Error submitting assay:', error);
            setMessage('An error occurred.');
        }
    };

    return (
        <div className="assay-modal">
            <div className="assay-modal-content">
                <h3>Write 2-3 sentences about your condition</h3>
                <textarea
                    value={assayText}
                    onChange={(e) => setAssayText(e.target.value)}
                />
                <button onClick={handleSubmit}>Submit</button>
                {message && <p>{message}</p>}
                <button onClick={onClose}>Close</button>
            </div>
        </div>
    );
};

export default AssayModal;
