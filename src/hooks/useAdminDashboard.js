import {useDispatch, useSelector} from 'react-redux';
import {updateLoaderState} from '../redux/loaderReducer';
import {
  useGetFinanceReportQuery,
  useLazyGetFinanceReportQuery,
} from '../api/admin/finance';
import {useEffect, useState} from 'react';

export const useFinanceReport = () => {
  const [apiResponse, setApiResponse] = useState(null);
  const {data, error, isLoading, isFetching, refetch} =
    useGetFinanceReportQuery({
      date_range: 'today',
    });
  const [fetchDataForDate] = useLazyGetFinanceReportQuery();
  const dispatch = useDispatch();
  const isLoggedIn = useSelector(state => state.auth.isLoggedIn);

  useEffect(() => {
    if (isLoggedIn) {
      if (isFetching || isLoading) {
        dispatch(updateLoaderState({isLoading: true}));
      }
      if (data) {
        setApiResponse(data);
        dispatch(updateLoaderState({isLoading: false}));
      }
    }
  }, [data, isFetching, isLoading, isLoggedIn]);

  const fetchData = async date => {
    try {
      dispatch(updateLoaderState({isLoading: true}));
      const response = await fetchDataForDate(date);
      if (response?.data) {
        setApiResponse(response?.data);
      }
    } catch (e) {
      console.log('fetchDataForDate error : ', e);
    } finally {
      dispatch(updateLoaderState({isLoading: false}));
    }
  };
  console.log('apiResponse : ', apiResponse);
  return {data: apiResponse, fetchData, refetch};
};
