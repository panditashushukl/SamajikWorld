import React from 'react';
import { Link } from 'react-router-dom';
import { getImageUrl } from "../Helper/getImageUrl";
import { formatDistanceToNow } from 'date-fns';

const TweetCard = ({ tweet }) => {
    return (
        <div className="w-full bg-[#1E1E1E] p-4 rounded-lg border border-neutral-800 hover:border-neutral-700 transition-all duration-200">
            <div className="flex gap-3">
                {/* Avatar */}
                <Link
                    to={`/channel/${tweet?.owner?._id}`}
                    className="flex-shrink-0"
                >
                    <div className="h-10 w-10 overflow-hidden rounded-full bg-neutral-700">
                        <img
                            src={getImageUrl(tweet?.owner?.avatar, "/user.png")}
                            alt={tweet?.owner?.fullName}
                            className="h-full w-full object-cover"
                            loading="lazy"
                        />
                    </div>
                </Link>

                {/* Content */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                        <Link
                            to={`/channel/${tweet?.owner?._id}`}
                            className="font-semibold text-white hover:underline truncate"
                        >
                            {tweet?.owner?.fullName}
                        </Link>
                        <span className="text-neutral-500 text-sm">@{tweet?.owner?.username}</span>
                        <span className="text-neutral-500 text-sm">•</span>
                        <span className="text-neutral-500 text-sm">
                            {formatDistanceToNow(new Date(tweet?.createdAt), { addSuffix: true })}
                        </span>
                    </div>

                    <div className="text-neutral-200 text-sm sm:text-base whitespace-pre-wrap mb-3">
                        {tweet?.content}
                    </div>

                    {/* Images if any (Currently tweet model supports contentImages array but logic to store might be string only or array, checking usage) */}
                    {/* Based on model: contentImages is array of strings */}
                    {tweet?.contentImages && tweet.contentImages.length > 0 && (
                        <div className={`grid gap-2 mt-3 ${tweet.contentImages.length > 1 ? 'grid-cols-2' : 'grid-cols-1'}`}>
                            {tweet.contentImages.map((img, idx) => (
                                <div key={idx} className="rounded-lg overflow-hidden border border-neutral-800">
                                    <img src={getImageUrl(img)} alt="Tweet content" className="w-full h-auto object-cover max-h-[400px]" />
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Actions (Like, etc - simplified for now) */}
                    <div className="flex items-center gap-6 mt-3 text-neutral-500 text-sm">
                        {/* Start with static or minimal interactive buttons */}
                        <div className="flex items-center gap-2 cursor-pointer hover:text-red-500 transition-colors">
                            {/* Heart Icon */}
                            <svg className={`w-5 h-5 ${tweet?.isLiked ? "fill-red-500 text-red-500" : "fill-none text-current"}`} stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                            </svg>
                            <span>{tweet?.likes || 0}</span>
                            {/* Note: Aggregate might need to return likes count if not present in base model */}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TweetCard;
