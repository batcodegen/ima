import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';
import Endpoint from '../endpoints';

export const deliveryApi = createApi({
  reducerPath: 'delivery',
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
    getDeliveryData: builder.query({
      query: () => Endpoint.DELIVERY,
    }),
  }),
});

export const {useGetDeliveryDataQuery} = deliveryApi;
