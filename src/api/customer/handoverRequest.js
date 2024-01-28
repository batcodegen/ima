import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';
import Endpoint from '../endpoints';
import API_METHOD from '../methods';

export const handoverRequestApi = createApi({
  reducerPath: 'handover',
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
  refetchOnFocus: true,
  refetchOnMountOrArgChange: true,
  endpoints: builder => ({
    getHandoverData: builder.query({
      query: () => Endpoint.GET_HANDOVER_LIST,
    }),
    updateRequestStatus: builder.mutation({
      query: ({id, status}) => ({
        url: `${Endpoint.UPDATE_HANDOVER_LIST}/${id}/`,
        method: API_METHOD.PATCH,
        body: {
          id: id,
          status: status,
        },
      }),
    }),
    createNewRequest: builder.mutation({
      query: body => ({
        url: `${Endpoint.UPDATE_HANDOVER_LIST}/`,
        method: API_METHOD.POST,
        body,
      }),
    }),
  }),
});

export const {
  useGetHandoverDataQuery,
  useUpdateRequestStatusMutation,
  useCreateNewRequestMutation,
} = handoverRequestApi;
