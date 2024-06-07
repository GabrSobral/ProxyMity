import axios from 'axios';

export const api = axios.create({
   baseURL: import.meta.env.VITE_HTTP_API_DOMAIN,
});
