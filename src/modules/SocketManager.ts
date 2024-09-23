import { io, Socket } from "socket.io-client";
import { API_URL } from "../constants";

class SocketManager {
  private socket: Socket = io(API_URL, {
    reconnection: true, // Permite reconexión automática
    reconnectionAttempts: Infinity, // Número de intentos de reconexión (por defecto 0 es infinito)
    reconnectionDelay: 1000, // Tiempo de espera entre reconexiones (en milisegundos)
    reconnectionDelayMax: 5000, // Máximo tiempo de espera entre reconexiones
    timeout: 20000, // Tiempo de espera para reconexión
  });

  constructor() {
    setInterval(() => {
      this.socket.connect();
    }, 1000);
  }

  emit(event: string, ...args: any[]) {
    this.socket.emit(event, ...args);
  }

  on(event: string, callback: (...args: any[]) => void) {
    this.socket.on(event, callback);
  }

  getSocket(): Socket {
    return this.socket;
  }
}

export default SocketManager;
