import axios from "axios";

export const BASE_URL = "https://proconnect-3s6l.onrender.com";

const clientServer = axios.create({
    baseURL: BASE_URL,
    headers:{
        'Content-Type': 'application/json',
    }
});

export default clientServer;