import * as Styles from "./styles";
import { useContext, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store";
import YouTubePlayer from "../YouTubePlayer/YouTubePlayer";
import appContext from "../../contexts/appContext";
import socketManager from "../../socket";



const Video = () => {
  const video = useRef<HTMLVideoElement>(null);
  const dispatch = useDispatch();
  const [socketCalled, setSocketCalled] = useState(false);
  const id = useSelector((state: RootState) => state.app.id);
  const path = useSelector((state: RootState) => state.app.path);
  const youtubeId = useSelector((state: RootState) => state.app.youtubeId);

  const handleVideoOnChange = (data: string) => {
    eval(data);
  };

  return (
    <>
      {path?.includes("youtube") || youtubeId ? (
        <YouTubePlayer />
      ) : (
        <Styles.Video
          ref={video}
          onPlay={(e: any) =>
            socketManager.emit(
              `video.current.currentTime = ${e.target.currentTime};video.current.play();socket.emit("data", { path }, id.current);`
            )
          }
          onPause={(e: any) =>
            socketManager.emit(
              "videoOnChange",
              `video.current.currentTime = ${e.target.currentTime}; video.current.pause();`,
              id
            )
          }
          onSeeked={(e: any) =>
            socketManager.emit(
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
