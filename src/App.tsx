import { useEffect, useState } from "react";
import { useSocket } from "./hooks/useSocket.io/useSocket.io";
import { useSelector } from "react-redux";
import { RootState } from "./store";
import StartStep from "./components/StartStep";
import { useStreams } from "./hooks/useStreams";

const App = () => {
	const id: string = useSelector((state: RootState) => state.app.roomId || "my_room");
	const [addTracks, { localStream, remoteStream }] = useStreams();
	const [socketSignal, emit] = useSocket({ id });
	const [myUsers, setMyUsers] = useState<string[]>([]);
	const myId = useSelector((state: RootState) => state.app.id || "NULL");

	const login = (userId: string, users: string[]) => {
		if (!myUsers.includes(userId)) {
			setMyUsers([...myUsers, userId]);
		}

		if (!users.some((us) => us === myId)) {
			emit({ type: "LOGIN", userId: myId, users: myUsers });
		}
	};

	useEffect(() => {
		const { type, userId, users } = socketSignal;
		switch (true) {
			case !!userId && !!type && !!users:
				login(userId, users);
				break;
		}
	}, [socketSignal]);

	useEffect(() => {
		emit({ userId: myId, users: myUsers, type: "LOGIN" });
	}, []);

	return (
		<StartStep
			myUsers={myUsers}
			action={() => {
				console.log(myUsers);
			}}
		/>
	);
};

export default App;

