import { useSelector } from "react-redux";
import * as Styles from "./styles";
import { RootState } from "../../store";
import AppContext from "../../contexts/appContext";
import { useContext } from "react";

export interface StartStepProps {
  action: () => void;
}

const StartStep = ({ action }: StartStepProps) => {
  const { localStream } = useContext(AppContext);
  const users = useSelector(
    (state: RootState) => state.app.peerConnectionUsers
  );
  return (
    <Styles.Container>
      <Styles.Content>
        <Styles.LocalVideo
          ref={(video) => {
            if (video) {
              video.srcObject = localStream;
            }
          }}
          autoPlay
          muted
        />
        {users.map((user: string) => (
          <Styles.UserView key={user}>
            <Styles.Name>{user}</Styles.Name>
          </Styles.UserView>
        ))}
        { localStream && !!users.length && (
          <Styles.Button onClick={action}>Start</Styles.Button>
        )}
      </Styles.Content>
    </Styles.Container>
  );
};
export default StartStep;
