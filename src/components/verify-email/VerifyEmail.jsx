import React, { useState } from 'react';
import './VerifyEmail.css';

const VerifyEmail = ({ email, username, onVerify }) => {
    const [showPopup, setShowPopup] = useState(false);
    const [verificationCode, setVerificationCode] = useState('');
    const [isCodeSent, setIsCodeSent] = useState(false);

    const handleSendCode = async () => {
        try {
            const token = localStorage.getItem('accessToken');
            const response = await fetch('http://localhost:8080/api/v1/email/verify/request', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ username, email }),
            });

            if (response.ok) {
                setIsCodeSent(true);
            } else {
                console.error('Failed to send verification code');
            }
        } catch (error) {
            console.error('Error sending verification code:', error);
        }
    };

    const handleVerifyCode = async () => {
        try {
            const token = localStorage.getItem('accessToken');
            const response = await fetch('http://localhost:8080/api/v1/email/verify/confirm', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ username, code: verificationCode }),
            });

            if (response.ok) {
                onVerify();
                setShowPopup(false);
            } else {
                console.error('Failed to verify code');
            }
        } catch (error) {
            console.error('Error verifying code:', error);
        }
    };

    return (
        <div className="verify-email">
            <button className="verification-button" onClick={() => setShowPopup(true)}>
                Send Verification Code
            </button>

            {showPopup && (
                <div className="popup">
                    <div className="popup-content">
                        <p>A verification code will be sent to {email}.</p>
                        <button className="popup-button" onClick={handleSendCode}>OK</button>
                        <button className="popup-button" onClick={() => setShowPopup(false)}>Cancel</button>

                        {isCodeSent && (
                            <>
                                <input
                                    type="text"
                                    placeholder="Enter verification code"
                                    value={verificationCode}
                                    onChange={(e) => setVerificationCode(e.target.value)}
                                />
                                <button className="verification-button" onClick={handleVerifyCode}>
                                    Verify Email
                                </button>
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default VerifyEmail;
