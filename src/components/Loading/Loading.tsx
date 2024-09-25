import { LifeLine } from "react-loading-indicators";
import * as Styles from "./styles";

const Loading = ({ isLoading = false }) => {
  return (
    isLoading && (
      <Styles.Container>
        <LifeLine
          color="#2cd12c"
          size="medium"
          text="LOADING"
          textColor="#309c42"
        />
      </Styles.Container>
    )
  );
};

export default Loading;
