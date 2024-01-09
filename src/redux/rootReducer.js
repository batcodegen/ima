import AsyncStorage from '@react-native-async-storage/async-storage';
import {combineReducers} from 'redux';
import {persistReducer} from 'redux-persist';
import authReducer from './authReducer';
import {loginApi} from '../api/login';
import {financeApi} from '../api/admin/finance';
import appLoaderReducer from './loaderReducer';

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
};
const persistedReducer = persistReducer(persistConfig, authReducer);

const rootReducer = combineReducers({
  auth: persistedReducer,
  appLoader: appLoaderReducer,
  [loginApi.reducerPath]: loginApi.reducer,
  [financeApi.reducerPath]: financeApi.reducer,
});

export default rootReducer;
