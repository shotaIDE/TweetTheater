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

  return (
    <div className="App">
      <div>
        {videoList[currentVideoId].created_at}
      </div>
      <div>
        {videoList[currentVideoId].text}
      </div>
      <Video src={videoList[currentVideoId].video_url} onEnded={onEnded} />
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
