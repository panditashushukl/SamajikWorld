import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { commentService } from "../service/comment.service";

export const fetchCurrentVideoComments = createAsyncThunk(
    "comments/fetchByVideoId",
    async (videoId, { rejectWithValue }) => {
        try {
            const response = await commentService.getVideoComments(videoId);
            console.log("Comments API response:", response);
            return response.payload;
        } catch (error) {
            console.error("Error fetching comments:", error);
            return rejectWithValue(error.response?.data || error.message || "Failed to fetch comments");
        }
    }
);

export const publishComment = createAsyncThunk(
    "comments/publishComment",
    async ({ videoId, commentData }, { rejectWithValue }) => {
        try {
            const response = await commentService.postComment(
                videoId,
                commentData
            );
            return response.payload;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

const commentSlice = createSlice({
    name: "comments",
    initialState: {
        comments: []
    },
    reducers: {
        addComment: (state, action) => {
            state.comments.push(action.payload);
        }
    },
    extraReducers: (builder) => {
        //!fetchCurrentVideoComments
        builder
            .addCase(fetchCurrentVideoComments.pending, (state) => {
                // Keep existing comments while loading
            })
            .addCase(fetchCurrentVideoComments.fulfilled, (state, action) => {
                // Backend returns { comments: [...], pagination: {...} }
                // So we need to extract the comments array
                const payload = action.payload;
                console.log("Setting comments from payload:", payload);
                if (Array.isArray(payload)) {
                    state.comments = payload;
                } else if (payload && Array.isArray(payload.comments)) {
                    state.comments = payload.comments;
                } else {
                    console.warn("Unexpected comments payload structure:", payload);
                    state.comments = [];
                }
                console.log("Comments state updated:", state.comments);
            })
            .addCase(fetchCurrentVideoComments.rejected, (state, action) => {
                console.error("Failed to fetch comments:", action.payload);
                state.comments = [];
            });

        //!publishComment
        builder
            .addCase(publishComment.fulfilled, (state, action) => {
                state.comments.push(action.payload);
            })
            .addCase(publishComment.rejected, (state, action) => {
                console.error("Failed to publish comment:", action.payload);
            });
    }
});

export const { addComment } = commentSlice.actions;

export default commentSlice.reducer;
