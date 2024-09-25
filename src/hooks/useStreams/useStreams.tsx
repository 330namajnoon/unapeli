import React, { ReactNode, createContext, useContext, useEffect, useState } from "react";
import { MEDIA_CONFIG } from "../../constants";

export type StreamsContextState = {
	error: boolean;
	localStream: MediaStream;
	remoteStream: MediaStream;
	setLocalStream: React.Dispatch<React.SetStateAction<MediaStream>>;
	setRemoteStream: React.Dispatch<React.SetStateAction<MediaStream>>;
};

export type UseStreamsReturn = [
	{localStream: MediaStream, remoteStream: MediaStream},
	(tracks: MediaStreamTrack[], from: keyof { local: "local"; remote: "remote" }) => void,
];

export const StreamsContext = createContext<StreamsContextState>({} as any);

export const StreamsProvider = ({ children }: { children: ReactNode }) => {
	const [error, setError] = useState(false);
	const [localStream, setLocalStream] = useState<MediaStream>(new MediaStream());
	const [remoteStream, setRemoteStream] = useState<MediaStream>(new MediaStream());

	useEffect(() => {
		window.navigator.mediaDevices.getUserMedia({video: MEDIA_CONFIG.VIDEO, audio: MEDIA_CONFIG.AUDIO}).then(stream => {
			setLocalStream(new MediaStream([...localStream.getTracks(), ...stream.getTracks()]));
		}).catch(err => {
			setError(true);
		});
	}, [])

	return (
		<StreamsContext.Provider value={{ error, localStream, remoteStream, setLocalStream, setRemoteStream }}>
			{children}
		</StreamsContext.Provider>
	);
};

export const useStreams = (): UseStreamsReturn => {
	const { localStream, remoteStream, setLocalStream, setRemoteStream } = useContext(StreamsContext);

	function addTracks(tracks: MediaStreamTrack[], from: keyof { local: "local"; remote: "remote" }) {}

	return [{ localStream, remoteStream }, addTracks];
};
