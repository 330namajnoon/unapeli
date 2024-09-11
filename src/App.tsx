import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import VideoCall from "./components/VideoCall";
import StartStep from "./components/StartStep";
import Video from "./components/Video";

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
  const localStream = useRef<MediaStream | null>(null);
  const peerConnection = useRef<RTCPeerConnection | null>(null);
  const id = useRef<string | null>(
    new URLSearchParams(window.location.search).get("id")
  );
  const [step, setStep] =
    useState<keyof { start: "start"; call: "call" }>("start");

  const getUserMedia = () => {
    return new Promise((resolve, reject) => {
      navigator.mediaDevices
        .getUserMedia({ video: true, audio: true })
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
    if (localStream.current) {
      localVideo.current!.srcObject = localStream.current;
      setTimeout(() => {
        startCall();
      }, 1000);
    } else {
      getUserMedia().then((stream: any) => {
        localStream.current = stream;
        localVideo.current!.srcObject = stream;
        setTimeout(() => {
          startCall();
        }, 1000);
      });
    }
  };

  useEffect(() => {
    setInterval(() => {
      socket.connect();
    }, 1000);
    getUserMedia().then((stream: any) => {
      localStream.current = stream;
    });
    socket.on(`signal_${id.current}`, (data: any) => {
      console.log(data);
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
    <div>
      {step === "start" && (
        <StartStep
          action={() => {
            start();
            setStep("call");
          }}
        />
      )}
      <VideoCall
        ref={localVideo}
        autoPlay
        playsInline
        muted
        display="none"
      ></VideoCall>
      <VideoCall ref={remoteVideo} autoPlay playsInline></VideoCall>
      <Video socket={socket} />
    </div>
  );
}

export default App;
