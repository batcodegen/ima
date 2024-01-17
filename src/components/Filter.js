import {useTheme} from '@react-navigation/native';
import React, {useState} from 'react';
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
} from 'react-native';
const filterdata = [
  {id: 'today', name: 'Today'},
  {id: 'thisweek', name: 'This Week'},
  {id: 'thismonth', name: 'This Month'},
  {id: 'thisyear', name: 'This Year'},
  {id: 'previousweek', name: 'Previous Week'},
  {id: 'previousmonth', name: 'Previous Month'},
  {id: 'previousyear', name: 'Previous Year'},
  {id: 'customdate', name: 'Custom Date'},
];
const Filter = ({isVisible, toggleModalState, onItemSelect}) => {
  const {colors} = useTheme();
  return (
    <Modal visible={isVisible} transparent onRequestClose={toggleModalState}>
      <Pressable onPress={toggleModalState} style={styles.overlay}>
        <View>
          {filterdata.map(item => (
            <Pressable
              key={item.id}
              onPress={() => onItemSelect(item)}
              style={[styles.container, {backgroundColor: colors.background}]}>
              <Text style={styles.textview}>{item.name}</Text>
            </Pressable>
          ))}
        </View>
      </Pressable>
    </Modal>
  );
};

export default Filter;

const styles = StyleSheet.create({
  textview: {fontWeight: 'bold', color: 'rgba(0, 0, 0, 0.5)'},
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
  },
  container: {
    width: '60%',
    borderRadius: 10,
    padding: 10,
    marginBottom: 5,
    alignSelf: 'center',
    alignItems: 'center',
  },
});
