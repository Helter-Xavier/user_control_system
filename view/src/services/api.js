import axios from "axios";

export const api = axios.create({
  baseURL: "http://localhost:8080",
  headers: {
    Accept: "application/json",
    "ngrok-skip-browser-warning": null
  }
});

// Adiciona o token no cabeçalho de todas as requisições
export const setAuthorizationHeader = async (config) => {
  const token = localStorage.getItem("token"); // Recupera o token do armazenamento local
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}

api.interceptors.request.use(setAuthorizationHeader, (error) => Promise.reject(error));

export const createSession = async (email, password_hash) => {
  try {
    const response = await api.post('/login', {
      email,
      password_hash
    });

    const { token } = response.data;

    // Armazena o token no localStorage
    localStorage.setItem("token", token);

    return response;
  } catch (error) {
    return Promise.reject(error);
  }
}
