import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL;

const apiClient = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

let currentRole = null;

export const initializeApiKey = async () => {
    try {
        const storedKey = localStorage.getItem('apiKey');
        if (!storedKey) {
            const response = await axios.post(`${BASE_URL}/generate-guest-key`);
            localStorage.setItem('apiKey', response.data.key);
        }

        const roleResponse = await apiClient.get('/check-role');
        currentRole = roleResponse.data.role;
        localStorage.setItem('apiRole', currentRole);
    } catch (error) {
        console.error('Role check failed:', error);
        currentRole = 'guest';
    }
};

apiClient.interceptors.request.use((config) => {
    const apiKey = localStorage.getItem('apiKey');
    if (apiKey) {
        config.headers['X-API-KEY'] = apiKey;
    }
    return config;
});

export const isAxiosError = axios.isAxiosError;
export const getCurrentRole = () => currentRole;
export default apiClient;