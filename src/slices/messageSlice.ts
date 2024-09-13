import { createSlice } from "@reduxjs/toolkit";

const messageSlice = createSlice({
  name: "message",
  initialState: {
    message: "",
    sendedMessage: "",
    showMessage: false,
    showMessageSend: false,
  },
  reducers: {
    setMessage: (state, action) => {
      state.message = action.payload;
    },
    setShowMessage: (state, action) => {
      state.showMessage = action.payload;
    },
    setShowMessageSend: (state, action) => {
      state.showMessageSend = action.payload;
    },
    setSendedMessage: (state, action) => {
      state.sendedMessage = action.payload;
    },
  },
});

export type MessageState = ReturnType<(typeof messageSlice)["reducer"]>;
export default messageSlice.reducer;
export const { setMessage, setShowMessage, setShowMessageSend, setSendedMessage } =
  messageSlice.actions;
