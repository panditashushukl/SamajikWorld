import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    notifications: {
        email: true,
        push: false,
        desktop: true,
        streamAlerts: true
    },
    privacy: {
        profileVisibility: "public",
        showOnlineStatus: true,
        dataCollection: false
    },
    loading: false,
    error: null
};

const settingsSlice = createSlice({
    name: "settings",
    initialState,
    reducers: {
        setSettings: (state, action) => {
            if (action.payload.notifications) {
                state.notifications = action.payload.notifications;
            }
            if (action.payload.privacy) {
                state.privacy = action.payload.privacy;
            }
        },
        updateNotifications: (state, action) => {
            state.notifications = action.payload;
        },
        updatePrivacy: (state, action) => {
            state.privacy = action.payload;
        },
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        setError: (state, action) => {
            state.error = action.payload;
        },
        resetSettings: (state) => {
            state.notifications = initialState.notifications;
            state.privacy = initialState.privacy;
            state.loading = false;
            state.error = null;
        }
    }
});

export const {
    setSettings,
    updateNotifications,
    updatePrivacy,
    setLoading,
    setError,
    resetSettings
} = settingsSlice.actions;

export default settingsSlice.reducer;
