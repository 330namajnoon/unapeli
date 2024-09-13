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
  const [path, setPath] = useState<string | null>(
    new URLSearchParams(window.location.search).get("path")
  );

  useEffect(() => {
    socket.emit("data", { path }, id.current);
    socket.on(`data_${id.current}`, (data: any) => {
      if (data.path && !path) {
        setPath(data.path);
      }
    });
    socket.on(`videoOnChange_${id.current}`, (comand: string) => {
      setSocketCalled(true);
      setTimeout(() => setSocketCalled(false), 200);
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
          `video.current.currentTime = ${e.target.currentTime};video.current.play();socket.emit("data", { path }, id.current);`,
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
      {path && <source src={path} type="video/mp4" />}
    </Styles.Video>
  );
};

export default Video;
