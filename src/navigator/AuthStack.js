import React from 'react';
import {ROUTES} from './routes';
import {createStackNavigator} from '@react-navigation/stack';
import LoginScreen from '../screens/login/Login';

const AuthScreenStack = createStackNavigator();

const AuthStack = () => {
  return (
    <AuthScreenStack.Navigator screenOptions={{headerShown: false}}>
      <AuthScreenStack.Screen name={ROUTES.LOGIN} component={LoginScreen} />
    </AuthScreenStack.Navigator>
  );
};

export default AuthStack;
