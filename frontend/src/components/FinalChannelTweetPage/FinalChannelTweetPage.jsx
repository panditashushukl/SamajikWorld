import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router";
import MyChannelTweets from "../MyChannelTweets/MyChannelTweets";
import ChannelTweets from "../ChannelTweets/ChannelTweets";
import { apiGetChannelTweets } from "../../slice/channelTweets";

function FinalChannelTweetPage() {
    const params = useParams();
    const { user } = useSelector((state) => state?.loginUser?.login_user);
    const { channelInfo } = useSelector((state) => state?.channelInfo);

    const isMyChannel = params?.username === user?.username; // replace "mychannel" with actual logged-in username logic
    const dispatch = useDispatch();

    useEffect(() => {
        if (isMyChannel && user?.username) {
            dispatch(apiGetChannelTweets(user.username));
        } else if (channelInfo?.username) {
            dispatch(apiGetChannelTweets(channelInfo.username));
        }
    }, [dispatch, isMyChannel, user?.username, channelInfo?.username]);

    if (isMyChannel) {
        return <MyChannelTweets />;
    } else {
        return <ChannelTweets />;
    }
}

export default FinalChannelTweetPage;
