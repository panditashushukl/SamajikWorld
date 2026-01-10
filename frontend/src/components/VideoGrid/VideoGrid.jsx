import React from "react";
import VideoSmall from "../Video/VideoSmall";
import { useSelector } from "react-redux";
import { useFormatDuration } from "../../hooks/useFormatDuration.hook";
import { getImageUrl } from "../../Helper/getImageUrl";

function VideoGrid() {
    const loginUserData = useSelector((state) => state.loginUser.login_user) || {};
    const userVideos = Array.isArray(loginUserData.userVideos) ? loginUserData.userVideos : [];
    const { formatDuration } = useFormatDuration();
    return (
        <div>
            <div className="h-screen overflow-y-auto bg-[#121212] text-white">
                <div className="flex min-h-[calc(100vh-66px)] sm:min-h-[calc(100vh-82px)]">
                    <section className="w-full pb-[70px] sm:ml-[70px] sm:pb-0 lg:ml-0">
                        <div className="px-4 pb-4">
                            {userVideos.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-full gap-4 py-20">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="w-16 h-16 text-gray-400"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                                        />
                                    </svg>
                                    <p className="text-xl text-gray-400">No videos uploaded yet</p>
                                    <p className="text-sm text-gray-500">Upload a video to get started</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-[repeat(auto-fit,_minmax(300px,_1fr))] sm:grid-cols-3 gap-4 pt-2">
                                    {userVideos?.map((video) => (
                                        <VideoSmall
                                            title={video.title}
                                            duration={formatDuration(
                                                video.duration
                                            )}
                                            thumbnail={getImageUrl(video.thumbnail)}
                                            alt={video.title}
                                            views={video.view}
                                            videoId={video._id}
                                            createdAt={video.createdAt}
                                            key={video._id}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
}

export default VideoGrid;
