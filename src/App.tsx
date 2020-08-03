import React, { useState } from 'react';
import './App.css';
import videoUrlList from './video_list.json';

const App = () => {
  const [currentVideoId, setCurrentVideoId] = useState(0);
  const [currentVideoUrl, setCurrentVideoUrl] = useState(videoUrlList[0]);

  const onEnded = () => {
    const nextVideoId = currentVideoId + 1;
    setCurrentVideoId(nextVideoId);
    setCurrentVideoUrl(videoUrlList[nextVideoId]);
    console.log(videoUrlList[currentVideoId]);
  }
  
  return (
    <div className="App">
      <header className="App-header">
        <Video src={currentVideoUrl} onEnded={onEnded} />
      </header>
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
