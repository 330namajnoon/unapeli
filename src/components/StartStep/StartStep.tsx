import * as Styles from "./styles";

export interface StartStepProps {
  action: () => void;
}

const StartStep = ({ action }: StartStepProps) => {
  return (
    <Styles.Container>
        <Styles.Button onClick={action}>Start</Styles.Button>
    </Styles.Container>
  );
};
export default StartStep;
