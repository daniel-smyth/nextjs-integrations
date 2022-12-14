import { configureStore } from '@reduxjs/toolkit';
import { apiSlice } from './slices/api';
import userReduce from './slices/userSlice';

export const store = configureStore({
  reducer: {
    user: userReduce,
    [apiSlice.reducerPath]: apiSlice.reducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware)
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
