import { useDispatch, useSelector } from "react-redux";
import { setShowMessageSend } from "../../slices/messageSlice";
import Option from "./Option";
import * as Styles from "./styles";
import { RootState } from "../../store";
import { setMicIsOn } from "../../slices/appSile";

const Menu = () => {
  const dispatch = useDispatch();
  const micIsOn = useSelector((state: RootState) => state.app.micIsOn);
  const options = [
    {
      label: "chat",
      value: "forum",
      onClick: () => {
        dispatch(setShowMessageSend(true));
      },
    },
    {
      label: "microphone",
      value: micIsOn ? "mic" : "mic_off",
      onClick: () => {
        dispatch(setMicIsOn(!micIsOn));
      },
    },
  ];
  return (
    <Styles.Container>
      {options.map((option) => (
        <Option key={option.value} onClick={option.onClick}>
          {option.value}
        </Option>
      ))}
    </Styles.Container>
  );
};

export default Menu;
