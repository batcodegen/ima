import {useDispatch} from 'react-redux';
import {updateLoaderState} from '../redux/loaderReducer';
import translation from '../helpers/strings.json';
import {useEffect} from 'react';
import {useGetStockReportQuery} from '../api/admin/stock';

export const useStockReport = () => {
  const {data, error, isLoading, isFetching} = useGetStockReportQuery();
  const dispatch = useDispatch();

  useEffect(() => {
    if (isFetching || isLoading) {
      dispatch(updateLoaderState({isLoading: true}));
    }
    if (data) {
      dispatch(updateLoaderState({isLoading: false}));
    }
  }, [data, isFetching, isLoading]);

  return {data};
};
