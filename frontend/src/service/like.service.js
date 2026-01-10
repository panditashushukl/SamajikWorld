import { api } from "../api/api";
import { makeRequest } from "../api/makeRequest";

export const likeService = {
    likeVideo: (videoId) => {
        return makeRequest(
            () => api.post(`/likes/toggle/v/${videoId}`),
            {
                successMessage: "Video liked!"
            }
        );
    },

    likeTweet: (tweetId) => {
        return makeRequest(
            () => api.post(`/likes/toggle/t/${tweetId}`),
            {
                successMessage: "Tweet liked!"
            }
        );
    },

    likeComment: (commentId) => {
        return makeRequest(
            () => api.post(`/likes/toggle/c/${commentId}`),
            {
                successMessage: "Comment liked!"
            }
        );
    },

    getLikedVideos: () => {
        return makeRequest(() => api.get(`/likes/videos`), {
            successMessage: "Liked videos retrieved successfully!"
        });
    },

    getLikedTweets: () => {
        return makeRequest(() => api.get(`/likes/tweet`), {
            successMessage: "Liked tweets retrieved successfully!"
        });
    }
};
