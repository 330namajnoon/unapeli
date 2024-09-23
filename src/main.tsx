import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { Provider } from "react-redux";
import store from "./store.ts";
import PeerConnectionContext from "./contexts/peerConnectionContext.tsx";
import "./socket.ts";
import PeerConnection from "./modules/PeerConnection.ts";

createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    <PeerConnectionContext.Provider value={new PeerConnection()}>
      <App />
    </PeerConnectionContext.Provider>
  </Provider>
);
