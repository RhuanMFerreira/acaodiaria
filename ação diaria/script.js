// Dados dinâmicos
const services = [
    {
        title: "Alimentação",
        description: "Distribuição de refeições nutritivas e água potável em pontos estratégicos da cidade."
    },
    {
        title: "Higiene Pessoal",
        description: "Kits de higiene e acesso a banheiros públicos em parceria com estabelecimentos locais."
    },
    {
        title: "Acolhimento",
        description: "Escuta ativa e encaminhamento para abrigos, serviços de saúde e programas sociais."
    },
    {
        title: "Inclusão Digital",
        description: "Acesso a telefones e computadores para contato com familiares e busca por emprego."
    },
    {
        title: "Doações",
        description: "Distribuição de roupas, cobertores e itens essenciais conforme a estação do ano."
    },
    {
        title: "Oficinas",
        description: "Cursos e workshops para desenvolvimento de habilidades e geração de renda."
    }
];

const stats = [
    { number: "1.240", label: "Refeições Servidas" },
    { number: "128", label: "Pessoas Acolhidas" },
    { number: "20", label: "Voluntários Ativos" },
    { number: "47", label: "Reinserções" }
];

const donationMethods = [
    {
        title: "Doação em Dinheiro",
        description: "Contribua com qualquer valor via PIX, transferência bancária ou cartão de crédito.",
        details: "PIX: 50998279000112"
    },
    {
        title: "Doação de Itens",
        description: "Roupas, alimentos não perecíveis, produtos de higiene e cobertores são sempre necessários.",
        details: "Pontos de coleta em toda a cidade"
    },
    {
        title: "Doação de Serviços",
        description: "Seja um profissional voluntário: médicos, cabeleireiros, advogados e outros.",
        details: "Entre em contato para mais informações"
    }
];

// Funções para carregar conteúdo dinâmico
function loadServices() {
    const container = document.getElementById('services-container');
    let html = '';
    
    services.forEach(service => {
        html += `
            <div class="service-card">
                <h3>${service.title}</h3>
                <p>${service.description}</p>
            </div>
        `;
    });
    
    container.innerHTML = html;
}

function loadStats() {
    const container = document.getElementById('stats-container');
    let html = '';
    
    stats.forEach(stat => {
        html += `
            <div>
                <div class="stat-number">${stat.number}</div>
                <p>${stat.label}</p>
            </div>
        `;
    });
    
    container.innerHTML = html;
}

function loadDonationMethods() {
    const container = document.getElementById('donation-container');
    let html = '';
    
    donationMethods.forEach(method => {
        html += `
            <div class="service-card">
                <h3>${method.title}</h3>
                <p>${method.description}</p>
                <p class="details">${method.details}</p>
            </div>
        `;
    });
    
    container.innerHTML = html;
}

// Formulário de voluntariado
function setupVolunteerForm() {
    const form = document.getElementById('volunteer-form');
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        alert('Obrigado pelo seu interesse! Entraremos em contato em breve.');
        form.reset();
    });
}

// Atualizar ano no footer
function updateYear() {
    document.getElementById('current-year').textContent = new Date().getFullYear();
}

// Menu mobile (para implementação futura)
function setupMobileMenu() {
    // Implementação futura para menu hamburguer
}

// Inicialização
document.addEventListener('DOMContentLoaded', function() {
    loadServices();
    loadStats();
    loadDonationMethods();
    setupVolunteerForm();
    updateYear();
    setupMobileMenu();
});