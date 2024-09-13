import { createSlice } from "@reduxjs/toolkit";

const appSlice = createSlice({
  name: "app",
  initialState: {
    micIsOn: true,
    id: new URLSearchParams(window.location.search).get("id"),
    path: new URLSearchParams(window.location.search).get("path"),
    youtubeId: new URLSearchParams(window.location.search).get("youtubeId"),
  },
  reducers: {
    setMicIsOn: (state, action) => {
      state.micIsOn = action.payload;
    },
    setPath: (state, action) => {
      state.path = action.payload;
    },
  },
});

export default appSlice.reducer;
export const { setMicIsOn, setPath } = appSlice.actions;
