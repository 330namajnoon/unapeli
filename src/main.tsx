import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { Provider } from "react-redux";
import store from "./store.ts";
import "./socket.ts";

createRoot(document.getElementById("root")!).render(<Provider store={store}><App /></Provider>);
