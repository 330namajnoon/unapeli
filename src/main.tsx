import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { Provider } from "react-redux";
import store from "./store.ts";
import PeerConnectionContext from "./contexts/peerConnectionContext.tsx";
import "./socket.ts";
import PeerConnection from "./modules/PeerConnection.ts";
import { StreamsProvider } from "./hooks/useStreams/useStreams.tsx";
import { SocketIoProvider } from "./hooks/useSocket.io/useSocket.io.tsx";



createRoot(document.getElementById("root")!).render(
  <SocketIoProvider>
    <Provider store={store}>
      <StreamsProvider>
          <PeerConnectionContext.Provider value={new PeerConnection()}>
            <App />
          </PeerConnectionContext.Provider>
      </StreamsProvider>
    </Provider>
  </SocketIoProvider>
);

