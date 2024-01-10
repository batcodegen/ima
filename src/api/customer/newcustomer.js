import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';
import Endpoint from '../endpoints';

export const createCustomerApi = createApi({
  reducerPath: 'createCustomer',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://142.93.209.63:8000', // actual - Endpoint.BASE_URL
    prepareHeaders: (baseHeaders, {getState}) => {
      const token = getState().auth.token;
      if (token) {
        baseHeaders.set('Authorization', `Token ${token}`);
      }
      return baseHeaders;
    },
  }),
  endpoints: builder => ({
    createCustomer: builder.mutation({
      query: payload => ({
        url: Endpoint.CREATE_CUSTOMER,
        method: 'POST',
        body: payload,
      }),
    }),
  }),
});

export const {useCreateCustomerMutation} = createCustomerApi;
