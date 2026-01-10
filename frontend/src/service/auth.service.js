    import { api } from "../api/api";
import { makeRequest } from "../api/makeRequest";

export const authService = {
    login: async (formData) => {
        const res = await makeRequest(() => api.post("/users/login", formData), {
            successMessage: "User logged in successfully!"
        });

        // Store access and refresh tokens in localStorage and set default Authorization header
        const accessToken = res?.payload?.accessToken;
        const refreshToken = res?.payload?.refreshToken;
        if (accessToken) {
            localStorage.setItem("accessToken", accessToken);
            api.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
        }
        if (refreshToken) {
            // storing refresh token in localStorage is less secure but useful for local-dev setups where cookies may not be set; avoid this in production
            localStorage.setItem("refreshToken", refreshToken);
        }

        return res;
    },

    register: (formData) => {
        return makeRequest(() => api.post("/users/register", formData), {
            successMessage: "User Registered out successfully!"
        });
    },

    logout: async () => {
        const res = await makeRequest(() => api.post("/users/logout"), {
            successMessage: "User logged out successfully!"
        });

        // Clear stored tokens and Authorization header
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        delete api.defaults.headers.common["Authorization"];

        return res;
    }
};
