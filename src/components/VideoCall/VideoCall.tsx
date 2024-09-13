import React, { forwardRef } from "react";
import * as Styles from "./styles";

export interface VideoProps {
  muted?: boolean;
  autoPlay?: boolean;
  playsInline?: boolean;
  style?: React.CSSProperties;
}

const VideoCall = forwardRef<HTMLVideoElement, VideoProps>(
  ({ muted, autoPlay, playsInline, style }, ref) => {
    return (
      <Styles.Video
        style={style}
        ref={ref}
        autoPlay={autoPlay}
        playsInline={playsInline}
        muted={muted}
      />
    );
  }
);

export default VideoCall;
