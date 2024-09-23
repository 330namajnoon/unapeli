import { createContext } from "react";

const appContext = createContext<{
  localStream: MediaStream | null;
  remoteStream: MediaStream | null;
}>({
  localStream: null,
  remoteStream: null,
});

export default appContext;
