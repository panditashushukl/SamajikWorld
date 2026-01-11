    import { api } from "../api/api";
import { makeRequest } from "../api/makeRequest";

export const authService = {
    login: async (formData) => {
        const res = await makeRequest(() => api.post("/users/login", formData), {
            successMessage: "User logged in successfully!"
        });
        
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

        delete api.defaults.headers.common["Authorization"];

        return res;
    }
};
