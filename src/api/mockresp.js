import {createServer} from 'miragejs';
import ENDPOINTS from './endpoints';
// import financereport from '../assets/dummydata/financereport.json';

if (window.server) {
  window.server.shutdown();
}

window.server = createServer({
  routes() {
    // this.get(`${ENDPOINTS.BASE_URL}${ENDPOINTS.FINANCE}`, () => {
    //   return financereport;
    // });
    this.passthrough(
      `${ENDPOINTS.BASE_URL}${ENDPOINTS.LOGIN}`,
      `${ENDPOINTS.BASE_URL}${ENDPOINTS.DELIVERY}`,
      `${ENDPOINTS.BASE_URL}${ENDPOINTS.CREATE_CUSTOMER}`,
      `${ENDPOINTS.BASE_URL}${ENDPOINTS.CREATE_SALE}`,
      `${ENDPOINTS.BASE_URL}${ENDPOINTS.ADMIN_STOCK_DASHBOARD}`,
      `${ENDPOINTS.BASE_URL}${ENDPOINTS.GET_HANDOVER_LIST}`,
      `${ENDPOINTS.BASE_URL}${ENDPOINTS.UPDATE_HANDOVER_LIST}/**`,
      `${ENDPOINTS.BASE_URL}${ENDPOINTS.UPDATE_HANDOVER_LIST}/`,
      `${ENDPOINTS.BASE_URL}${ENDPOINTS.FINANCE}?date_range=today`,
    );
  },
});
