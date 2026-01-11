import { api } from "../api/api";
import { makeRequest } from "../api/makeRequest";

export const videoService = {
    publishVideo: (formData) => {
        return makeRequest(() => api.post("/videos/publish-video", formData), {
            successMessage: "Published Successfully!"
        });
    },

    getChannelVideo: (username) => {
        return makeRequest(
            () => api.get(`/videos?username=${username}`),
            {
                successMessage: "Fetched Channel."
            }
        );
    },

    getVideoDetails: (video_id) => {

        return makeRequest(() => api.get(`/videos/${video_id}`), {
            successMessage: "Got the Video."
        });
    },

    getHomeVideos: () => {
        return makeRequest(() => api.get("/videos", { params: { page: 1, limit: 20 } }), {
            successMessage: null,
            errorMessage: "Error occurred.",
            showToast: false
        });
    },

    async getFeed(type = "all") {
        try {
            const response = await api.get(`/feed?type=${type}`);
            console.log(response.data);
            
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    incrementVideoCount: (video_id) => {
        return makeRequest(() => api.post(`/videos/${video_id}/increment-views`));
    }
};
