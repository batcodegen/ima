import {StyleSheet, Text, TextInput, View} from 'react-native';
import React, {useState} from 'react';

const TableView = ({
  title,
  value,
  ontextupdate,
  viewableText,
  editable = true,
}) => {
  return (
    <View style={styles.dataContainer}>
      <View style={styles.titleContainer}>
        <Text style={{color: 'black'}}>{title}</Text>
      </View>
      <View style={styles.valueContainer}>
        {ontextupdate ? (
          <View style={styles.textcontainer}>
            <Text style={{color: 'black', marginEnd: 5}}>₹</Text>
            <TextInput
              editable={editable}
              style={styles.input}
              placeholder="0"
              value={value}
              keyboardType="decimal-pad"
              onChangeText={txt => {
                const sanitizedText = txt.replace(/[^0-9]/g, '');
                ontextupdate(sanitizedText);
              }}
            />
          </View>
        ) : (
          <Text style={{color: viewableText ? 'dodgerblue' : 'black'}}>
            {' '}
            {value}
          </Text>
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
  textcontainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 5,
    padding: 5,
    borderColor: 'gainsboro',
    backgroundColor: 'white',
    width: 80,
    height: 30,
  },
  input: {
    textAlign: 'right',
    color: 'black',
    flex: 1,
    padding: 0,
  },
});
