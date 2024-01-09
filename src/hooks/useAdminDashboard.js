import {useDispatch} from 'react-redux';
import {updateLoaderState} from '../redux/loaderReducer';
import translation from '../helpers/strings.json';
import {useGetFinanceReportQuery} from '../api/admin/finance';
import {useEffect} from 'react';

export const useFinanceReport = () => {
  const {data, error, isLoading, isFetching} = useGetFinanceReportQuery();
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
