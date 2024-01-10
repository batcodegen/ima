import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import AppTheme from '../theme/appcolor';
import {ROUTES} from './routes';
import HomeStack from './HomeStack';
import AuthStack from './AuthStack';
import {useSelector} from 'react-redux';
import {createStackNavigator} from '@react-navigation/stack';
import Loader from '../components/Loader';
import RNBootSplash from 'react-native-bootsplash';

const Stack = createStackNavigator();

const AppNavigator = () => {
  const isLoggedIn = useSelector(state => state.auth.isLoggedIn);
  const isLoading = useSelector(state => state.appLoader.isLoading);
  return (
    <NavigationContainer theme={AppTheme} onReady={() => RNBootSplash.hide()}>
      <>
        <Stack.Navigator screenOptions={{headerShown: false}}>
          {isLoggedIn ? (
            <Stack.Screen name={ROUTES.HOMESTACK} component={HomeStack} />
          ) : (
            <Stack.Screen name={ROUTES.AUTHSTACK} component={AuthStack} />
          )}
        </Stack.Navigator>
        <Loader isLoading={isLoading} />
      </>
    </NavigationContainer>
  );
};

export default AppNavigator;
