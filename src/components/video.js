import React from "react";

const YOUTUBE_BASE_URL = "https://www.youtube.com/embed/";

const Video = ({ videoId }) => {
    return (
        <div className="embed-responsive embed-responsive-16by9">
            <iframe className="embed-responsive-item" src={`${YOUTUBE_BASE_URL}${videoId}`} />
        </div>
    )
};

export default Video;