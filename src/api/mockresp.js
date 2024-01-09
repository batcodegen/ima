import {createServer} from 'miragejs';
import ENDPOINTS from './endpoints';
import financereport from '../assets/dummydata/financereport.json';

if (window.server) {
  server.shutdown();
}

window.server = createServer({
  routes() {
    this.get(`${ENDPOINTS.BASE_URL}/financereport`, () => {
      return financereport;
    });
  },
});
