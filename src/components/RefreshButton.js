import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import Ionicon from 'react-native-vector-icons/Ionicons';

const RefreshButton = ({onPress}) => {
  return (
    <TouchableOpacity
      activeOpacity={0.5}
      style={styles.container}
      onPress={onPress}>
      <Ionicon name={'refresh'} size={25} color={'black'} />
    </TouchableOpacity>
  );
};

export default RefreshButton;

const styles = StyleSheet.create({
  container: {marginHorizontal: 10},
});
