import React, { useState } from 'react';
import './AssayModal.css';
import { useAuth } from '../../context/AuthContext';

const AssayModal = ({ onClose }) => {
    const [assayText, setAssayText] = useState('');
    const [message, setMessage] = useState('');
    const [score, setScore] = useState(null);
    const { setUser } = useAuth();

    const handleSubmit = async () => {
        const token = localStorage.getItem('accessToken');
        try {
            const response = await fetch('http://localhost:8080/api/v1/assays/pass', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ assay: assayText }),
            });

            if (!response.ok) {
                throw new Error('Failed to submit assay');
            }

            const result = await response.json();
            const score = result.payload[0].score;
            setScore(score);

        } catch (error) {
            console.error('Error submitting assay:', error);
            setMessage('An error occurred.');
        }
    };

    const handleClose = async () => {
        const token = localStorage.getItem('accessToken');
        try {
            const [authResponse, statsResponse] = await Promise.all([
                fetch('http://localhost:8080/api/v1/auth', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                }),
                fetch('http://localhost:8080/api/v1/statistics', {
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
            onClose();
        }
    };

    return (
        <div className="assay-modal">
            <div className="assay-modal-content">
                {score === null ? (
                    <>
                        <h3>Write 2-3 sentences about your condition</h3>
                        <textarea
                            placeholder="Write something..."
                            value={assayText}
                            onChange={(e) => setAssayText(e.target.value)}
                        />
                        {message && <p>{message}</p>}
                        <button onClick={handleSubmit}>Submit</button>
                        <button onClick={onClose}>Close</button>
                    </>
                ) : (
                    <>
                        <h3>Congratulations, your score is {score}</h3>
                        <button onClick={handleClose}>Close</button>
                    </>
                )}
            </div>
        </div>
    );
};

export default AssayModal;
