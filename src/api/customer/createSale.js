import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';
import Endpoint from '../endpoints';

export const createSaleApi = createApi({
  reducerPath: 'createsale',
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
    createSale: builder.mutation({
      query: payload => ({
        url: Endpoint.CREATE_SALE,
        method: 'POST',
        body: payload,
      }),
    }),
  }),
});

export const {useCreateSaleMutation} = createSaleApi;
