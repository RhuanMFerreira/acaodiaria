// api.js
const API_URL = 'http://localhost:5000/api';

export const api = {
    // Serviços
    getServices: async () => {
        try {
            const response = await fetch(`${API_URL}/services`);
            if (!response.ok) throw new Error('Erro ao carregar serviços');
            return await response.json();
        } catch (error) {
            console.warn('Usando dados estáticos para serviços:', error);
            return [
                {
                    name: "Distribuição de Marmitas",
                    description: "Entrega diária de refeições para pessoas em situação de rua",
                    image_url: null
                },
                {
                    name: "Cestas Básicas",
                    description: "Distribuição mensal de alimentos para famílias em vulnerabilidade",
                    image_url: null
                },
                {
                    name: "Apoio Social",
                    description: "Auxílio em documentação e encaminhamento para serviços sociais",
                    image_url: null
                }
            ];
        }
    },

    // Estatísticas
    getStats: async () => {
        try {
            const response = await fetch(`${API_URL}/stats`);
            if (!response.ok) throw new Error('Erro ao carregar estatísticas');
            return await response.json();
        } catch (error) {
            console.warn('Usando dados estáticos para estatísticas:', error);
            return [
                { value: "600+", label: "Marmitas/Mês" },
                { value: "30+", label: "Famílias Atendidas" },
                { value: "50+", label: "Crianças Beneficiadas" },
                { value: "100+", label: "Voluntários Ativos" }
            ];
        }
    },

    // Voluntários
    registerVolunteer: async (data) => {
        try {
            const response = await fetch(`${API_URL}/volunteers`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });
            if (!response.ok) throw new Error('Erro ao registrar voluntário');
            return await response.json();
        } catch (error) {
            console.error('Erro no registro de voluntário:', error);
            throw error;
        }
    },

    // Doações
    getDonationMethods: async () => {
        try {
            const response = await fetch(`${API_URL}/donations/methods`);
            if (!response.ok) throw new Error('Erro ao carregar métodos de doação');
            return await response.json();
        } catch (error) {
            console.warn('Usando dados estáticos para doações:', error);
            return [
                {
                    title: "PIX",
                    description: "Faça uma doação via PIX",
                    details: "Chave PIX: 61985780653"
                },
                {
                    title: "Transferência Bancária",
                    description: "Faça uma transferência bancária",
                    details: "Banco: XXX, Agência: XXX, Conta: XXX"
                },
                {
                    title: "Doação de Alimentos",
                    description: "Doe alimentos não perecíveis",
                    details: "Entre em contato para combinar a entrega"
                }
            ];
        }
    },

    createDonation: async (data) => {
        try {
            const response = await fetch(`${API_URL}/donations`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });
            if (!response.ok) throw new Error('Erro ao registrar doação');
            return await response.json();
        } catch (error) {
            console.error('Erro no registro de doação:', error);
            throw error;
        }
    },

    // Contato
    sendContactMessage: async (data) => {
        try {
            const response = await fetch(`${API_URL}/contact`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });
            if (!response.ok) throw new Error('Erro ao enviar mensagem');
            return await response.json();
        } catch (error) {
            console.error('Erro no envio da mensagem:', error);
            throw error;
        }
    },

    // Teste de conexão
    testConnection: async () => {
        try {
            const response = await fetch(`${API_URL}/test-db`);
            return await response.json();
        } catch (error) {
            console.error('Erro na conexão com a API:', error);
            return { status: 'error', message: 'Não foi possível conectar com o servidor' };
        }
    }
};

// Interceptador para tratamento global de erros
const handleApiError = (error) => {
    console.error('API Error:', error);
    // Você pode adicionar aqui uma lógica global de tratamento de erros
    throw error;
};

// Adiciona tratamento de erro para todas as chamadas
Object.keys(api).forEach(key => {
    const originalMethod = api[key];
    api[key] = async (...args) => {
        try {
            return await originalMethod(...args);
        } catch (error) {
            return handleApiError(error);
        }
    };
});