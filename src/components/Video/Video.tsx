import { Socket } from "socket.io-client";
import * as Styles from "./styles";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store";
import { setPath } from "../../slices/appSile";
import YouTubePlayer from "../YouTubePlayer/YouTubePlayer";

export interface VideoProps {
  socket: Socket;
}

const Video = ({ socket }: VideoProps) => {
  const video = useRef<HTMLVideoElement>(null);
  const dispatch = useDispatch();
  const [socketCalled, setSocketCalled] = useState(false);
  const id = useSelector((state: RootState) => state.app.id);
  const path = useSelector((state: RootState) => state.app.path);

  useEffect(() => {
    socket.emit("data", { path }, id);
    socket.on(`data_${id}`, (data: any) => {
      if (data.path && !path) {
        dispatch(setPath(data.path));
      }
    });
    socket.on(`videoOnChange_${id}`, (comand: string) => {
      if (socketCalled) return;
      setSocketCalled(true);
      setTimeout(() => setSocketCalled(false), 200);
      eval(comand);
    });
  }, []);

  return (
    <>
      {path?.includes("youtube") || !path ? (
        <YouTubePlayer />
      ) : (
        <Styles.Video
          ref={video}
          onPlay={(e: any) =>
            socket.emit(
              "videoOnChange",
              `video.current.currentTime = ${e.target.currentTime};video.current.play();socket.emit("data", { path }, id.current);`,
              id
            )
          }
          onPause={(e: any) =>
            socket.emit(
              "videoOnChange",
              `video.current.currentTime = ${e.target.currentTime}; video.current.pause();`,
              id
            )
          }
          onSeeked={(e: any) =>
            socket.emit(
              "videoOnChange",
              `video.current.currentTime = ${e.target.currentTime}`,
              id
            )
          }
          controls
        >
          {path && <source src={path} type="video/mp4" />}
          {path && <source src={path} type="video/webm" />}
          {path && <source src={path} type="video/ogg" />}
          {path && <source src={path} type="video/quicktime" />}
          {path && <source src={path} type="video/x-msvideo" />}
          {path && <source src={path} type="video/x-ms-wmv" />}
        </Styles.Video>
      )}
    </>
  );
};

export default Video;
