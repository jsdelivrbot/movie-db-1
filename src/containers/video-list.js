import React from "react";
import VideoListItem from "../components/video-list-item";

const VideoList = (props) => {
  const { movies } = props;
  return (
    <div>
      <ul>
        {// Display each recommended movie
        movies.map(movie => {
          return (
            <VideoListItem
              key={movie.id}
              movie={movie}
              callback={onClickListItem}
            />
          );
        })}
      </ul>
    </div>
  );

  function onClickListItem(movie) {
    props.callback(movie);
  }
};

export default VideoList;
