import { api } from "../api/api";
import { makeRequest } from "../api/makeRequest";

export const userService = {
    changePassword: (formData) => {
        return makeRequest(() => api.post("/users/change-password", formData), {
            successMessage: "Updated Successfully!"
        });
    },

    updateAccountDetails: (formData) => {
        return makeRequest(
            () => api.patch("/users/update-details", formData),
            {
                successMessage: "Updated Successfully!"
            }
        );
    },

    updateUserAvatar: (formData) => {
        return makeRequest(() => api.patch("/users/avatar", formData));
    },

    updateCoverImage: (formData) => {
        return makeRequest(() =>
            api.patch("/users/cover-image", formData)
        );
    },

    getUserChannel: (username) => {
        return makeRequest(() => api.get(`/users/c/${username}`));
    },

    getUserHistory: () => {
        return makeRequest(() => api.get("/users/watch-history"), {
            errorMessage: "Failed to fetch watch history",
            successMessage: "Watch history fetched successfully"
        });
    },

    addVideoToHistory: (videoId) => {
        return makeRequest(
            () => api.post(`/users/add-to-watch-history/${videoId}`),
            {
                showToast: false
            }
        );
    },

    getWatchLater: () => {
        return makeRequest(() => api.get("/users/get-watch-later"), {
            errorMessage: "Failed to fetch watch later list",
            successMessage: "Watch later list fetched successfully"
        });
    },

    addToWatchLater: (videoId) => {
        return makeRequest(
            () => api.post(`/users/add-to-watch-later/${videoId}`),
            {
                successMessage: "Video added to Watch Later",
                errorMessage: "Failed to add video to Watch Later"
            }
        );
    },

    clearAllWatchHistory: () => {
        return makeRequest(() => api.delete("/users/clear-all-watch-history"), {
            successMessage: "Watch history cleared successfully",
            errorMessage: "Failed to clear watch history"
        });
    },

    removeFromWatchHistory: (videoId) => {
        return makeRequest(
            () => api.delete(`/users/remove-from-watch-history/${videoId}`),
            {
                successMessage: "Video removed from watch history",
                errorMessage: "Failed to remove video from watch history"
            }
        );
    },

    removeFromWatchLater: (videoId) => {
        return makeRequest(
            () => api.delete(`/users/remove-from-watch-later/${videoId}`),
            {
                successMessage: "Video removed from watch later",
                errorMessage: "Failed to remove video from watch later"
            }
        );
    },

    getSettings: () => {
        return makeRequest(() => api.get("/users/settings"), {
            errorMessage: "Failed to fetch settings"
        });
    },

    updateSettings: (settingsData) => {
        return makeRequest(
            () => api.patch("/users/settings", settingsData),
            {
                successMessage: "Settings updated successfully",
                errorMessage: "Failed to update settings"
            }
        );
    }
};
