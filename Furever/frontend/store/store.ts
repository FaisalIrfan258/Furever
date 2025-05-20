import { configureStore } from "@reduxjs/toolkit"
import authReducer from "./slices/auth-slice"
import petsReducer from "./slices/pets-slice"
import adoptionsReducer from "./slices/adoptions-slice"
import lostFoundReducer from "./slices/lost-found-slice"

export const store = configureStore({
  reducer: {
    auth: authReducer,
    pets: petsReducer,
    adoptions: adoptionsReducer,
    lostFound: lostFoundReducer,
  },
  devTools: process.env.NODE_ENV !== "production",
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
