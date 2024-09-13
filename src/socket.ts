import { io } from "socket.io-client";

const socket = io("https://bellachao.zapto.org", {
  reconnection: true, // Permite reconexión automática
  reconnectionAttempts: Infinity, // Número de intentos de reconexión (por defecto 0 es infinito)
  reconnectionDelay: 1000, // Tiempo de espera entre reconexiones (en milisegundos)
  reconnectionDelayMax: 5000, // Máximo tiempo de espera entre reconexiones
  timeout: 20000, // Tiempo de espera para reconexión
});

export default socket;