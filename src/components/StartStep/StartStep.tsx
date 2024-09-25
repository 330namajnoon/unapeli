import * as Styles from "./styles";
import { useStreams } from "../../hooks/useStreams";
import Loading from "../Loading";

export interface StartStepProps {
  action: () => void;
  myUsers: string[];
}

const StartStep = ({ action, myUsers }: StartStepProps) => {
  const [{ localStream }] = useStreams();
  
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
        {myUsers.map((user: string) => (
          <Styles.UserView key={user}>
            <Styles.Name>{user}</Styles.Name>
          </Styles.UserView>
        ))}
        { localStream && !!myUsers.length && (
          <Styles.Button onClick={action}>Start</Styles.Button>
        )}
      </Styles.Content>
      <Loading isLoading={!!!localStream.getTracks().length}/>
    </Styles.Container>
  );
};
export default StartStep;
