import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import './VerificationModal.css';

const VerificationModal = ({ user, onClose }) => {
    const { setUserData } = useAuth();
    const [step, setStep] = useState('confirm');
    const [verificationCode, setVerificationCode] = useState('');
    const [message, setMessage] = useState('');
    const [timer, setTimer] = useState(120);

    useEffect(() => {
        let interval;
        if (step === 'verify' && timer > 0) {
            interval = setInterval(() => {
                setTimer(prevTimer => prevTimer - 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [step, timer]);

    useEffect(() => {
        if (timer === 0) {
            setMessage('Time expired. Please request a new verification code.');
            setStep('confirm');
        }
    }, [timer]);

    const handleSendVerificationCode = async () => {
        try {
            const token = localStorage.getItem('accessToken');
            const response = await fetch('http://195.80.51.69:8080/api/v1/verifications/request', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ email: user.email }),
            });

            if (response.ok) {
                setStep('verify');
                setTimer(120); // Сбросить таймер на 2 минуты
            } else {
                setMessage('Failed to send verification code.');
            }
        } catch (error) {
            console.error('Error sending verification code:', error);
            setMessage('An error occurred.');
        }
    };

    const handleVerifyEmail = async () => {
        try {
            const token = localStorage.getItem('accessToken');
            const response = await fetch('http://195.80.51.69:8080/api/v1/verifications/confirm', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ code: verificationCode }),
            });

            if (response.ok) {
                setMessage('Email verified successfully.');
            } else {
                setMessage('Failed to verify email.');
            }
        } catch (error) {
            console.error('Error verifying email:', error);
            setMessage('An error occurred.');
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                {step === 'confirm' && (
                    <>
                        <p>A verification code will be sent to {user.email}.</p>
                        <button onClick={handleSendVerificationCode} className="confirm-button">OK</button>
                        <button onClick={onClose} className="cancel-button">Cancel</button>
                    </>
                )}
                {step === 'verify' && (
                    <>
                        <input
                            type="text"
                            placeholder="Enter verification code"
                            value={verificationCode}
                            onChange={(e) => setVerificationCode(e.target.value)}
                        />
                        <button onClick={handleVerifyEmail} className="verify-button">Verify Email</button>
                        <p>Time remaining: {Math.floor(timer / 60)}:{timer % 60 < 10 ? `0${timer % 60}` : timer % 60}</p>
                        <button onClick={onClose} className="close-button">Close</button>
                    </>
                )}
                {message && <p>{message}</p>}
            </div>
        </div>
    );
};

export default VerificationModal;
