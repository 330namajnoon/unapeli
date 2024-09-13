import React, { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import VideoCall from "./components/VideoCall";
import StartStep from "./components/StartStep";
import Video from "./components/Video";
import * as Styles from "./styles";

const socket = io("https://bellachao.zapto.org", {
  reconnection: true, // Permite reconexión automática
  reconnectionAttempts: Infinity, // Número de intentos de reconexión (por defecto 0 es infinito)
  reconnectionDelay: 1000, // Tiempo de espera entre reconexiones (en milisegundos)
  reconnectionDelayMax: 5000, // Máximo tiempo de espera entre reconexiones
  timeout: 20000, // Tiempo de espera para reconexión
});

function App() {
  const localVideo = useRef<HTMLVideoElement>(null);
  const remoteVideo = useRef<HTMLVideoElement>(null);
  const localStream = useRef<MediaStream>(new MediaStream());
  const cameraStream = useRef<MediaStream | null>(null);
  const audioStream = useRef<MediaStream | null>(null);
  const peerConnection = useRef<RTCPeerConnection | null>(null);
  const [videoSize, setVideoSize] =
    useState<keyof { sm: "sm"; md: "md"; lg: "lg" }>("sm");
  const toch = useRef<number>(0);
  const timeOut = useRef<any>(null);
  const videoSizeTimeout = useRef<any>(null);
  const muveIsStarted = useRef<boolean>(false);
  const [videoRotate, setVideoRotate] = useState(180);

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

  const id = useRef<string | null>(
    new URLSearchParams(window.location.search).get("id")
  );
  const [step, setStep] =
    useState<keyof { start: "start"; call: "call" }>("start");

  const getUserMedia: (
    constraints?: MediaStreamConstraints
  ) => Promise<MediaStream> = (constraints?: MediaStreamConstraints) => {
    return new Promise((resolve, reject) => {
      navigator.mediaDevices
        .getUserMedia(constraints)
        .then((stream) => {
          resolve(stream);
        })
        .catch((err) => {
          reject(err);
        });
    });
  };

  const createPeerConnection = () => {
    peerConnection.current = new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
    });
    peerConnection.current.onicecandidate = (event) => {
      if (event.candidate) {
        socket.emit("signal", { candidate: event.candidate }, id.current);
      }
    };
    peerConnection.current.ontrack = (event) => {
      setVideoRotate(0);
      remoteVideo.current!.srcObject = event.streams[0];
    };
    localStream.current!.getTracks().forEach((track) => {
      peerConnection.current!.addTrack(track, localStream.current!);
    });
  };

  const startCall = () => {
    createPeerConnection();
    peerConnection.current!.createOffer().then((offer) => {
      peerConnection.current!.setLocalDescription(offer);
      socket.emit("signal", { offer: offer }, id.current);
    });
  };

  const start = () => {
    if (cameraStream.current) {
      cameraStream.current.getVideoTracks().forEach((track) => {
        localStream.current!.addTrack(track);
      });
      localVideo.current!.srcObject = localStream.current;
    }
    if (audioStream.current) {
      audioStream.current.getAudioTracks().forEach((track) => {
        localStream.current!.addTrack(track);
      });
      localVideo.current!.srcObject = localStream.current;
    }
    setTimeout(() => {
      startCall();
    }, 1000);
  };

  useEffect(() => {
    setInterval(() => {
      socket.connect();
    }, 1000);
    getUserMedia({ audio: true }).then((stream: any) => {
      audioStream.current = stream;
    });
    getUserMedia({ video: true }).then((stream: any) => {
      cameraStream.current = stream;
    });
    socket.on(`signal_${id.current}`, (data: any) => {
      if (data.offer) {
        createPeerConnection();
        peerConnection.current!.setRemoteDescription(data.offer);
        peerConnection.current!.createAnswer().then((answer) => {
          peerConnection.current!.setLocalDescription(answer);
          socket.emit("signal", { answer: answer }, id.current);
        });
      } else if (data.answer) {
        peerConnection.current!.setRemoteDescription(
          new RTCSessionDescription(data.answer)
        );
      } else if (data.candidate) {
        peerConnection.current!.addIceCandidate(
          new RTCIceCandidate(data.candidate)
        );
      }
    });
  }, []);

  return (
    <div style={{ position: "relative" }}>
      {step === "start" && (
        <StartStep
          action={() => {
            start();
            setStep("call");
          }}
        />
      )}
      <Styles.VideoCallcontainer
        rotate={videoRotate}
        size={videoSize}
        onMouseMove={handleMove}
        onTouchMove={handleMove}
        onMouseDown={handleToch}
        onMouseUp={handleEndMove}
        onMouseOut={handleEndMove}
      >
        <VideoCall ref={remoteVideo} autoPlay playsInline muted></VideoCall>
        <VideoCall
          ref={localVideo}
          style={{ transform: "rotateY(180deg)", borderRadius: "10px"}}
          autoPlay
          playsInline
        ></VideoCall>
      </Styles.VideoCallcontainer>
      <Video socket={socket} />
    </div>
  );
}

export default App;
