import {ActivityIndicator, StyleSheet, Text, View} from 'react-native';
import React from 'react';

const Loader = ({isLoading}) => {
  if (isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size={'large'} color={'lightblue'} />
      </View>
    );
  }
  return null;
};

export default Loader;

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
  },
});
