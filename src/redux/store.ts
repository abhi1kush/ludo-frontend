import { combineReducers, legacy_createStore as createStore } from 'redux';
import { gameReducer } from './reducers/gameReducer';

const rootReducer = combineReducers({
  game: gameReducer,
});

export const store = createStore(rootReducer);
export type RootState = ReturnType<typeof rootReducer>;
