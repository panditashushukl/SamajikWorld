/* eslint-disable no-irregular-whitespace */
import React, { useEffect } from "react";
import SingleComment from "./SingleComment";
import CommentInput from "./CommentInput";
import { useParams } from "react-router";
import { fetchCurrentVideoComments } from "../../slice/commentSlice";
import { useSelector, useDispatch } from "react-redux";
import { getImageUrl } from "../../Helper/getImageUrl";
import EmptyComments from "./EmptyComments";

function ListComments() {
    const { video_id } = useParams();
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(fetchCurrentVideoComments(video_id));
    }, [video_id, dispatch]);

    const { comments } = useSelector((state) => state.comments);
    
    // Ensure comments is always an array to prevent map errors
    const commentsArray = Array.isArray(comments) ? comments : [];

    return (
        <div>
            <div className=" inset-x-0 top-full z-[60] h-[calc(100%-69px)] overflow-auto rounded-lg border bg-[#121212] p-4 duration-200 hover:top-[67px] peer-focus:top-[67px] sm:static sm:h-auto sm:max-h-[500px] lg:max-h-none">
                <div className="block">
                    <h6 className="mb-4 font-semibold">
                        {commentsArray.length} Comments
                    </h6>
                    <CommentInput videoId={video_id} />
                </div>
                <hr className="my-4 border-white" />
                {commentsArray.length === 0 ? (
                    <EmptyComments />
                ) : (
                    commentsArray.map((comment) => (
                        <SingleComment
                            key={comment?._id || comment?.id || Math.random()}
                            src={getImageUrl(comment?.owner?.avatar, "/user.png")}
                            alt={comment?.owner?.username}
                            username={comment?.owner?.username || comment?.owner?.fullName}
                            comment={comment?.content}
                            time={comment?.createdAt}
                        />
                    ))
                )}
            </div>
        </div>
    );
}

export default ListComments;
