// script.js
import { api } from './api.js';

// Dados de fallback
const fallbackServices = [
    {
        name: "Distribuição de Marmitas",
        description: "Entrega diária de refeições para pessoas em situação de rua"
    },
    {
        name: "Cestas Básicas",
        description: "Distribuição mensal de alimentos para famílias em vulnerabilidade"
    },
    {
        name: "Apoio Social",
        description: "Auxílio em documentação e encaminhamento para serviços sociais"
    }
];

const fallbackStats = [
    { value: "600+", label: "Marmitas/Mês" },
    { value: "30+", label: "Famílias Atendidas" },
    { value: "50+", label: "Crianças Beneficiadas" }
];

const donationMethods = [
    {
        title: "PIX",
        description: "Faça uma doação via PIX",
        details: "Chave PIX: CNPJ 50.998.279/0001-12"
    },
    {
        title: "Doação de Alimentos",
        description: "Doe alimentos não perecíveis",
        details: "Entre em contato para combinar a entrega"
    },
    {
        title: "Doação de Roupas",
        description: "Doe roupas em bom estado para pessoas necessitadas",
        details: "Ponto de coleta: Entre em contato via WhatsApp (61) 98578-0653"
    }
];

// Inicialização
document.addEventListener('DOMContentLoaded', async () => {
    console.log('Iniciando carregamento...');
    try {
        await loadServices();
        await loadStats();
        setupVolunteerForm();
        loadDonationMethods();
        setupDarkMode();
        setupScrollAnimation();
        updateYear();
        initializeAnimations(); // Nova função adicionada
        console.log('Carregamento concluído!');
    } catch (error) {
        console.error('Erro na inicialização:', error);
        handleInitializationError();
    }
});

// Função de animações iniciais
function initializeAnimations() {
    anime({
        targets: '.hero-content',
        opacity: [0, 1],
        translateY: [50, 0],
        duration: 1000,
        easing: 'easeOutQuad'
    });

    anime({
        targets: '.service-card',
        opacity: [0, 1],
        translateY: [50, 0],
        delay: anime.stagger(100),
        duration: 800,
        easing: 'easeOutQuad'
    });

    // Animação para os stats
    anime({
        targets: '.stat-item',
        scale: [0.5, 1],
        opacity: [0, 1],
        delay: anime.stagger(200),
        duration: 1500,
        easing: 'spring(1, 80, 10, 0)'
    });
}

// Funções principais
async function loadServices() {
    const container = document.getElementById('services-container');
    if (!container) {
        console.error('Container de serviços não encontrado');
        return;
    }

    try {
        const services = await api.getServices();
        renderServices(services.length > 0 ? services : fallbackServices);
    } catch (error) {
        console.error('Erro ao carregar serviços:', error);
        renderServices(fallbackServices);
    }
}

async function loadStats() {
    const container = document.getElementById('stats-container');
    if (!container) {
        console.error('Container de estatísticas não encontrado');
        return;
    }

    try {
        const stats = await api.getStats();
        renderStats(stats.length > 0 ? stats : fallbackStats);
    } catch (error) {
        console.error('Erro ao carregar estatísticas:', error);
        renderStats(fallbackStats);
    }
}
// Funções de renderização
function renderServices(services) {
    const container = document.getElementById('services-container');
    if (!container) return;
    
    container.innerHTML = services.map(service => `
        <div class="service-card" data-aos="fade-up">
            <h3><i class="fas fa-hands-helping"></i> ${service.name}</h3>
            <p>${service.description}</p>
            ${service.image_url ? `<img src="${service.image_url}" alt="${service.name}">` : ''}
        </div>
    `).join('');
}

function renderStats(stats) {
    const container = document.getElementById('stats-container');
    if (!container) return;

    container.innerHTML = stats.map(stat => `
        <div class="stat-item" data-aos="fade-up">
            <div class="stat-number">${stat.value}</div>
            <div class="stat-label">${stat.label}</div>
        </div>
    `).join('');
}

