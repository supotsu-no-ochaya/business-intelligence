import axios from 'axios';

const API_BASE_URL = '	http://localhost:8000/api';

export const fetchTotalEarnings = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/total_earnings`);
        // Extrahiere den Wert für "total" aus dem JSON
        return response.data.earnings.total;
    } catch (error) {
        console.error('Error fetching total earnings:', error);
        throw error;
    }
};

export const fetchOrders = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/order`);
        // Extrahiere den Wert für "total" aus dem JSON
        return response.data;
    } catch (error) {
        console.error('Error fetching total earnings:', error);
        throw error;
    }
};
