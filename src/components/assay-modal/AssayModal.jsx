import React, {useState} from 'react';
import './AssayModal.css';

const AssayModal = ({onClose}) => {
    const [assayText, setAssayText] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async () => {
        const token = localStorage.getItem('accessToken');
        try {
            const response = await fetch('http://localhost:8080/api/v1/assays/pass', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({assay: assayText}),
            });

            if (!response.ok) {
                throw new Error('Failed to submit assay');
            }

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
                    placeholder="Write something..."
                    value={assayText}
                    onChange={(e) => setAssayText(e.target.value)}
                />
                {message && <p>{message}</p>}
                <button onClick={handleSubmit}>Submit</button>
                <button onClick={onClose}>Close</button>
            </div>
        </div>
    );
};

export default AssayModal;
