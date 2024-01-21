import {useTheme} from '@react-navigation/native';
import React from 'react';
import {Modal, Pressable, StyleSheet, Text, View} from 'react-native';

const filterdata = [
  {id: 'today', name: 'Today'},
  {id: 'yesterday', name: 'Yesterday'},
  {id: 'week', name: 'This Week'},
  {id: 'month', name: 'This Month'},
  {id: 'year', name: 'This Year'},
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
