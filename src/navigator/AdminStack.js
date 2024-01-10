import React from 'react';
import {ROUTES} from './routes';
import Dashboard from '../screens/admin/Dashboard';
import {
  DrawerContentScrollView,
  DrawerItemList,
  createDrawerNavigator,
} from '@react-navigation/drawer';
import {Button, StyleSheet, Text, View} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {onLogout} from '../redux/authReducer';
import FinanceReport from '../screens/admin/FinanceReport';
import StockReport from '../screens/admin/StockReport';

const AdminDrawerStack = createDrawerNavigator();

function CustomDrawerContent(props) {
  const dispatch = useDispatch();
  const {first_name, last_name} = useSelector(state => state.auth.user);

  return (
    <View style={styles.container}>
      <DrawerContentScrollView {...props}>
        <View style={styles.drawerHeader}>
          <Text style={styles.welcomestyle}>{'Welcome'}</Text>
          <Text
            style={styles.customerName}>{`${first_name} ${last_name}`}</Text>
        </View>
        <View style={{flex: 1}}>
          <DrawerItemList {...props} />
        </View>
      </DrawerContentScrollView>
      <View>
        <Button
          title="LOGOUT"
          onPress={async () => {
            props.navigation.closeDrawer();
            try {
              //Logout logic
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

const AdminStack = () => {
  return (
    <AdminDrawerStack.Navigator
      drawerType="front"
      screenOptions={{headerShown: true, headerTitleAlign: 'center'}}
      initialRouteName={ROUTES.DASHBOARD}
      drawerContent={props => <CustomDrawerContent {...props} />}>
      <AdminDrawerStack.Screen
        name={ROUTES.DASHBOARD}
        component={Dashboard}
        options={{title: 'Dashboard'}}
      />
      <AdminDrawerStack.Screen
        name={ROUTES.FINANCEREPORT}
        component={FinanceReport}
        options={{title: 'Finance Report'}}
      />
      <AdminDrawerStack.Screen
        name={ROUTES.STOCKREPORT}
        component={StockReport}
        options={{title: 'Stock Report'}}
      />
    </AdminDrawerStack.Navigator>
  );
};

export default AdminStack;

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
