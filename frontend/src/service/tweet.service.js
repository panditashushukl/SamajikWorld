import { api } from "../api/api";
import { makeRequest } from "../api/makeRequest";

export const tweetService = {
    postTweet: (tweetData) => {
        return makeRequest(() => api.post("/tweets", tweetData), {
            successMessage: "Tweet posted successfully!"
        });
    },

    updateTweet: (tweetId, updatedData) => {
        return makeRequest(() =>
            api.patch(`/tweets/${tweetId}`, updatedData),
            {
                successMessage: "Tweet updated successfully!"
            }
        );
    },

    deleteTweet: (tweetId) => {
        return makeRequest(
            () => api.delete(`/tweets/${tweetId}`),
            {
                successMessage: "Tweet deleted successfully!"
            }
        );
    },

    getUserTweets: (username) => {
        return makeRequest(() => api.get(`/tweets/user/${username}`), {
            successMessage: "User tweets retrieved successfully!"
        });
    }
};