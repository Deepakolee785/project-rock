import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './dashboard.css'; // Ensure custom styling is applied

function Dashboard() {
    const [candidates, setCandidates] = useState([]);
    const [formData, setFormData] = useState({
        full_name: '', // Match field names as expected in the backend
        middle_name: '',
        last_name: '',
        permanent_address: '', // Ensure this matches the backend's field name
        temporary_address: '',
        age: '',
        dob: '',
        blood_group: '',
    });
    const [error, setError] = useState(''); // State for error messages
    const [success, setSuccess] = useState(''); // State for success messages
    const [voterExists, setVoterExists] = useState(false); // State to check if voter exists
    const token = localStorage.getItem('accessToken'); // Authentication token

    useEffect(() => {
        fetchCandidates();
        checkVoterStatus();
    }, []);

    const fetchCandidates = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:8000/candidate/candidates/', {
                headers: { Authorization: `Bearer ${token}` },
            });
            setCandidates(response.data); // Set candidate data
            setError(''); // Clear any error message
        } catch (err) {
            setError(err.response?.data?.message || 'Error fetching candidates.');
        }
    };

    const checkVoterStatus = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:8000/voters/voters/user/', {
                headers: { Authorization: `Bearer ${token}` },
            });
            setVoterExists(response.data.length > 0); // Check if voter exists
        } catch (err) {
            setError(err.response?.data?.message || 'Error checking voter status.');
        }
    };

    const handleVote = async (id) => {
        try {
            await axios.post(
                'http://127.0.0.1:8000/votes/votes/',
                { candidate: id },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            fetchCandidates(); // Refresh the candidate list after voting
            setSuccess('Your vote has been successfully cast!');
            setError('');
        } catch (err) {
            setError(err.response?.data?.message || 'Error casting vote.');
            setSuccess('');
        }
    };

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleAddVoter = async (e) => {
        e.preventDefault();

        // Ensure all required fields are filled
        if (!formData.full_name || !formData.permanent_address || !formData.age || !formData.dob) {
            setError('Please fill in all required fields.');
            return;
        }

        try {
            await axios.post('http://127.0.0.1:8000/voters/voters/create/', formData, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setVoterExists(true); // Mark voter as registered
            setFormData({
                full_name: '',
                middle_name: '',
                last_name: '',
                permanent_address: '',
                temporary_address: '',
                age: '',
                dob: '',
                blood_group: '',
            });
            setSuccess('Voter registered successfully!');
            setError('');
        } catch (err) {
            setError(err.response?.data?.message || 'Error registering voter.');
            setSuccess('');
        }
    };

    const handleLogin = () => {
        window.location.href = '/login'; // Redirect to login page
    };

    const handleLogout = () => {
        localStorage.removeItem('accessToken'); // Remove the token
        window.location.href = '/login'; // Redirect to login page
    };

    return (
        <div className="dashboard">
            <div className="voting-section">
                <h2>Election Voting</h2>
                {voterExists ? (
                    <div className="candidate-list">
                        <h3>Vote for Your Candidate</h3>
                        <ul>
                            {candidates.map((candidate) => (
                                <li key={candidate.id}>
                                    <strong>{candidate.full_name}</strong> ({candidate.party}) - Position: {candidate.position}
                                    <button onClick={() => handleVote(candidate.candidate_id)}>Vote</button>
                                </li>
                            ))}
                        </ul>
                    </div>
                ) : (
                    <form onSubmit={handleAddVoter}>
                        <h3>Register as a Voter</h3>
                        <input type="text" name="full_name" placeholder="Full Name" value={formData.full_name} onChange={handleInputChange} required />
                        <input type="text" name="middle_name" placeholder="Middle Name" value={formData.middle_name} onChange={handleInputChange} />
                        <input type="text" name="last_name" placeholder="Last Name" value={formData.last_name} onChange={handleInputChange} />
                        <input type="text" name="permanent_address" placeholder="Permanent Address" value={formData.permanent_address} onChange={handleInputChange} required />
                        <input type="text" name="temporary_address" placeholder="Temporary Address" value={formData.temporary_address} onChange={handleInputChange} />
                        <input type="number" name="age" placeholder="Age" value={formData.age} onChange={handleInputChange} required />
                        <input type="date" name="dob" value={formData.dob} onChange={handleInputChange} required />
                        <input type="text" name="blood_group" placeholder="Blood Group" value={formData.blood_group} onChange={handleInputChange} />
                        <button type="submit">Register Voter</button>
                    </form>
                )}
                {/* Display Error or Success */}
                {error && <p className="error">{error}</p>}
                {success && <p className="success">{success}</p>}
            </div>
        </div>
    );
}

export default Dashboard;
