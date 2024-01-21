import {
  DrawerContentScrollView,
  DrawerItem,
  createDrawerNavigator,
} from '@react-navigation/drawer';
import React from 'react';
import {Button, StyleSheet, Text, View} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {onLogout} from '../redux/authReducer';
import {HandoverScreen} from '../screens/customer/HandoverScreen';
import {ROUTES} from './routes';
import CylinderDelivery2 from '../screens/customer/CylinderDelivery2';
import NewCustomer from '../components/NewCustomer';
import {useNavigation} from '@react-navigation/native';
import {handoverRequestApi} from '../api/customer/handoverRequest';

const CustomerDrawerStack = createDrawerNavigator();

function CustomDrawerContent(props) {
  const dispatch = useDispatch();
  const {user} = useSelector(state => state.auth);
  const navigation = useNavigation();
  const activeRouteName = props.state.routeNames[props.state.index];

  return (
    <View style={styles.container}>
      <DrawerContentScrollView {...props}>
        <View style={styles.drawerHeader}>
          <Text style={styles.welcomestyle}>{'Welcome'}</Text>
          <Text
            style={
              styles.customerName
            }>{`${user?.first_name} ${user?.last_name}`}</Text>
        </View>
        <View style={{flex: 1}}>
          <DrawerItem
            label={'Delivery'}
            focused={activeRouteName === ROUTES.CYLINDERDELIVERY}
            onPress={() => navigation.navigate(ROUTES.CYLINDERDELIVERY)}
          />
          <DrawerItem
            label={'Handover'}
            focused={activeRouteName === ROUTES.HANDOVER}
            onPress={() => navigation.navigate(ROUTES.HANDOVER)}
          />
        </View>
      </DrawerContentScrollView>
      <View>
        <Button
          title="LOGOUT"
          onPress={async () => {
            props.navigation.closeDrawer();
            try {
              //Logout logic
              dispatch(handoverRequestApi.util.resetApiState());
              dispatch(onLogout());
            } catch (e) {
              console.log(e);
            }
          }}
        />
      </View>
    </View>
  );
}

const CustomerStack = () => {
  return (
    <CustomerDrawerStack.Navigator
      drawerType="front"
      screenOptions={{headerShown: true, headerTitleAlign: 'center'}}
      initialRouteName={ROUTES.CYLINDERDELIVERY}
      drawerContent={props => <CustomDrawerContent {...props} />}>
      <CustomerDrawerStack.Screen
        name={ROUTES.CYLINDERDELIVERY}
        component={CylinderDelivery2}
        options={{title: 'Delivery'}}
      />
      <CustomerDrawerStack.Screen
        name={'NewCustomer'}
        component={NewCustomer}
        options={{headerShown: false}}
      />
      <CustomerDrawerStack.Screen
        name={ROUTES.HANDOVER}
        component={HandoverScreen}
        options={{title: 'Handover'}}
      />
    </CustomerDrawerStack.Navigator>
  );
};

export default CustomerStack;

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  drawerHeader: {
    backgroundColor: '#F1F1F1',
    margin: 5,
    marginTop: 0,
    marginBottom: 8,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  welcomestyle: {
    fontSize: 20,
    textAlign: 'center',
    padding: 10,
    color: 'black',
  },
  customerName: {
    fontSize: 20,
    fontWeight: 'bold',
    padding: 10,
    textAlign: 'center',
    color: 'black',
  },
});
