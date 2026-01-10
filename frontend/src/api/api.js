import axios from "axios";
import { removeUser } from "../slice/userSlice";
import store from "../store/store";
import { navigate } from "../Helper/navigate";

export const api = axios.create({
    baseURL: "http://localhost:8000/api/v1",
    withCredentials: true
});

api.interceptors.response.use(
    (resp) => resp,
    async (error) => {
        //save the error response for retry.
        const originalRequestResponse = error.config;

        //handles unauthorized request errors. Prevent refresh-loop by detecting refresh requests
        const isRefreshRequest =
            originalRequestResponse &&
            (originalRequestResponse.url?.includes("/users/refresh-token") || originalRequestResponse.headers?.["x-skip-refresh"] || originalRequestResponse.skipAuthRefresh);

        if (error.response?.status === 401 && !originalRequestResponse._retry && !isRefreshRequest) {
            originalRequestResponse._retry = true;
            console.error("Error caught by the Interceptor :: ", error);

            try {
                // mark the refresh call to skip interceptor retry
                const refreshResp = await api.post(
                    `/users/refresh-token`,
                    { refreshToken: localStorage.getItem("refreshToken") },
                    { headers: { "x-skip-refresh": "true" } }
                );

                // refresh endpoint returns new access token in payload (or data) and also sets cookies
                const respPayload = refreshResp?.data?.payload || refreshResp?.data?.data || refreshResp?.data || {};
                const newAccessToken = respPayload?.accessToken;
                const newRefreshToken = respPayload?.refreshToken;

                if (newAccessToken) {
                    // update axios default header, original failed request header and local storage
                    api.defaults.headers.common["Authorization"] = `Bearer ${newAccessToken}`;
                    originalRequestResponse.headers = originalRequestResponse.headers || {};
                    originalRequestResponse.headers["Authorization"] = `Bearer ${newAccessToken}`;
                    localStorage.setItem("accessToken", newAccessToken);
                }

                if (newRefreshToken) {
                    localStorage.setItem("refreshToken", newRefreshToken);
                }

                return api(originalRequestResponse);
            } catch (err) {
                console.error("Things got in the catch of interceptor.");
                console.error("Error in Refreshing User", err.message);

                if (err.response) {
                    console.error(
                        "Error in Response :: ",
                        err.response.data.message ||
                            "Something went wrong in response"
                    );
                } else if (err.request) {
                    console.error(
                        "Network Error in Refreshing User :: ",
                        err.message
                    );
                } else {
                    console.error(
                        "Something went wrong in refreshing Tokens :: ",
                        err.message
                    );
                }
                // Clear stored tokens on failed refresh
                localStorage.removeItem("accessToken");
                localStorage.removeItem("refreshToken");
                delete api.defaults.headers.common["Authorization"];
                navigate("/login");
                store.dispatch(removeUser());
                return Promise.reject(err);
            }
        }

        // If the failed request was the refresh request, clear tokens and redirect (no retry)
        if (isRefreshRequest && error.response?.status === 401) {
            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");
            delete api.defaults.headers.common["Authorization"];
            navigate("/login");
            store.dispatch(removeUser());
            return Promise.reject(error);
        }

        // handles general errors.
        if (error.response) {
            console.error("API ERROR :: ", error.response.data.message);
        } else if (error.request) {
            console.error("Network error. Please check connection.");
        } else {
            console.error("Error:", error.message);
        }

        return Promise.reject(error);
    }
);
