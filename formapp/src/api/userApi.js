import axios from 'axios';
	
	const API_URL = 'http://localhost:3001'; // или ваш production URL
	
	export const login = async (email, password) => {
		try {
			const response = await axios.post(`${API_URL}/login`, {
				email,
				password
			});
			
			// Сохраняем токен в localStorage
			if (response.data.token) {
				localStorage.setItem('userToken', response.data.token);
			}
			
			return response.data;
		} catch (error) {
			console.error('Login error:', error.response?.data || error.message);
			throw error;
		}
	};
	
	export const getProfile = async () => {
		const token = localStorage.getItem('userToken');
		
		if (!token) {
			throw new Error('No token found');
		}
		
		try {
			const response = await axios.get(`${API_URL}/profile`, {
				headers: {
					'Authorization': `Bearer ${token}`
				}
			});
			return response.data;
		} catch (error) {
			console.error('Profile fetch error:', error.response?.data || error.message);
			throw error;
		}
	};

