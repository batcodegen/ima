import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';
import Endpoint from './endpoints';
import API_METHOD from './methods';

export const loginApi = createApi({
  reducerPath: 'login',
  baseQuery: fetchBaseQuery({baseUrl: Endpoint.BASE_URL}),
  endpoints: builder => ({
    loginUser: builder.mutation({
      query: payload => ({
        url: Endpoint.LOGIN,
        method: API_METHOD.POST,
        body: payload,
      }),
    }),
  }),
});

export const {useLoginUserMutation} = loginApi;
