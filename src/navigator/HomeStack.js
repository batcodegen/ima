import React from 'react';
import {ROUTES} from './routes';
import {createStackNavigator} from '@react-navigation/stack';
import AdminStack from './AdminStack';

const HomeScreenStack = createStackNavigator();

const HomeStack = () => {
  return (
    <HomeScreenStack.Navigator screenOptions={{headerShown: false}}>
      <HomeScreenStack.Screen name={ROUTES.ADMINSTACK} component={AdminStack} />
    </HomeScreenStack.Navigator>
  );
};

export default HomeStack;
