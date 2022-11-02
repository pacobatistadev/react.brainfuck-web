import { configureStore } from '@reduxjs/toolkit'
import programReducer from './programSlice'

const store = configureStore({
  reducer: {
    program: programReducer
  },
})

export default store;
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch