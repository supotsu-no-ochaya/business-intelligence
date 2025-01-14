import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api';

// Erstelle eine Axios-Instanz
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Füge den Authorization-Header hinzu, falls ein Token vorhanden ist
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});

// Interceptor für Token-Erneuerung
axiosInstance.interceptors.response.use(
  (response) => response, // Erfolgreiche Antworten unverändert weiterleiten
  async (error) => {
    const originalRequest = error.config;

    // Prüfe, ob der Fehler 401 ist und kein erneuter Versuch läuft
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const refreshToken = localStorage.getItem('refresh_token');
      if (refreshToken) {
        try {
          // Hole neuen Access-Token
          const { data } = await axios.post(`${API_BASE_URL}/auth/token/refresh/`, {
            refresh: refreshToken,
          });

          // Speichere den neuen Token
          localStorage.setItem('access_token', data.access);
          axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${data.access}`;

          // Wiederhole die ursprüngliche Anfrage mit dem neuen Token
          originalRequest.headers['Authorization'] = `Bearer ${data.access}`;
          return axiosInstance(originalRequest);
        } catch (refreshError) {
          console.error('Token refresh failed:', refreshError);
          // Optional: Benutzer abmelden, wenn der Refresh fehlschlägt
          localStorage.clear();
          window.location.href = '/login';
        }
      }
    }

    return Promise.reject(error);
  }
);

// API-Funktionen verwenden die Instanz
export const fetchTotalEarnings = async () => {
  const response = await axiosInstance.get('/total_earnings');
  return response.data.earnings.total;
};

export const fetchOrders = async () => {
  const response = await axiosInstance.get('/order');
  return response.data;
};

export const fetchSpeisen = async () => {
  const response = await axiosInstance.get('/speise');
  return response.data;
};

export const loginUser = async (username, password) => {
    const user = { username, password };
    try {
      const { data } = await axiosInstance.post('/auth/login/', user);
      localStorage.clear();
      localStorage.setItem('access_token', data.access);
      localStorage.setItem('refresh_token', data.refresh);
      axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${data.access}`;
    } catch (error) {
      console.error('Error during login:', error);
      throw error; // Fehler wird an die aufrufende Komponente weitergegeben
    }
  };

  export const changePassword = async (password) => {
    try {
      await axiosInstance.post('/auth/change-password/', { password });
    } catch (error) {
      console.error('Error changing password:', error);
      throw error;
    }
  };
  
  export const addUser = async (user) => {
    try {
      await axiosInstance.post('/auth/users/', user);
    } catch (error) {
      console.error('Error adding user:', error);
      throw error;
    }
  };
  
  export const uploadFile = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
  
    try {
      await axiosInstance.post('http://localhost:8000/upload-json/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
    } catch (error) {
      console.error('Error uploading file:', error);
      throw error;
    }
  };
  

// Exportiere die Axios-Instanz für direkte Verwendung, falls benötigt
export default axiosInstance;
