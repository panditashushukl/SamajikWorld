import { api } from "../api/api";
import { makeRequest } from "../api/makeRequest";

export const playlistService = {
    createPlaylist: (playlistData) => {
        return makeRequest(
            () => api.post(`/playlist`, playlistData),
            {
                successMessage: "Playlist created successfully!"
            }
        );
    },

    getUserPlaylists: (username) => {
        return makeRequest(
            () => api.get(`/playlist/user/${username}`),
            {
                successMessage: "User playlists retrieved successfully!"
            }
        );
    },

    getPlaylistById: (playlistId) => {
        return makeRequest(
            () => api.get(`/playlist/${playlistId}`),
            {
                successMessage: "Playlist details retrieved successfully!"
            }
        );
    },

    addVideoToPlaylist: (videoId, playlistId) => {
        return makeRequest(
            () => api.patch(`/playlist/add/${videoId}/${playlistId}`),
            {
                successMessage: "Video added to playlist successfully!"
            }
        );
    },

    removeVideoFromPlaylist: (videoId, playlistId) => {
        return makeRequest(() =>
            api.patch(`/playlist/remove/${videoId}/${playlistId}`)
        );
    },

    deletePlaylist: (playlistId) => {
        return makeRequest(() =>
            api.delete(`/playlist/${playlistId}`)
        );
    },

    updatePlaylist: (playlistId, updatedData) => {
        return makeRequest(() =>
            api.patch(`/playlist/${playlistId}`, updatedData)
        );
    }
};
