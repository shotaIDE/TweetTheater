import React from "react";

interface Props {
  src: string;
  onEnded: () => void;
}

export const Video = (props: Props) => {
  return (
    <video
      key={props.src}
      autoPlay
      playsInline={true}
      controls
      onEnded={props.onEnded}
      style={{ width: "100%", maxHeight: 500 }}
    >
      <source src={props.src} type="video/mp4"></source>
    </video>
  );
};
