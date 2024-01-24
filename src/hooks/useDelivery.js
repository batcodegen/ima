import {useDispatch, useSelector} from 'react-redux';
import {updateLoaderState} from '../redux/loaderReducer';
import {useEffect} from 'react';
import {
  useGetDeliveryDataQuery,
  useLazyGetDeliveryDataQuery,
} from '../api/admin/delivery';
import {useCreateCustomerMutation} from '../api/customer/newcustomer';
import {formatRequiredFieldsMessage} from '../helpers/utils';
import {onDeliveryFetchSuccess} from '../redux/deliveryReducer';
import {useCreateSaleMutation} from '../api/customer/createSale';

export const useGetDeliveryData = () => {
  const {data, error, isLoading, isFetching, refetch} =
    useGetDeliveryDataQuery();
  const [createCustomer] = useCreateCustomerMutation();
  const [createSale] = useCreateSaleMutation();
  const dispatch = useDispatch();
  const isLoggedIn = useSelector(state => state.auth.isLoggedIn);

  useEffect(() => {
    if (isLoggedIn) {
      if (isFetching || isLoading) {
        dispatch(updateLoaderState({isLoading: true}));
      }
      if (data) {
        dispatch(onDeliveryFetchSuccess(data));
        dispatch(updateLoaderState({isLoading: false}));
      }
    }
  }, [data, isFetching, isLoading]);

  const callCreateCustomerApi = async custData => {
    try {
      dispatch(updateLoaderState({isLoading: true}));
      const response = await createCustomer(custData);
      if (response?.data) {
        return {success: true};
      } else if (response?.error) {
        return {
          success: false,
          error: formatRequiredFieldsMessage(response?.error?.data),
        };
      }
    } catch (e) {
      return false;
    } finally {
      dispatch(updateLoaderState({isLoading: false}));
    }
  };

  const callCustomerSaleApi = async saledata => {
    try {
      dispatch(updateLoaderState({isLoading: true}));
      const response = await createSale(saledata);
      if (response?.data) {
        return {success: true};
      } else if (response?.error) {
        if (response.error.originalStatus === 500) {
          return {
            success: false,
            error: `${response.error.originalStatus} : ${response.error.status}`,
          };
        }
        return {
          success: false,
          error:
            response?.error?.data?.errors ??
            formatRequiredFieldsMessage(response?.error?.data),
        };
      }
    } catch (e) {
      return {
        success: false,
        error: 'Something went wrong please try again',
      };
    } finally {
      dispatch(updateLoaderState({isLoading: false}));
    }
  };

  return {
    deliverydata: data?.customerinfo,
    weightsData: data?.productinfo,
    callCreateCustomerApi,
    callCustomerSaleApi,
    refetchDeliveryData: () => refetch(),
  };
};
