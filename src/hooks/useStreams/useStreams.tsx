import React, { ReactNode, createContext, useContext, useState } from "react";

export type StreamsContextState = {
	localStream: MediaStream;
	remoteStream: MediaStream;
	setLocalStream: React.Dispatch<React.SetStateAction<MediaStream>>;
	setRemoteStream: React.Dispatch<React.SetStateAction<MediaStream>>;
};

export type UseStreamsReturn = [
	(tracks: MediaStreamTrack[], from: keyof { local: "local"; remote: "remote" }) => void,
	{localStream: MediaStream, remoteStream: MediaStream}
];

export const StreamsContext = createContext<StreamsContextState>({} as any);

export const StreamsProvider = ({ children }: { children: ReactNode }) => {
	const [localStream, setLocalStream] = useState<MediaStream>(new MediaStream());
	const [remoteStream, setRemoteStream] = useState<MediaStream>(new MediaStream());

	return (
		<StreamsContext.Provider value={{ localStream, remoteStream, setLocalStream, setRemoteStream }}>
			{children}
		</StreamsContext.Provider>
	);
};

export const useStreams = (): UseStreamsReturn => {
	const { localStream, remoteStream, setLocalStream, setRemoteStream } = useContext(StreamsContext);

	function addTracks(tracks: MediaStreamTrack[], from: keyof { local: "local"; remote: "remote" }) {}

	return [addTracks, { localStream, remoteStream }];
};
