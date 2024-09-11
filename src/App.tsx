import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import VideoCall from "./components/VideoCall";
import StartStep from "./components/StartStep";
import Video from "./components/Video";

const socket = io("https://bellachao.zapto.org");

function App() {
  const localVideo = useRef<HTMLVideoElement>(null);
  const remoteVideo = useRef<HTMLVideoElement>(null);
  const localStream = useRef<MediaStream | null>(null);
  const peerConnection = useRef<RTCPeerConnection | null>(null);

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
        socket.emit("signal", { candidate: event.candidate });
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
      socket.emit("signal", { offer: offer });
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
    getUserMedia().then((stream: any) => {
      localStream.current = stream;
    });
    socket.on("signal", (data: any) => {
      if (data.offer) {
        createPeerConnection();
        peerConnection.current!.setRemoteDescription(data.offer);
        peerConnection.current!.createAnswer().then((answer) => {
          peerConnection.current!.setLocalDescription(answer);
          socket.emit("signal", { answer: answer });
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
      { step === "start" && 
        <StartStep
          action={() => {
            start();
            setStep("call");
          }}
        />
      }
      <VideoCall ref={localVideo} autoPlay playsInline muted></VideoCall>
      <VideoCall ref={remoteVideo} autoPlay playsInline></VideoCall>
      <Video socket={socket}/>
    </div>
  );
}

export default App;
