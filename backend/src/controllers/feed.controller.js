import mongoose from "mongoose"
import { Video } from "../models/video.model.js"
import { Tweet } from "../models/tweet.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { User } from "../models/user.model.js"

const getFeed = asyncHandler(async (req, res) => {
    const {
        page = 1,
        limit = 10,
        type = "all", // all, video, tweet
        query,
        sortBy = 'createdAt',
        sortType = 'desc',
        userId
    } = req.query

    const pageNum = Math.max(1, parseInt(page, 10) || 1)
    const limitNum = Math.max(1, parseInt(limit, 10) || 10)
    const skip = (pageNum - 1) * limitNum

    const sortOptions = {
        isSubscribed: -1, // Prioritize subscribed content
        [sortBy]: sortType === 'asc' ? 1 : -1
    }

    let results = []
    let totalDocs = 0

    // Common filter for published content
    const baseFilter = {}
    if (query) {
        baseFilter.$or = [
            { title: { $regex: query, $options: 'i' } }, // Video
            { content: { $regex: query, $options: 'i' } } // Tweet
        ]
    }

    const userIdObj = req.user?._id ? new mongoose.Types.ObjectId(req.user._id) : null;

    const subscriptionLookupStage = {
        $lookup: {
            from: "subscriptions",
            let: { ownerId: "$owner" },
            pipeline: [
                {
                    $match: {
                        $expr: {
                            $and: [
                                { $eq: ["$channel", "$$ownerId"] },
                                { $eq: ["$subscriber", userIdObj] }
                            ]
                        }
                    }
                }
            ],
            as: "isSubscribed"
        }
    };

    const addIsSubscribedField = {
        $addFields: {
            isSubscribed: { $gt: [{ $size: "$isSubscribed" }, 0] }
        }
    };

    if (type === "video") {
        const videoFilter = { ...baseFilter, isPublished: true }
        if (query) {
            delete videoFilter.$or
            videoFilter.title = { $regex: query, $options: 'i' }
        }

        const totalVideos = await Video.countDocuments(videoFilter)
        totalDocs = totalVideos

        const pipeline = [
            { $match: videoFilter },
            {
                $lookup: {
                    from: "users",
                    localField: "owner",
                    foreignField: "_id",
                    as: "ownerDetails"
                }
            },
            {
                $unwind: {
                    path: "$ownerDetails",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $lookup: {
                    from: "likes",
                    let: { videoId: "$_id" },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        { $eq: ["$video", "$$videoId"] },
                                        { $eq: ["$likedBy", userIdObj] }
                                    ]
                                }
                            }
                        }
                    ],
                    as: "isLiked"
                }
            },
            subscriptionLookupStage,
            {
                $addFields: {
                    type: "video",
                    isLiked: { $gt: [{ $size: "$isLiked" }, 0] },
                    isSubscribed: { $gt: [{ $size: "$isSubscribed" }, 0] },
                    Owner: {
                        _id: "$ownerDetails._id",
                        fullName: "$ownerDetails.fullName",
                        username: "$ownerDetails.username",
                        avatar: "$ownerDetails.avatar"
                    }
                }
            },
            {
                $project: {
                    ownerDetails: 0,
                    isSubscribed: 0 // Remove array, keep boolean if needed? No, we added isSubscribed boolean above. Wait, field name conflict.
                    // The lookup 'as' is "isSubscribed" (Array). The addFields overrides it with boolean?
                    // MongoDB addFields overwrites existing fields. So "isSubscribed" becomes boolean. Correct.
                }
            },
            { $sort: sortOptions },
            { $skip: skip },
            { $limit: limitNum }
        ]
        results = await Video.aggregate(pipeline)

    } else if (type === "tweet") {
        const tweetFilter = { ...baseFilter }
        if (query) {
            delete tweetFilter.$or
            tweetFilter.content = { $regex: query, $options: 'i' }
        }

        const totalTweets = await Tweet.countDocuments(tweetFilter)
        totalDocs = totalTweets

        const pipeline = [
            { $match: tweetFilter },
            {
                $lookup: {
                    from: "users",
                    localField: "owner",
                    foreignField: "_id",
                    as: "ownerDetails"
                }
            },
            {
                $unwind: {
                    path: "$ownerDetails",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $lookup: {
                    from: "likes",
                    let: { tweetId: "$_id" },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        { $eq: ["$tweet", "$$tweetId"] },
                                        { $eq: ["$likedBy", userIdObj] }
                                    ]
                                }
                            }
                        }
                    ],
                    as: "isLiked"
                }
            },
            subscriptionLookupStage,
            {
                $addFields: {
                    type: "tweet",
                    isLiked: { $gt: [{ $size: "$isLiked" }, 0] },
                    isSubscribed: { $gt: [{ $size: "$isSubscribed" }, 0] },
                    owner: {
                        _id: "$ownerDetails._id",
                        fullName: "$ownerDetails.fullName",
                        username: "$ownerDetails.username",
                        avatar: "$ownerDetails.avatar"
                    }
                }
            },
            {
                $project: {
                    ownerDetails: 0
                }
            },
            { $sort: sortOptions },
            { $skip: skip },
            { $limit: limitNum }
        ]
        results = await Tweet.aggregate(pipeline)

    } else {
        // "All": Combined stream
        const videoPipeline = [
            { $match: { isPublished: true, ...(query ? { title: { $regex: query, $options: 'i' } } : {}) } },
            {
                $lookup: {
                    from: "users",
                    localField: "owner",
                    foreignField: "_id",
                    as: "ownerDetails"
                }
            },
            { $unwind: "$ownerDetails" },
            {
                $lookup: {
                    from: "likes",
                    let: { videoId: "$_id" },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        { $eq: ["$video", "$$videoId"] },
                                        { $eq: ["$likedBy", userIdObj] }
                                    ]
                                }
                            }
                        }
                    ],
                    as: "isLiked"
                }
            },
            {
                $addFields: {
                    type: "video",
                    isLiked: { $gt: [{ $size: "$isLiked" }, 0] },
                    Owner: {
                        _id: "$ownerDetails._id",
                        fullName: "$ownerDetails.fullName",
                        username: "$ownerDetails.username",
                        avatar: "$ownerDetails.avatar"
                    }
                }
            },
            { $project: { ownerDetails: 0 } }
        ]

        const tweetPipeline = [
            { $match: { ...(query ? { content: { $regex: query, $options: 'i' } } : {}) } },
            {
                $lookup: {
                    from: "users",
                    localField: "owner",
                    foreignField: "_id",
                    as: "ownerDetails"
                }
            },
            { $unwind: "$ownerDetails" },
            {
                $lookup: {
                    from: "likes",
                    let: { tweetId: "$_id" },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        { $eq: ["$tweet", "$$tweetId"] },
                                        { $eq: ["$likedBy", userIdObj] }
                                    ]
                                }
                            }
                        }
                    ],
                    as: "isLiked"
                }
            },
            {
                $addFields: {
                    type: "tweet",
                    isLiked: { $gt: [{ $size: "$isLiked" }, 0] },
                    owner: {
                        _id: "$ownerDetails._id",
                        fullName: "$ownerDetails.fullName",
                        username: "$ownerDetails.username",
                        avatar: "$ownerDetails.avatar"
                    }
                }
            },
            { $project: { ownerDetails: 0 } }
        ]

        results = await Video.aggregate([
            ...videoPipeline,
            {
                $unionWith: {
                    coll: "tweets",
                    pipeline: tweetPipeline
                }
            },
            // Add subscription lookup after union
            subscriptionLookupStage,
            addIsSubscribedField,
            { $sort: sortOptions },
            { $skip: skip },
            { $limit: limitNum }
        ])

        totalDocs = (await Video.countDocuments(baseFilter)) + (await Tweet.countDocuments(baseFilter))
    }

    const totalPages = Math.ceil(totalDocs / limitNum)

    res.status(200).json(
        new ApiResponse(
            200,
            {
                feed: results,
                currentPage: pageNum,
                totalPages,
                totalDocs,
                hasNextPage: pageNum < totalPages,
                hasPrevPage: pageNum > 1
            },
            "Feed fetched Successfully"
        )
    )
})

export {
    getFeed
}
