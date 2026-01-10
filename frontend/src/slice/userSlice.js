import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    user: null,
    userChannelDetails: null,
    userVideos: null
};

const userSlice = createSlice({
    name: "User",
    initialState,
    reducers: {
        setUser: (state, action) => {
            state.user = action.payload;
        },
        updateAvatar: (state, action) => {
            if (!state.user) return;
            // avatar in backend is stored as a string URL; support both string and object shapes
            if (typeof state.user.avatar === "string" || state.user.avatar === null || state.user.avatar === undefined) {
                state.user.avatar = action.payload;
            } else if (state.user.avatar && typeof state.user.avatar === "object") {
                state.user.avatar.url = action.payload;
            }
        },
        updateCover: (state, action) => {
            if (!state.user) return;
            if (typeof state.user.coverImage === "string" || state.user.coverImage === null || state.user.coverImage === undefined) {
                state.user.coverImage = action.payload;
            } else if (state.user.coverImage && typeof state.user.coverImage === "object") {
                state.user.coverImage.url = action.payload;
            }
        },
        removeUser: (state) => {
            state.user = null;
        },
        setUserChannelDetails: (state, action) => {
            state.userChannelDetails = action.payload;
        },
        updateUserChannelDetails: (state, action) => {
            state.userChannelDetails = action.payload;
        },
        removeUserChannelDetails: (state) => {
            state.userChannelDetails = null;
        },
        updateFullName: (state, action) => {
            state.user.fullName = action.payload;
        },
        addSubscription: (state, action) => {
            state.userChannelDetails?.subscribedTo?.push(action.payload);
        },
        removeSubscription: (state, action) => {
            if (state.userChannelDetails?.subscribedTo) {
                state.userChannelDetails.subscribedTo =
                    state.userChannelDetails.subscribedTo.filter(
                        (subs) => subs?.channel !== action.payload
                    );
            }
        },
        incrementUserSubscriberCount: (state) => {
            if (state.userChannelDetails.subscriberCount) {
                state.userChannelDetails.subscriberCount += 1;
            }
        },
        decrementUserSubscriberCount: (state) => {
            if (state.userChannelDetails.subscriberCount) {
                state.userChannelDetails.subscriberCount -= 1;
            }
        },
        incrementUserSubscribedToCount: (state) => {
            if (state.userChannelDetails.channelsSubscribedTo)
                state.userChannelDetails.channelsSubscribedTo += 1;
        },
        decrementUserSubscribedToCount: (state) => {
            if (state.userChannelDetails.channelsSubscribedTo)
                state.userChannelDetails.channelsSubscribedTo -= 1;
        },
        userChannelVideos: (state, action) => {
            state.userVideos = action.payload;
        },
        removeUserChannelVideos: (state) => {
            state.userVideos = null;
        }
    }
});

export const {
    setUser,
    updateAvatar,
    updateCover,
    removeUser,
    setUserChannelDetails,
    updateUserChannelDetails,
    removeUserChannelDetails,
    updateFullName,
    addSubscription,
    removeSubscription,
    decrementUserSubscribedToCount,
    decrementUserSubscriberCount,
    incrementUserSubscribedToCount,
    incrementUserSubscriberCount,
    userChannelVideos,
    removeUserChannelVideos
} = userSlice.actions;

export default userSlice.reducer;
