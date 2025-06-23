// frontend/scripts/script.js
import { api } from './api.js';

// Seus dados atuais continuam...
const services = [/*...*/];
const stats = [/*...*/];
const donationMethods = [/*...*/];

// Modifique a função de formulário de voluntário
async function setupVolunteerForm() {
    const form = document.getElementById('volunteer-form');
    
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const formData = new FormData(form);
        const volunteerData = {
            name: formData.get('name'),
            email: formData.get('email'),
            availability: formData.get('availability'),
            skills: formData.get('skills')
        };

        try {
            const response = await api.registerVolunteer(volunteerData);
            alert('Cadastro realizado com sucesso!');
            form.reset();
        } catch (error) {
            alert('Erro ao cadastrar. Tente novamente.');
        }
    });
}

// Modifique a função de carregamento de doações
async function loadDonationMethods() {
    const container = document.getElementById('donation-container');
    try {
        const donations = await api.getDonations();
        let html = '';
        
        donations.forEach(method => {
            html += `
                <div class="service-card">
                    <h3>${method.title}</h3>
                    <p>${method.description}</p>
                    <p class="details">${method.details}</p>
                </div>
            `;
        });
        
        container.innerHTML = html;
    } catch (error) {
        // Fallback para dados estáticos
        container.innerHTML = donationMethods.map(method => `
            <div class="service-card">
                <h3>${method.title}</h3>
                <p>${method.description}</p>
                <p class="details">${method.details}</p>
            </div>
        `).join('');
    }
}

// O resto do seu código continua igual...