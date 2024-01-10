import {StyleSheet, Text, TextInput, View} from 'react-native';
import React from 'react';

const CustomHTextView = ({setValue, fieldValue, title, multiline = false}) => (
  <View style={styles.subcontainer}>
    <Text style={styles.titleText}>{title}</Text>
    <TextInput
      textBreakStrategy="simple"
      style={[styles.textinput, {height: multiline ? 40 : 30}]}
      onChangeText={setValue}
      value={fieldValue}
      multiline={multiline}
    />
  </View>
);

export default CustomHTextView;

const styles = StyleSheet.create({
  subcontainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  titleText: {flex: 0.5, color: 'black'},
  textinput: {
    flex: 1,
    marginStart: 10,
    borderRadius: 5,
    backgroundColor: 'ghostwhite',
    color: 'black',
    padding: 0,
    paddingStart: 2,
  },
});
