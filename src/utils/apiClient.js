import axios from "axios";
import { BASE_URL } from "../config";

const apiClient = axios.create({
  baseURL: BASE_URL,
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("esToken");
  if (token) {
    return {
      ...config,
      headers: {
        ...config.headers,
        Authorization: `Bearer ${token}`,
      },
    };
  }
  return config;
});

// transform errors into a simple message so all callers see a consistent string
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const msg =
        error.response.data?.message || error.response.statusText || 'Server error';
      return Promise.reject(new Error(msg));
    }
    // network / CORS / other
    return Promise.reject(new Error('Network error'));
  }
);

export default apiClient;
