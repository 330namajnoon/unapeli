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
  // const [step, setStep] =
  //   useState<keyof { start: "start"; call: "call" }>("start");

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
      // const connection = peerConnection.getConnection(data.userId)?.connection;
      // if (connection && connection?.connectionState === "new") {

      //   console.log(connection?.connectionState);
      //   connection.createOffer().then((offer) => {
      //     connection.setLocalDescription(new RTCSessionDescription(offer));
      //     socketManager.emit(
      //       "signal",
      //       { userId: id, type: "offer", offer },
      //       roomId
      //     );
      //   });
      // }
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
            console.log(event.streams[0].getTracks());
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

  useEffect(() => {
    if (localStream) {
      users.forEach((userId) => {
        peerConnection.addStream(userId, localStream);
      });
    }
  }, [localStream]);

  useEffect(() => {
    if (shareScreen) {
      window.navigator.mediaDevices
        .getDisplayMedia({ video: { height: 300 } })
        .then((stream) => {
          stream.getTracks()[0].onended = () => {
            window.navigator.mediaDevices
            .getUserMedia({ video: { height: 300 } })
            .then((stream) => {
              setLocalStream(stream);
              users.forEach((userId) => {
                peerConnection.addStream(userId, stream);
                createOffer(userId);
              });
            });
          };
          let ls = new MediaStream();
          localStream?.getTracks().forEach((track) => {
            ls?.addTrack(track);
          });
          stream.getTracks().forEach((track) => {
            ls?.addTrack(track);
          });
          setLocalStream(ls);
          users.forEach((userId) => {
            peerConnection.addStream(userId, ls);
            createOffer(userId);
          });
        })
    } else {
      window.navigator.mediaDevices
        .getUserMedia({ video: { height: 300 } })
        .then((stream) => {
          setLocalStream(stream);
          users.forEach((userId) => {
            peerConnection.addStream(userId, stream);
            createOffer(userId);
          });
        });
    }
  }, [shareScreen]);

  useEffect(() => {
    window.addEventListener("keydown", () => {
      users.forEach((userId) => {
        console.log(
          peerConnection.getConnection(userId)?.connection?.connectionState
        );
        //createOffer(userId);
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
