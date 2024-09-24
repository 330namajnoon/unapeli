import { useContext, useEffect, useState } from "react";
import StartStep from "./components/StartStep";
import Video from "./components/Video";
import Menu from "./components/Menu";
import MessageModal from "./components/MessageModal";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "./store";
import VideoCallManager from "./components/VideoCallManager";
import socketManager from "./socket";
import peerConnectionContext from "./contexts/peerConnectionContext";
import { addUser } from "./slices/appSile";
import AppContext from "./contexts/appContext";

function App() {
  const dispatch = useDispatch();
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const peerConnection = useContext(peerConnectionContext);
  const users = useSelector(
    (state: RootState) => state.app.peerConnectionUsers
  );
  const id = useSelector((state: RootState) => state.app.id);
  const roomId = useSelector((state: RootState) => state.app.roomId);
  const shareScreen = useSelector((state: RootState) => state.app.shareScreen);

  const userExists = (userId: string) => {
    return users.includes(userId);
  };

  const createOffer = (userId: string) => {
    peerConnection.createOffer(userId).then((offer) => {
      socketManager.emit(
        "signal",
        { userId: id, type: "offer", offer },
        roomId
      );
    });
  };

  const createAnswer = (userId: string, offer: RTCSessionDescriptionInit) => {
    peerConnection.createAnswer(userId, offer).then((answer) => {
      socketManager.emit(
        "signal",
        { userId: id, type: "answer", answer },
        roomId
      );
    });
  };

  const login = (data: { userId: string; type: string; users: string[] }) => {
    if (id && userExists(data.userId) && data.users.includes(id)) {
      console.log("User already exists");
    } else {
      socketManager.emit(
        "signal",
        { userId: id, users, type: "login" },
        roomId
      );
      if (!userExists(data.userId)) {
        console.log("User added");
        dispatch(addUser(data.userId));
        peerConnection.createConnection({
          id: data.userId,
          onicecandidate: (event) => {
            socketManager.emit(
              "signal",
              { userId: id, type: "candidate", candidate: event.candidate },
              roomId
            );
          },
          ontrack: (event) => {
            setRemoteStream(event.streams[0]);
          },
          onconnectionstatechange: function () {
            if (
              this.connectionState === "disconnected" ||
              this.connectionState === "failed"
            ) {
              createOffer(data.userId);
            }
          },
        });
      }
    }
  };

  const offerManager = (data: {
    userId: string;
    offer: RTCSessionDescriptionInit;
  }) => {
    if (data.offer && userExists(data.userId)) {
      createAnswer(data.userId, data.offer);
    }
  };

  const answerManager = (data: {
    userId: string;
    answer: RTCSessionDescriptionInit;
  }) => {
    if (data.answer && userExists(data.userId)) {
      peerConnection.setRemoteDescription(data.userId, data.answer);
    }
  };

  const candidateManager = (data: {
    userId: string;
    candidate: RTCIceCandidateInit;
  }) => {
    if (data.candidate && userExists(data.userId)) {
      peerConnection.addIceCandidate(data.userId, data.candidate);
    }
  };

  const trackManager = (data: { userId: string; type: string }) => {
    if (data.type === "addTracks" && localStream) {
      users.forEach((userId) => {
        peerConnection.addStream(userId, localStream);
        createOffer(userId);
      });
    }
  };

  const getUserMedia = async () => {
    const newStream = new MediaStream();
    try {
      const videoStream = await window.navigator.mediaDevices.getUserMedia({
        video: { height: 300 },
        audio: true,
      });
      videoStream.getTracks().forEach((track) => newStream.addTrack(track));
      // const audioStream = await window.navigator.mediaDevices.getUserMedia({
      //   audio: true,
      // });
      // audioStream.getTracks().forEach((track) => newStream.addTrack(track));
    } catch {}
    setLocalStream(newStream);
    users.forEach((userId) => {
      peerConnection.addStream(userId, newStream);
      createOffer(userId);
    });
  };

  const getDisplayMedia = async (localStream: MediaStream) => {
    const newStream = new MediaStream();
    try {
      const stream = await window.navigator.mediaDevices.getDisplayMedia({
        video: { height: 720 },
        // audio: true,
      });
      stream.getTracks()[0].onended = () => {
        getUserMedia();
      };
      localStream?.getTracks().forEach((track) => {
        newStream?.addTrack(track);
      });
      stream.getTracks().forEach((track) => {
        newStream?.addTrack(track);
      });
      setLocalStream(newStream);
      users.forEach((userId) => {
        peerConnection.addStream(userId, newStream);
        createOffer(userId);
      });
    } catch {}
  };

  useEffect(() => {
    if (localStream) {
      users.forEach((userId) => {
        peerConnection.addStream(userId, localStream);
      });
    }
  }, [localStream]);

  useEffect(() => {
    if (shareScreen && localStream) {
      getDisplayMedia(localStream);
    } else {
      getUserMedia();
    }
  }, [shareScreen]);

  useEffect(() => {
    window.addEventListener("keydown", () => {
      users.forEach((userId) => {
        console.log(
          peerConnection.getConnection(userId)?.connection?.connectionState
        );
      });
    });
    window.navigator.mediaDevices
      .getUserMedia({ video: { height: 300 } })
      .then((stream) => {
        setLocalStream(stream);
      });
    socketManager.emit("signal", { userId: id, users, type: "login" }, roomId);
    socketManager.on(`signal_${roomId}`, (data) => {
      switch (data.type) {
        case "login":
          login(data);
          break;
        case "offer":
          console.log("offer");
          offerManager(data);
          break;
        case "answer":
          console.log("answer");
          answerManager(data);
          break;
        case "candidate":
          console.log("candidate");
          candidateManager(data);
          break;
        case "addTracks":
          trackManager(data);
          break;
        default:
          break;
      }
    });
    return () => {
      socketManager.getSocket().off(`signal_${roomId}`);
      window.removeEventListener("keydown", () => {});
    };
  }, [users]);

  return (
    <AppContext.Provider value={{ localStream, remoteStream }}>
      <div style={{ position: "relative" }}>
        <Menu />
        <MessageModal />
        {!remoteStream && (
          <StartStep
            action={() => {
              users.forEach((userId) => {
                createOffer(userId);
              });
            }}
          />
        )}
        <VideoCallManager />
        <Video />
      </div>
    </AppContext.Provider>
  );
}

export default App;
