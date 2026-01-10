import { api } from "../api/api";
import { makeRequest } from "../api/makeRequest";

export const subscriptionService = {
    toggleSubscription: (channelUsername) => {
        return makeRequest(() => api.post(`/subscriptions/channels/${channelUsername}/subscribers`), {
            successMessage: "Subscription updated"
        });
    },
    getSubscriptions: (username) => {
        return makeRequest(() => api.get(`/subscriptions/users/${username}/subscriptions`));
    },
    getSubscribers: (channelUsername) => {
        return makeRequest(() =>
            api.get(`/subscriptions/channels/${channelUsername}/subscribers`)
        );
    }
};
