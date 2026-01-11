import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { videoService } from "../service/video.service";
import { subscriptionService } from "../service/subscription.service";
import { likeService } from "../service/like.service";

export const fetchVideoById = createAsyncThunk(
    "video/fetchById",
    async (videoId, { rejectWithValue }) => {
        if (!videoId) {
            console.error("fetchVideoById called with invalid videoId:", videoId);
            return rejectWithValue("Video ID is required");
        }
        try {
            const response = await videoService.getVideoDetails(videoId);
            const videoData = response.payload;
            if (!videoData) {
                console.error("Video data (payload) not found. Response structure:", {
                    hasPayload: !!response.payload,
                    hasData: !!response.data,
                    responseKeys: Object.keys(response || {})
                });

                if (response.data && typeof response.data === 'object' && '_id' in response.data) {
                    return response.data;
                }
                return rejectWithValue("Video data not found in response");
            }

            return videoData;
        } catch (error) {
            console.error("Error fetching video by ID:", videoId, error);
            return rejectWithValue(
                error?.response?.data || error.message || "Unknown error"
            );
        }
    }
);

export const toggleSubscriptionInVideo = createAsyncThunk(
    "video/toggleSubscriptionInVideo",
    async (channelUsername, { rejectWithValue }) => {
        try {
            const response = await subscriptionService.toggleSubscription(
                channelUsername
            );
            console.log(response.payload);

            return response.payload;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const apiIncrementVideoViewCount = createAsyncThunk(
    "video/incrementViewCount",
    async (videoId, { rejectWithValue }) => {
        try {
            const response = await videoService.incrementVideoCount(videoId);
            return response.payload;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const likeAVideo = createAsyncThunk(
    "video/likeVideo",
    async (videoId, { rejectWithValue }) => {
        try {
            const response = await likeService.likeVideo(videoId);
            return response.payload;
        } catch (error) {
            console.error("Failed to like video:", error);
            console.error("Here is the videoId:", videoId);
            return rejectWithValue(error.response.data || "Error liking video");
        }
    }
);

const videoSlice = createSlice({
    name: "video",
    initialState: {
        currentVideo: null
    },
    reducers: {
        toggleVideoIsSubscribed(state) {
            if (state.currentVideo && state.currentVideo.owner) {
                const isSubscribed = state.currentVideo.owner.isSubscribed;
                state.currentVideo.owner.isSubscribed = !isSubscribed;
                if (isSubscribed) {
                    state.currentVideo.owner.subscriberCount -= 1;
                } else {
                    state.currentVideo.owner.subscriberCount += 1;
                }
            }
        },

        incrementVideoViewCount(state) {
            if (state.currentVideo) {
                state.currentVideo.view += 1;
            }
        },

        incrementLikeCount(state) {
            if (state.currentVideo) {
                state.currentVideo.likeCount += 1;
                state.currentVideo.isLiked = true;
            }
        },

        decrementLikeCount(state) {
            if (state.currentVideo && state.currentVideo.likeCount > 0) {
                state.currentVideo.likeCount -= 1;
                state.currentVideo.isLiked = false;
            }
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchVideoById.pending, (state) => {
                // Keep the current video while loading (don't reset to null immediately)
                // This prevents flickering when navigating between videos
            })
            .addCase(fetchVideoById.fulfilled, (state, action) => {
                state.currentVideo = action.payload;
            })
            .addCase(fetchVideoById.rejected, (state, action) => {
                state.currentVideo = null;
                console.error("Failed to fetch video:", action.payload);
            });

        builder.addCase(likeAVideo.rejected, (state, action) => {
            console.error("Failed to like video:", action.payload);
        });
        builder.addCase(likeAVideo.fulfilled, (state, action) => {
            const payload = action.payload;
            // If backend returned the updated video, replace currentVideo
            if (payload && typeof payload === "object" && payload._id) {
                if (!state.currentVideo || state.currentVideo._id === payload._id) {
                    state.currentVideo = payload;
                }
            }
        });

        builder.addCase(toggleSubscriptionInVideo.fulfilled, (state, action) => {
            const payload = action.payload;
            // If backend returned updated owner/subscription info, merge into currentVideo.Owner
            if (payload && state.currentVideo && state.currentVideo.owner) {
                // payload might be the updated Owner or a wrapper; attempt sensible merges
                const ownerUpdate = payload.owner || payload;
                if (ownerUpdate && ownerUpdate.username === state.currentVideo.owner.username) {
                    state.currentVideo.owner = {
                        ...state.currentVideo.owner,
                        ...ownerUpdate
                    };
                }
            }
        });
    }
});

export const {
    toggleVideoIsSubscribed,
    incrementVideoViewCount,
    incrementLikeCount,
    decrementLikeCount
} = videoSlice.actions;

export default videoSlice.reducer;
