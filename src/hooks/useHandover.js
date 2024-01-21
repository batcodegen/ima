import {useDispatch, useSelector} from 'react-redux';
import {updateLoaderState} from '../redux/loaderReducer';
import translation from '../helpers/strings.json';
import {useEffect} from 'react';
import {
  useCreateNewRequestMutation,
  useGetHandoverDataQuery,
  useUpdateRequestStatusMutation,
} from '../api/customer/handoverRequest';
import {formatRequiredFieldsMessage} from '../helpers/utils';

export const useHandover = () => {
  const {data, error, isLoading, isFetching, refetch} =
    useGetHandoverDataQuery();
  const [updateRequestStatus] = useUpdateRequestStatusMutation();
  const [createNewRequest] = useCreateNewRequestMutation();
  const isLoggedIn = useSelector(state => state.auth.isLoggedIn);

  const dispatch = useDispatch();

  useEffect(() => {
    if (isLoggedIn) {
      if (isFetching || isLoading) {
        dispatch(updateLoaderState({isLoading: true}));
      }
      if (data) {
        dispatch(updateLoaderState({isLoading: false}));
      }
    }
  }, [data, isFetching, isLoading, isLoggedIn]);

  const updateRequest = async ({id, status}) => {
    try {
      dispatch(updateLoaderState({isLoading: true}));
      const response = await updateRequestStatus({id, status});
      if (response.data) {
        refetch();
      } else if (response.error) {
        formatRequiredFieldsMessage(response.error);
      }
    } catch (e) {
      formatRequiredFieldsMessage(e);
    } finally {
      dispatch(updateLoaderState({isLoading: false}));
    }
  };

  const createHandoverRequest = async reqData => {
    try {
      dispatch(updateLoaderState({isLoading: true}));
      const response = await createNewRequest(reqData);
      if (response.data) {
        return {success: true};
      } else if (response.error) {
        return {
          success: false,
          error: formatRequiredFieldsMessage(response.error),
        };
      }
    } catch (e) {
      return {success: false, error: formatRequiredFieldsMessage(e)};
    } finally {
      dispatch(updateLoaderState({isLoading: false}));
    }
  };

  return {data, refetch, updateRequest, createHandoverRequest};
};
