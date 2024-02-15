import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import DropDownFile from './DropDown';
import AntDesign from 'react-native-vector-icons/AntDesign';

const CollectTable = ({onRemove, index, updateData, itemsLength, data}) => {
  const [quantity, setQuantity] = useState('0');
  const [selectedWeight, setSelectedWeight] = useState('');

  useEffect(() => {
    if (data) {
      setQuantity('0');
      setSelectedWeight(data?.[0]);
    }
  }, [data]);

  const calculateRate = (weight, quantityText) => {
    updateData(index, {quantity: Number(quantityText), weight: weight});
  };

  return (
    <View style={styles.container}>
      <View style={styles.mainContainer}>
        <View style={styles.dropContainer}>
          <DropDownFile
            data={data}
            labelField={'product'}
            valueField={'product'}
            showSearch={false}
            onSelect={item => {
              setSelectedWeight(item);
              setQuantity(prevValue => '0');
              calculateRate(item, 0);
            }}
          />
        </View>
        <View style={styles.inputContainer}>
          <TextInput
            value={quantity}
            style={styles.input}
            maxLength={2}
            keyboardType={'numeric'}
            onChangeText={text => {
              const sanitizedText = text.replace(/[^0-9]/g, '');
              setQuantity(sanitizedText);
              calculateRate(selectedWeight, sanitizedText);
            }}
          />
        </View>
        {index > 0 ? (
          <TouchableOpacity style={{flex: 0.2}} onPress={() => onRemove(index)}>
            <AntDesign name={'minuscircle'} size={18} color={'red'} />
          </TouchableOpacity>
        ) : (
          <View style={{flex: itemsLength > 1 ? 0.2 : 0}} />
        )}
        <View style={styles.rateContainer}>
          <Text>{''}</Text>
        </View>
        <View style={styles.rateContainer}>
          <Text>{''}</Text>
        </View>
      </View>
    </View>
  );
};

export default CollectTable;

const styles = StyleSheet.create({
  container: {flex: 1},
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  weightContainer: {flex: 1, alignItems: 'center'},
  quantityContainer: {flex: 1, alignItems: 'center'},
  rateTextContainer: {flex: 0.8, alignItems: 'center'},
  mainContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dropContainer: {flex: 1},
  inputContainer: {
    flex: 1,
    alignItems: 'center',
  },
  input: {
    borderWidth: 1,
    padding: 5,
    borderColor: 'gainsboro',
    backgroundColor: 'white',
    textAlign: 'center',
    width: 40,
    height: 30,
    color: 'black',
    borderRadius: 5,
  },
  rateContainer: {flex: 0.8, alignItems: 'center'},
});
