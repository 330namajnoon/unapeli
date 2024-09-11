import { Socket } from "socket.io-client";
import * as Styles from "./styles";
import { useEffect, useRef, useState } from "react";

export interface VideoProps {
  socket: Socket;
}

const Video = ({ socket }: VideoProps) => {
  const video = useRef<HTMLVideoElement>(null);
  const [socketCalled, setSocketCalled] = useState(false);

  useEffect(() => {
    socket.on("videoOnChange", (comand: string) => {
      setSocketCalled(true);
      setTimeout(() => setSocketCalled(false), 1000);
      eval(comand);
    });
  }, []);
  return (
    <Styles.Video
      ref={video}
      onPlay={(e: any) =>
        !socketCalled &&
        socket.emit(
          "videoOnChange",
          `video.current.currentTime = ${e.target.currentTime};video.current.play();`
        )
      }
      onPause={(e: any) =>
        !socketCalled &&
        socket.emit(
          "videoOnChange",
          `video.current.currentTime = ${e.target.currentTime}; video.current.pause();`
        )
      }
      onSeeked={(e: any) =>
        !socketCalled &&
        socket.emit(
          "videoOnChange",
          `video.current.currentTime = ${e.target.currentTime}`
        )
      }
      controls
    >
      <source
        src="https://bellachao.zapto.org/downloads/Inside_Out_2_2024_1080p_WEBRip_x264_AAC5_1_video_converter_com.mp4"
        type="video/mp4"
      />
    </Styles.Video>
  );
};

export default Video;
