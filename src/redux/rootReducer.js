import AsyncStorage from '@react-native-async-storage/async-storage';
import {combineReducers} from 'redux';
import {persistReducer} from 'redux-persist';
import authReducer from './authReducer';
import {loginApi} from '../api/login';
import {financeApi} from '../api/admin/finance';
import appLoaderReducer from './loaderReducer';
import {stockReportApi} from '../api/admin/stock';
import {deliveryApi} from '../api/admin/delivery';
import {createCustomerApi} from '../api/customer/newcustomer';

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
  [stockReportApi.reducerPath]: stockReportApi.reducer,
  [deliveryApi.reducerPath]: deliveryApi.reducer,
  [createCustomerApi.reducerPath]: createCustomerApi.reducer,
});

export default rootReducer;
