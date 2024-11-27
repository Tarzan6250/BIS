import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

export const registerUser = (userData) => axios.post(`${API_URL}/users/register`, userData);
export const loginUser = (userData) => axios.post(`${API_URL}/users/login`, userData);
export const fetchQuestions = (level) => axios.get(`${API_URL}/quiz/${level}`);
