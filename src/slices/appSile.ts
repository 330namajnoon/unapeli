import { createSlice } from "@reduxjs/toolkit";

export type AppSliceState = {
  micIsOn: boolean;
  id: string | null;
  roomId: string | null;
  path: string | null;
  youtubeId: string | null;
  peerConnectionUsers: string[];
  shareScreen: boolean;
};

const initialState: AppSliceState = {
  micIsOn: true,
  id: new URLSearchParams(window.location.search).get("id"),
  roomId: new URLSearchParams(window.location.search).get("roomId"),
  path: new URLSearchParams(window.location.search).get("path"),
  youtubeId: new URLSearchParams(window.location.search).get("youtubeId"),
  shareScreen: false,
  peerConnectionUsers: [],
};

const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    setMicIsOn: (state, action) => {
      state.micIsOn = action.payload;
    },
    setPath: (state, action) => {
      state.path = action.payload;
    },
    setPeerConnectionUsers: (state, action) => {
      state.peerConnectionUsers = action.payload;
    },
    addUser: (state, action) => {
      state.peerConnectionUsers.push(action.payload);
    },
    removeUser: (state, action) => {
      state.peerConnectionUsers = state.peerConnectionUsers.filter(
        (userId) => userId !== action.payload
      );
    },
    setShareScreen: (state, action) => {
      state.shareScreen = action.payload;
    }
  },
});

export default appSlice.reducer;
export const { setMicIsOn, setPath, addUser, removeUser, setPeerConnectionUsers, setShareScreen } = appSlice.actions;
