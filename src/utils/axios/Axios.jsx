import axios from "axios";

class Axios {
    static instance = null;

    static getInstance() {
        if (!Axios.instance) {
            console.log("📦 axios instance created:", import.meta.env.VITE_API_URL);

            Axios.instance = axios.create({
                baseURL: import.meta.env.VITE_API_URL,
                headers: {
                    "Content-Type": "application/json",
                },
                withCredentials: true,
            });

            Axios.instance.interceptors.response.use(
                (response) => response,
                async (error) => {
                    const originalRequest = error.config;

                    if (Axios.currentPath === "/api/auth/login") {
                        return Promise.reject(error);
                    }

                    if (
                        (error.response?.status === 401) &&
                        !originalRequest._retry &&
                        !originalRequest.url.includes("/api/auth/refresh")
                        // !originalRequest.url.includes("/auth/check") 
                    ) {
                        originalRequest._retry = true;
                        
                        try {
                            await Axios.instance.post("/api/auth/refresh");

                            return Axios.instance.request(originalRequest);
                        } catch (refreshError) {
                            console.error("❌ refreshToken 실패", refreshError);
                            Axios.refreshFailed = true;
                            return Promise.reject(refreshError);
                        }
                    }

                    return Promise.reject(error);
                }
            );
        }

        return Axios.instance;
    }

    get(url) {
        return Axios.instance.get(url);
    }

    post(url, data, config = {}) {
        return Axios.instance.post(url, data, config);
    }

    put(url, data) {
        return Axios.instance.put(url, data);
    }

    delete(url) {
        return Axios.instance.delete(url);
    }
}

const axi = Axios.getInstance();
export default axi;
