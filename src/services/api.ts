import axios from 'axios';

// Detect or fallback base API URL
const API_URL = (import.meta as any).env?.VITE_API_URL || '/api';

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Inject JWT token if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('amc_admin_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Handle Token Refresh / Expiry
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 403 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = localStorage.getItem('amc_admin_refresh_token');
        if (refreshToken) {
          const res = await axios.post(`${API_URL}/auth/refresh`, { refreshToken });
          const { accessToken } = res.data;
          localStorage.setItem('amc_admin_token', accessToken);
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        console.warn('Session expired, logging out admin.');
        localStorage.removeItem('amc_admin_token');
        localStorage.removeItem('amc_admin_refresh_token');
        window.dispatchEvent(new Event('admin_logout'));
      }
    }
    return Promise.reject(error);
  }
);

// --- API Service Methods ---
export const ApiService = {
  // Auth
  async login(username: string, password: string) {
    const res = await api.post('/auth/login', { username, password });
    return res.data;
  },

  async logout() {
    await api.post('/auth/logout');
    localStorage.removeItem('amc_admin_token');
    localStorage.removeItem('amc_admin_refresh_token');
  },

  // Collections CRUD (Generic)
  async getCollection<T>(name: string): Promise<T[]> {
    const res = await api.get(`/cms/${name}`);
    return res.data;
  },

  async createItem<T>(collection: string, item: T): Promise<T> {
    const res = await api.post(`/cms/${collection}`, item);
    return res.data;
  },

  async updateItem<T>(collection: string, id: string, item: Partial<T>): Promise<T> {
    const res = await api.put(`/cms/${collection}/${id}`, item);
    return res.data;
  },

  async deleteItem(collection: string, id: string): Promise<void> {
    await api.delete(`/cms/${collection}/${id}`);
  },

  // Single Setting Object configs
  async getConfig<T>(key: string): Promise<T> {
    const res = await api.get(`/config/${key}`);
    return res.data;
  },

  async saveConfig<T>(key: string, data: T): Promise<void> {
    await api.post(`/config/${key}`, data);
  },

  // Image Upload handler
  async uploadImage(file: File): Promise<{ url: string; message: string }> {
    const formData = new FormData();
    formData.append('image', file);
    const res = await api.post('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return res.data;
  },

  // Backup & Restore
  async exportBackup(): Promise<any> {
    const res = await api.get('/backup/export');
    return res.data;
  },

  async importBackup(data: any): Promise<void> {
    await api.post('/backup/import', data);
  },
};
export default ApiService;
