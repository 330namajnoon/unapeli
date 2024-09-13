import { useDispatch, useSelector } from "react-redux";
import * as Styles from "./styles";
import { RootState } from "../../store";
import { useCallback, useEffect, useRef } from "react";
import {
  setMessage,
  setSendedMessage,
  setShowMessage,
  setShowMessageSend,
} from "../../slices/messageSlice";
import socket from "../../socket";

const MessageModal = () => {
  const dispatch = useDispatch();
  const timeout = useRef<any>(null);
  const id = useSelector((state: RootState) => state.app.id);
  const message: string = useSelector(
    (state: RootState) => state.comunication.message
  );
  const sendedMessage: string = useSelector(
    (state: RootState) => state.comunication.sendedMessage
  );
  const showMessage: boolean = useSelector(
    (state: RootState) => state.comunication.showMessage
  );
  const showMessageSend: boolean = useSelector(
    (state: RootState) => state.comunication.showMessageSend
  );

  const sendMessage = useCallback(() => {
    if (!message) return;
    socket.emit("data", { message }, id);
    dispatch(setMessage(""));
  }, [message]);

  useEffect(() => {
    socket.on(`data_${id}`, (data: any) => {
      if (data.message) {
        clearTimeout(timeout.current);
        dispatch(setSendedMessage(data.message));
        dispatch(setShowMessage(true));
        timeout.current = setTimeout(() => {
          dispatch(setSendedMessage(""));
          dispatch(setShowMessage(false));
        }, 5000);
      }
    });
  }, []);

  useEffect(() => {
    window.document.addEventListener("keyup", (e) => {
      if (e.key === "Enter") {
        sendMessage();
      }
    });
    return () => {
      window.removeEventListener("keyup", () => {});
    };
  }, [sendMessage]);

  return (
    <Styles.Container>
      {showMessage && !!sendedMessage && (
        <Styles.Message>{sendedMessage}</Styles.Message>
      )}
      {showMessageSend && (
        <Styles.MessageSend
          onClick={() => {
            dispatch(setShowMessageSend(false));
          }}
        >
          <Styles.MessageTextInput
            type="text"
            value={message}
            placeholder="Escribe un mensage!"
            onClick={(e) => e.stopPropagation()}
            onChange={(e) => {
              e.stopPropagation();
              dispatch(setMessage(e.target.value));
            }}
          />
          <Styles.MessageSendButton
            onClick={(e) => {
              e.stopPropagation();
              sendMessage();
            }}
            className="material-symbols-outlined"
          >
            send
          </Styles.MessageSendButton>
        </Styles.MessageSend>
      )}
    </Styles.Container>
  );
};

export default MessageModal;
