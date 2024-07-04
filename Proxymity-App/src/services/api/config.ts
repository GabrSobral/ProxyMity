import axios from 'axios';

export const chatApi = axios.create({
   baseURL: import.meta.env.VITE_HTTP_API_DOMAIN_CHAT,
});

export const authApi = axios.create({
   baseURL: import.meta.env.VITE_HTTP_API_DOMAIN_AUTH,
});
