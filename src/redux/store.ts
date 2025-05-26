import { combineReducers } from 'redux';
import { configureStore } from '@reduxjs/toolkit';
import { gameReducer } from './reducers/gameReducer';
import { createLogger } from 'redux-logger';

const logger = createLogger({
    collapsed: true, // Collapse logs by default
    // You can add more options here, e.g.,
    predicate: (getState, action) => action.type !== 'SOME_IGNORED_ACTION',
  });

const rootReducer = combineReducers({
  game: gameReducer,
});

export const store = configureStore({
    reducer: rootReducer,
    // 3. Add the logger middleware
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(logger),
    // Optional: Disable Redux DevTools Extension in production
    devTools: process.env.NODE_ENV !== 'production',
  });

export type RootState = ReturnType<typeof rootReducer>;
