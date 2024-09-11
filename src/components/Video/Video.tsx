import { Socket } from "socket.io-client";
import * as Styles from "./styles";
import { useEffect, useRef, useState } from "react";

export interface VideoProps {
  socket: Socket;
}

const Video = ({ socket }: VideoProps) => {
  const video = useRef<HTMLVideoElement>(null);
  const [socketCalled, setSocketCalled] = useState(false);
  const id = useRef<string | null>(
    new URLSearchParams(window.location.search).get("id")
  );
  const path = useRef<string | null>(
    new URLSearchParams(window.location.search).get("path")
  );

  useEffect(() => {
    socket.on(`videoOnChange_${id.current}`, (comand: string) => {
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
          `video.current.currentTime = ${e.target.currentTime};video.current.play();`,
          id.current
        )
      }
      onPause={(e: any) =>
        !socketCalled &&
        socket.emit(
          "videoOnChange",
          `video.current.currentTime = ${e.target.currentTime}; video.current.pause();`,
          id.current
        )
      }
      onSeeked={(e: any) =>
        !socketCalled &&
        socket.emit(
          "videoOnChange",
          `video.current.currentTime = ${e.target.currentTime}`,
          id.current
        )
      }
      controls
    >
      <source src={path.current!} type="video/mp4" />
    </Styles.Video>
  );
};

export default Video;
