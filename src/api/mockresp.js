import {createServer} from 'miragejs';
import ENDPOINTS from './endpoints';
import financereport from '../assets/dummydata/financereport.json';
// import stockreport from '../assets/dummydata/stockreport.json';
// import deliverydata from '../assets/dummydata/deliverydata.json';
import handoverdata from '../assets/dummydata/handover.json';
// import loginre from '../assets/dummydata/login.json';

if (window.server) {
  window.server.shutdown();
}

window.server = createServer({
  routes() {
    this.get(`${ENDPOINTS.BASE_URL}${ENDPOINTS.FINANCE}`, () => {
      return financereport;
    });

    // this.get(`${ENDPOINTS.BASE_URL}${ENDPOINTS.STOCK}`, () => {
    //   return stockreport;
    // });

    this.get(`${ENDPOINTS.BASE_URL}${ENDPOINTS.HANDOVER}`, () => {
      return handoverdata;
    });

    // this.get(`${ENDPOINTS.BASE_URL}${ENDPOINTS.DELIVERY}`, () => {
    //   return deliverydata;
    // });
    this.passthrough(
      `${ENDPOINTS.BASE_URL}${ENDPOINTS.LOGIN}`,
      `${ENDPOINTS.BASE_URL}${ENDPOINTS.DELIVERY}`,
      `${ENDPOINTS.BASE_URL}${ENDPOINTS.CREATE_CUSTOMER}`,
      `${ENDPOINTS.BASE_URL}${ENDPOINTS.CREATE_SALE}`,
      `${ENDPOINTS.BASE_URL}${ENDPOINTS.ADMIN_STOCK_DASHBOARD}`,
    );
  },
});
