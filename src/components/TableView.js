import {StyleSheet, Text, TextInput, View} from 'react-native';
import React, {useState} from 'react';

const TableView = ({title, value, ontextupdate}) => {
  return (
    <View style={styles.dataContainer}>
      <View style={styles.titleContainer}>
        <Text style={{color: 'black'}}>{title}</Text>
      </View>
      <View style={styles.valueContainer}>
        {ontextupdate ? (
          <TextInput
            style={styles.input}
            value={value}
            keyboardType="decimal-pad"
            onChangeText={ontextupdate}
          />
        ) : (
          <Text style={{color: 'black'}}> {value}</Text>
        )}
      </View>
    </View>
  );
};

export default TableView;

const styles = StyleSheet.create({
  dataContainer: {flexDirection: 'row', marginVertical: 5},
  titleContainer: {flex: 1, justifyContent: 'center'},
  valueContainer: {flex: 1, alignItems: 'flex-end', marginEnd: 5},
  input: {
    borderWidth: 1,
    padding: 5,
    borderColor: 'black',
    backgroundColor: 'white',
    textAlign: 'right',
    width: 90,
  },
});
