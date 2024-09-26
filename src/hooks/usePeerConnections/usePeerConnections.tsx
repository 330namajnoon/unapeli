import { ReactNode, createContext, useContext, useRef, useState } from "react";
import { STUN_SERVER } from "../../constants";

export type PeerConnection = {
	userId: string;
	connection: RTCPeerConnection;
	dataChanel?: RTCDataChannel;
}

export type PeerConnectionContextState = {
	connections: PeerConnection[];
	setConnections: (connections: PeerConnectionContextState) => void;
}

export const PeerConnectionsContext = createContext<PeerConnectionContextState>({ connections: [], setConnections: () => { } });

export const PeerConnectionsProvider = ({ children }: { children: ReactNode }) => {
	const connectionsRef = useRef<PeerConnectionContextState>({
		connections: [], setConnections(connections: PeerConnectionContextState) {
			connectionsRef.current = connections;
			setState(!state);
		}
	});
	const [state, setState] = useState<boolean>(false);

	return (
		<PeerConnectionsContext.Provider value={connectionsRef.current}>
			{children}
		</PeerConnectionsContext.Provider>
	)
}

const usePeerConnections = () => {
	const { connections, setConnections } = useContext(PeerConnectionsContext);

	const createConnection = ({ userId, onicecandidate, ontrack }:
		{
			userId: string,
			onicecandidate: ((this: RTCPeerConnection, ev: RTCPeerConnectionIceEvent) => any) | null,
			ontrack: ((this: RTCPeerConnection, ev: RTCTrackEvent) => any) | null
		}
	) => {
		if (!connections.find(connection => connection.userId === userId)) {
			const connection = new RTCPeerConnection({ iceServers: [{ urls: STUN_SERVER }] });
			connection.onicecandidate = onicecandidate;
			connection.ontrack = ontrack;
			const connections_ = connections;
			connections_.push({ connection, userId });
		}
	}

	return "peerConnection";
}

export default usePeerConnections;