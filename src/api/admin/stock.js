import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';
import Endpoint from '../endpoints';

export const stockReportApi = createApi({
  reducerPath: 'stock',
  baseQuery: fetchBaseQuery({
    baseUrl: Endpoint.BASE_URL, // actual - Endpoint.BASE_URL
    prepareHeaders: (baseHeaders, {getState}) => {
      const token = getState().auth.token;
      if (token) {
        baseHeaders.set('Authorization', `Token ${token}`);
      }
      return baseHeaders;
    },
  }),
  endpoints: builder => ({
    getStockReport: builder.query({
      query: () => Endpoint.STOCK,
    }),
  }),
});

export const {useGetStockReportQuery} = stockReportApi;
