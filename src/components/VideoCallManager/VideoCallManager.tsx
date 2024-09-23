import { useContext, useEffect, useRef, useState } from "react";
import * as Styles from "./styles";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import AppContext from "../../contexts/appContext";

const VideoCallManager = () => {
  const { localStream, remoteStream } = useContext(AppContext);
  const micIsOn = useSelector((state: RootState) => state.app.micIsOn);
  const [videoRotate, setVideoRotate] = useState(180);
  const [videoSize, setVideoSize] =
    useState<keyof { sm: "sm"; md: "md"; lg: "lg" }>("sm");
  // const [isMuted, setIsMuted] = useState(false);
  const muveIsStarted = useRef<boolean>(false);
  const timeOut = useRef<any>(null);
  const toch = useRef<number>(0);
  const videoSizeTimeout = useRef<any>(null);

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
      setVideoRotate((prev) => prev + 180);
    }
  };

  const handleMove = (e: React.MouseEvent<HTMLDivElement> | any) => {
    const video: HTMLDivElement = e.currentTarget;
    if (muveIsStarted.current) {
      video.style.top = `${e.clientY - video.offsetHeight / 2}px`;
      video.style.left = `${e.clientX - video.offsetWidth / 2}px`;
    }
  };

  const handleEndMove = () => {
    muveIsStarted.current = false;
  };

  useEffect(() => {
    // if (micIsOn) {
    //   localStream!.getAudioTracks().forEach((track) => {
    //     track.enabled = true;
    //   });
    // } else {
    //   localStream!.getAudioTracks().forEach((track) => {
    //     track.enabled = false;
    //   });
    // }
  }, [micIsOn]);
  console.log(localStream, remoteStream);
  // const toggleMute = () => {
  //   localStream?.getAudioTracks().forEach((track) => {
  //     track.enabled = !isMuted;
  //   });
  //   setIsMuted(!isMuted);
  // };

  return (
    <Styles.VideoCallcontainer
      rotate={videoRotate}
      size={videoSize}
      onMouseMove={handleMove}
      onTouchMove={handleMove}
      onMouseDown={handleToch}
      onMouseUp={handleEndMove}
      onMouseOut={handleEndMove}
    >
      <Styles.Video
        ref={(video) => {
          if (video && localStream) {
            video.srcObject = localStream;
          }
        }}
        autoPlay
        muted
      />
      <Styles.Video
        style={{transform: "rotateY(180deg)"}}
        ref={(video) => {
          if (video && remoteStream) {
            video.srcObject = remoteStream;
          }
        }}
        autoPlay
      />
    </Styles.VideoCallcontainer>
  );
};

export default VideoCallManager;
