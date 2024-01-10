import {createServer} from 'miragejs';
import ENDPOINTS from './endpoints';
import financereport from '../assets/dummydata/financereport.json';
import stockreport from '../assets/dummydata/stockreport.json';
import deliverydata from '../assets/dummydata/deliverydata.json';

if (window.server) {
  window.server.shutdown();
}

window.server = createServer({
  routes() {
    this.get(`${ENDPOINTS.BASE_URL}${ENDPOINTS.FINANCE}`, () => {
      return financereport;
    });

    this.get(`${ENDPOINTS.BASE_URL}${ENDPOINTS.STOCK}`, () => {
      return stockreport;
    });

    // this.get(`${ENDPOINTS.BASE_URL}${ENDPOINTS.DELIVERY}`, () => {
    //   return deliverydata;
    // });
    this.passthrough(
      `${ENDPOINTS.BASE_URL}${ENDPOINTS.DELIVERY}`,
      'http://142.93.209.63:8000/customers/api/',
    );
  },
});
