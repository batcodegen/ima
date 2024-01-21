import {useDispatch, useSelector} from 'react-redux';
import {updateLoaderState} from '../redux/loaderReducer';
import translation from '../helpers/strings.json';
import {useEffect} from 'react';
import {useGetStockReportQuery} from '../api/admin/stock';

export const useStockReport = () => {
  const {data, error, isLoading, isFetching, refetch} =
    useGetStockReportQuery();
  const dispatch = useDispatch();
  const isLoggedIn = useSelector(state => state.auth.isLoggedIn);

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

  return {
    refetch,
    summaryreport: data?.summaryreport,
    locationreport: data?.locations,
    cumulativeData: {
      filled: data?.total_filled_quantity ?? 0,
      empty: data?.total_empty_quantity ?? 0,
      total: data?.total_products ?? 0,
      customerFilled: data?.total_customer_filled ?? 0,
    },
  };
};
