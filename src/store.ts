import { configureStore } from "@reduxjs/toolkit";
import appSile from "./slices/appSile";
import messageSlice from "./slices/messageSlice";

const store = configureStore({
  reducer: {
    app: appSile,
    comunication: messageSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export default store;
