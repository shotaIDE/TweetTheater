import React, { useState } from 'react';
import './App.css';
import videoList from './video_list.json';

const App = () => {
  const [currentVideoId, setCurrentVideoId] = useState(0);

  const onEnded = () => {
    const nextVideoId = currentVideoId + 1;
    setCurrentVideoId(nextVideoId);
    console.log(videoList[currentVideoId].video_url);
  }

  const tweetList = videoList.map((tweet, id) => {
    const backgroundColor = id == currentVideoId ? 'gray' : 'white'
    return (
      <div style={{
        background: backgroundColor,
      }}>
        <div>
          <img src={tweet.user_profile_image_url} />
        </div>
        <div>
          {tweet.user_display_name} @{tweet.user_name}
        </div>
        <div>
          {tweet.created_at}
        </div>
        <div>
          {tweet.text}
        </div>
        <div>
          <a 
            href={tweet.detail_url}
            target="_blank">
            {tweet.detail_url}
          </a>
        </div>
      </div>)
  });

  return (
    <div className="App">
      <div style={
        {
          marginLeft: 16,
          marginRight: "51%",
        }
      }>
      {tweetList}
      </div>
      <div style={{
        position: "fixed",
        top: 0,
        left: "51%",
      }}>
        <div>
          {currentVideoId + 1} / {videoList.length}
        </div>
        <Video src={videoList[currentVideoId].video_url} onEnded={onEnded} />
      </div>
    </div>
  );
}

interface Props {
  src: string,
  onEnded: any,
}

const Video = (props: Props) => {
  return (
  <video key={props.src} autoPlay controls onEnded={props.onEnded}>
    <source src={props.src} type="video/mp4"></source>
  </video>
  )
}

export default App;
