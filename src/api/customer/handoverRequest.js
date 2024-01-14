import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';
import Endpoint from '../endpoints';

export const handoverRequestApi = createApi({
  reducerPath: 'delivery',
  baseQuery: fetchBaseQuery({
    baseUrl: Endpoint.BASE_URL,
    prepareHeaders: (baseHeaders, {getState}) => {
      const token = getState().auth.token;
      if (token) {
        baseHeaders.set('Authorization', `Token ${token}`);
      }
      return baseHeaders;
    },
  }),
  endpoints: builder => ({
    getHandoverData: builder.query({
      query: () => Endpoint.DELIVERY,
    }),
  }),
});

export const {useGetDeliveryDataQuery} = handoverRequestApi;
