import { createContext } from "react";
import PeerConnection from "../modules/PeerConnection";

const peerConnectionContext = createContext<PeerConnection>(new PeerConnection());

export default peerConnectionContext;