function setupVolunteerForm() {
    const form = document.getElementById('volunteer-form');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = {
            name: form.querySelector('input[type="text"]').value,
            email: form.querySelector('input[type="email"]').value,
            message: form.querySelector('textarea').value
        };

        try {
            await api.registerVolunteer(formData);
            showNotification('Obrigado por se voluntariar! Entraremos em contato.', 'success');
            form.reset();
        } catch (error) {
            showNotification('Erro ao enviar formulário. Tente novamente.', 'error');
        }
    });
}

async function loadDonationMethods() {
    const container = document.getElementById('donation-container');
    if (!container) return;

    try {
        renderDonationMethods(donationMethods);
    } catch (error) {
        console.warn('Erro ao carregar doações:', error);
    }
}

function renderDonationMethods(methods) {
    const container = document.getElementById('donation-container');
    const html = methods.map(method => `
        <div class="donation-card glass-card" data-aos="fade-up">
            <h3><i class="fas fa-hand-holding-heart"></i> ${method.title}</h3>
            <p>${method.description}</p>
            <div class="donation-details">
                <p class="details">${method.details}</p>
            </div>
        </div>
    `).join('');

    container.innerHTML = html;

    anime({
        targets: '.donation-card',
        opacity: [0, 1],
        translateY: [20, 0],
        delay: anime.stagger(100),
        duration: 800,
        easing: 'easeOutExpo'
    });
}

function setupDarkMode() {
    const darkModeToggle = document.createElement('button');
    darkModeToggle.innerHTML = '<i class="fas fa-moon"></i>';
    darkModeToggle.className = 'dark-mode-toggle';
    document.body.appendChild(darkModeToggle);

    const isDarkMode = localStorage.getItem('darkMode') === 'true';
    if (isDarkMode) {
        document.body.classList.add('dark-mode');
        darkModeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    }

    darkModeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        const isDark = document.body.classList.contains('dark-mode');
        darkModeToggle.innerHTML = isDark ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
        localStorage.setItem('darkMode', isDark);
    });
}

function setupScrollAnimation() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('aos-animate');
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('[data-aos]').forEach(element => {
        observer.observe(element);
    });
}

function updateYear() {
    const yearElement = document.getElementById('current-year');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }
}

window.copyToClipboard = function(text) {
    navigator.clipboard.writeText(text)
        .then(() => showNotification('Dados copiados para a área de transferência!', 'success'))
        .catch(() => showNotification('Erro ao copiar dados.', 'error'));
};

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    document.body.appendChild(notification);

    anime({
        targets: notification,
        translateX: [-300, 0],
        opacity: [0, 1],
        duration: 500,
        easing: 'easeOutExpo'
    });

    setTimeout(() => {
        anime({
            targets: notification,
            translateX: [0, -300],
            opacity: [1, 0],
            duration: 500,
            easing: 'easeInExpo',
            complete: () => notification.remove()
        });
    }, 3000);
}

function handleInitializationError() {
    const containers = ['services-container', 'stats-container', 'donation-container'];
    containers.forEach(id => {
        const container = document.getElementById(id);
        if (container) {
            container.innerHTML = `
                <div class="error-message">
                    <i class="fas fa-exclamation-circle"></i>
                    <p>Ocorreu um erro ao carregar o conteúdo. Por favor, recarregue a página.</p>
                </div>
            `;
        }
    });
}

document.head.insertAdjacentHTML('beforeend', `
    <style>
        :root {
            --primary: #004AAD;
            --secondary: #FF6B6B;
            --success: #28a745;
            --error: #dc3545;
            --text: #333;
            --bg: #fff;
        }

        .error-message {
            text-align: center;
            padding: 2rem;
            color: var(--error);
        }

        .notification {
            position: fixed;
            top: 20px;
            left: 20px;
            padding: 15px 25px;
            border-radius: 5px;
            color: white;
            z-index: 1000;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        }
        .notification.success { background-color: var(--success); }
        .notification.error { background-color: var(--error); }
        .notification.info { background-color: var(--primary); }

        [data-aos] {
            opacity: 0;
            transform: translateY(20px);
            transition: opacity 0.6s ease, transform 0.6s ease;
        }

        .aos-animate {
            opacity: 1;
            transform: translateY(0);
        }
    </style>
`);

document.addEventListener('DOMContentLoaded', () => {
    loadDonationMethods();
});