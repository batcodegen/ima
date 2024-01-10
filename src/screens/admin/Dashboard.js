import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {ROUTES} from '../../navigator/routes';

const Dashboard = ({navigation}) => {
  const navigateTo = screenName => {
    navigation.navigate(screenName);
  };
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.card1}
        activeOpacity={0.6}
        onPress={() => navigateTo(ROUTES.STOCKREPORT)}>
        <Text style={styles.text}>{'Stock Report'}</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.card2}
        activeOpacity={0.6}
        onPress={() => navigateTo(ROUTES.FINANCEREPORT)}>
        <Text style={styles.text}>{'Finance Report'}</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Dashboard;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {fontWeight: 'bold', fontSize: 20, color: 'black'},
  card1: {
    width: '80%',
    height: 100,
    backgroundColor: 'lightblue',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  card2: {
    marginTop: 20,
    width: '80%',
    height: 100,
    backgroundColor: 'lightcyan',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
});
