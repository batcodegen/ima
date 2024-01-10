import {useDispatch} from 'react-redux';
import {updateLoaderState} from '../redux/loaderReducer';
import translation from '../helpers/strings.json';
import {useEffect} from 'react';
import {useGetDeliveryDataQuery} from '../api/admin/delivery';
import {useCreateCustomerMutation} from '../api/customer/newcustomer';
import {formatRequiredFieldsMessage} from '../helpers/utils';

export const useGetDeliveryData = () => {
  const {data, error, isLoading, isFetching} = useGetDeliveryDataQuery();
  const [createCustomer] = useCreateCustomerMutation();
  const dispatch = useDispatch();

  useEffect(() => {
    if (isFetching || isLoading) {
      dispatch(updateLoaderState({isLoading: true}));
    }
    if (data) {
      dispatch(updateLoaderState({isLoading: false}));
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

  return {
    deliverydata: data?.customers_list,
    weightsData: data?.product_list,
    callCreateCustomerApi,
  };
};
