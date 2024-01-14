import React from 'react';
import {ROUTES} from './routes';
import {createStackNavigator} from '@react-navigation/stack';
import AdminStack from './AdminStack';
import {useSelector} from 'react-redux';
import CustomerStack from './CustomerStack';

const HomeScreenStack = createStackNavigator();

const HomeStack = () => {
  const user = useSelector(state => state.auth.user);
  return (
    <HomeScreenStack.Navigator screenOptions={{headerShown: false}}>
      {user?.role === 'admin' ? (
        <HomeScreenStack.Screen
          name={ROUTES.ADMINSTACK}
          component={AdminStack}
        />
      ) : (
        <HomeScreenStack.Screen
          name={ROUTES.CUSTOMERSTACK}
          component={CustomerStack}
        />
      )}
    </HomeScreenStack.Navigator>
  );
};

export default HomeStack;
