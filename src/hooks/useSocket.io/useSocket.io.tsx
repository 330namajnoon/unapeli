import { ReactNode, useContext, useEffect, useState } from "react";
import SocketContext from "../../contexts/socketContext";
import { io } from "socket.io-client";
import { API_URL, SOCKET_CONFIG } from "../../constants";

export function signalTypeMap() {
	return {
		LOGIN: "login",
	};
}

export type Signal = {
	userId?: string;
	users?: string[];
	offer?: RTCSessionDescriptionInit;
	answer?: RTCSessionDescriptionInit;
	candidate?: RTCIceCandidateInit;
	type?: keyof ReturnType<typeof signalTypeMap>;
};

export type UseSocketReturn = [Signal, (signal: Signal) => void];

export const SocketIoProvider = ({ children }: { children: ReactNode }) => {
	const sio = io(API_URL, SOCKET_CONFIG);

	return <SocketContext.Provider value={sio}>{children}</SocketContext.Provider>;
};

export const useSocket = ({ id = "my_room" }): UseSocketReturn => {
	const socketio = useContext(SocketContext);
	const [response, setResponse] = useState<Signal>({});

	function emit(data: Signal) {
		socketio?.emit("signal", data, id);
	}

	useEffect(() => {
		socketio?.on(`signal_${id}`, (data: Signal) => {
			setResponse(data);
		});
		return () => {
			socketio?.off(`signal_${id}`, (data: Signal) => {
				setResponse(data);
			});
		};
	}, []);

	return [response, emit];
};

