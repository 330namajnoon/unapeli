import * as Styles from "./styles";
import { useContext } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import YouTubePlayer from "../YouTubePlayer/YouTubePlayer";
import socketManager from "../../socket";
import AppContext from "../../contexts/appContext";



const Video = () => {
  // const video = useRef<HTMLVideoElement>(null);
  const { localStream, remoteStream } = useContext(AppContext);
  // const dispatch = useDispatch();
  // const [socketCalled, setSocketCalled] = useState(false);
  const id = useSelector((state: RootState) => state.app.id);
  const path = useSelector((state: RootState) => state.app.path);
  const youtubeId = useSelector((state: RootState) => state.app.youtubeId);

  // const handleVideoOnChange = (data: string) => {
  //   eval(data);
  // };

  const tracksManager: (stream?: MediaStream) => MediaStream = (stream?: MediaStream) => {
    const newStream = new MediaStream();
    if (!stream) return newStream;
    const videoTrack = stream.getVideoTracks()[1];
    const audioTrack = stream.getAudioTracks()[1];
    if (videoTrack)
      newStream.addTrack(videoTrack);
    if (audioTrack)
      newStream.addTrack(audioTrack);
    return newStream;
  };

  const remoteTracksQuantity = remoteStream?.getVideoTracks().length || 0;

  return (
    <>
      {path?.includes("youtube") || youtubeId ? (
        <YouTubePlayer />
      ) : (
        <Styles.Video
          ref={(video) => {
            if (video && !path) {
              video.srcObject = tracksManager((remoteTracksQuantity > 1) && remoteStream ? remoteStream : localStream ? localStream : undefined);
            }
          }}
          autoPlay
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
