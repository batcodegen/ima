import {useDispatch} from 'react-redux';
import {useLoginUserMutation} from '../api/login';
import {updateLoaderState} from '../redux/loaderReducer';
import {onLogin, onLoginError} from '../redux/authReducer';
import translation from '../helpers/strings.json';

export const useSigninUser = () => {
  const [loginuser, {isLoading}] = useLoginUserMutation();
  const dispatch = useDispatch();
  const signInUser = async ({email, password}) => {
    try {
      dispatch(updateLoaderState({isLoading: true}));
      const response = await loginuser({email, password});
      if (response.data) {
        dispatch(onLogin(response.data));
      } else if (response.error) {
        dispatch(
          onLoginError({
            error:
              response.error?.data?.detail || translation.somethingwentwrong,
          }),
        );
      }
    } catch (e) {
      console.log('-response login error-', e);
    } finally {
      dispatch(updateLoaderState({isLoading: false}));
    }
  };

  return {signInUser};
};
