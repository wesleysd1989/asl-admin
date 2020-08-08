import storage from 'redux-persist/lib/storage';
import { persistReducer } from 'redux-persist';

export default reducers => {
  const persistedReducer = persistReducer(
    {
      key: 'controlpanel',
      storage,
      whitelist: ['auth', 'user'],
    },
    reducers,
  );

  return persistedReducer;
};
