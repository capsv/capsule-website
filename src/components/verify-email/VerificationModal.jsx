import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import './VerificationModal.css';

const VerificationModal = ({ user, onClose }) => {
    const { setUserData } = useAuth();
    const [step, setStep] = useState('confirm');
    const [verificationCode, setVerificationCode] = useState('');
    const [message, setMessage] = useState('');

    const handleSendVerificationCode = async () => {
        try {
            const token = localStorage.getItem('accessToken');
            const response = await fetch('http://localhost:8080/api/v1/email/verify/request', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ username: user.username, email: user.email }),
            });

            if (response.ok) {
                setStep('verify');
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
            const response = await fetch('http://localhost:8080/api/v1/email/verify/confirm', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ username: user.username, code: verificationCode }),
            });

            if (response.ok) {
                const updatedUserData = { ...user, confirm: true };
                setUserData(updatedUserData);
                localStorage.setItem('userData', JSON.stringify(updatedUserData));
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
                        <button onClick={onClose} className="close-button">Close</button>
                    </>
                )}
                {message && <p>{message}</p>}
            </div>
        </div>
    );
};

export default VerificationModal;
