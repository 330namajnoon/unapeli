import { forwardRef, useRef, useState } from "react";
import * as Styles from "./styles";

export interface VideoProps {
  muted?: boolean;
  autoPlay?: boolean;
  playsInline?: boolean;
  visible?: boolean;
  onVisibilityChange?: () => void;
}

const VideoCall = forwardRef<HTMLVideoElement, VideoProps>(
  ({ muted, autoPlay, playsInline, visible, onVisibilityChange }, ref) => {
    const [videoSize, setVideoSize] =
      useState<keyof { sm: "sm"; md: "md"; lg: "lg" }>("sm");
    const toch = useRef<number>(0);
    const timeOut = useRef<any>(null);
    const videoSizeTimeout = useRef<any>(null);
    const muveIsStarted = useRef<boolean>(false);

    const handleToch = () => {
      muveIsStarted.current = true;
      clearTimeout(timeOut.current);
      clearTimeout(videoSizeTimeout.current);
      timeOut.current = setTimeout(() => {
        toch.current = 0;
      }, 300);
      toch.current++;
      if (toch.current === 2) {
        videoSizeTimeout.current = setTimeout(() => {
          if (videoSize === "sm") {
            setVideoSize("md");
          } else if (videoSize === "md") {
            setVideoSize("lg");
          } else if (videoSize === "lg") {
            setVideoSize("sm");
          }
        }, 300);
      }
      if (toch.current === 3) {
        if (onVisibilityChange) {
          onVisibilityChange();
        }
      }
    };

    const handleMove = (e: any) => {
      const video = e.target;
      if (muveIsStarted.current && !e.touches) {
        video.style.top = `${e.clientY - video.offsetHeight / 2}px`;
        video.style.left = `${e.clientX - video.offsetWidth / 2}px`;
      } else if (muveIsStarted.current) {
        video.style.top = `${
          e?.touches?.[0]?.clientY - video.offsetHeight / 2
        }px`;
        video.style.left = `${
          e?.touches?.[0]?.clientX - video.offsetWidth / 2
        }px`;
      }
    };

    const handleEndMove = () => {
      muveIsStarted.current = false;
    };

    return (
      <Styles.Video
        onMouseMove={handleMove}
        onTouchMove={handleMove}
        onMouseDown={handleToch}
        onMouseUp={handleEndMove}
        onMouseOut={handleEndMove}
        size={videoSize}
        ref={ref}
        autoPlay={autoPlay}
        playsInline={playsInline}
        muted={muted}
        visible={visible}
      />
    );
  }
);

export default VideoCall;
