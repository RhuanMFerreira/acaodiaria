// frontend/scripts/api.js
const API_URL = 'http://localhost:5000/api';

export const api = {
    // Autenticação
    login: async (email, password) => {
        const response = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        return await response.json();
    },

    // Doações
    getDonations: async () => {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_URL}/donations`, {
            headers: { 'Authorization': token }
        });
        return await response.json();
    },

    createDonation: async (donationData) => {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_URL}/donations`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token
            },
            body: JSON.stringify(donationData)
        });
        return await response.json();
    },

    // Voluntários
    registerVolunteer: async (volunteerData) => {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_URL}/volunteers`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token
            },
            body: JSON.stringify(volunteerData)
        });
        return await response.json();
    }
};