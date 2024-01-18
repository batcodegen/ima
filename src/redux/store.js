import {configureStore} from '@reduxjs/toolkit';
import {persistStore} from 'redux-persist';
import monitorReducerEnhancer from './enhancer/monitorReducer';
import logger from './logger/middlewarelogger';
import rootReducer from './rootReducer';
import {loginApi} from '../api/login';
import {financeApi} from '../api/admin/finance';
import {stockReportApi} from '../api/admin/stock';
import {deliveryApi} from '../api/admin/delivery';
import {createCustomerApi} from '../api/customer/newcustomer';
import {createSaleApi} from '../api/customer/createSale';
import {handoverRequestApi} from '../api/customer/handoverRequest';

function configureAppStore() {
  const store = configureStore({
    reducer: rootReducer,
    middleware: getDefaultMiddleware =>
      getDefaultMiddleware({serializableCheck: false})
        .prepend(logger)
        .concat(loginApi.middleware) // add new api middleware here, e.g. .concat(loginApi.middleware)
        .concat(financeApi.middleware)
        .concat(stockReportApi.middleware)
        .concat(deliveryApi.middleware)
        .concat(createCustomerApi.middleware)
        .concat(createSaleApi.middleware)
        .concat(handoverRequestApi.middleware),
    enhancers: getDefaultEnhancers =>
      getDefaultEnhancers(monitorReducerEnhancer),
  });

  if (module.hot) {
    module.hot.accept('./reducers', () => store.replaceReducer(rootReducer));
  }

  return store;
}

const store = configureAppStore();
const peristor = persistStore(store);

export {peristor, store};
