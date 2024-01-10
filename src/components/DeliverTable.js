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

const DeliverTable = ({onRemove, index, updateData, itemsLength, data}) => {
  const [quantity, setQuantity] = useState('1');
  const [selectedWeight, setSelectedWeight] = useState('');
  const [rate, setRate] = useState(0);

  useEffect(() => {
    if (data) {
      setSelectedWeight(data?.[0]?.name);
      setRate(data?.[0]?.price);
    }
  }, [data]);

  const calculateRate = (weight, quantityText) => {
    const selectedObject = data.find(item => item.name === weight.name);
    const rates = quantityText
      ? selectedObject.price * parseFloat(quantityText)
      : 0;
    setRate(rates);
    updateData(index, {quantity: quantityText, weight: weight, rate: rates});
  };

  if (!data) {
    return null;
  }

  return (
    <View style={styles.container}>
      <View style={styles.mainContainer}>
        <View style={styles.dropContainer}>
          <DropDownFile
            data={data}
            labelField={'name'}
            valueField={'name'}
            showSearch={false}
            onSelect={item => {
              setSelectedWeight(item);
              calculateRate(item, quantity);
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
        <View style={styles.rateContainer}>
          <Text
            ellipsizeMode="tail"
            style={{color: 'black'}}>{`₹${rate}`}</Text>
        </View>
        {index > 0 ? (
          <TouchableOpacity style={{flex: 0.2}} onPress={() => onRemove(index)}>
            <AntDesign name={'minuscircle'} size={18} color={'red'} />
          </TouchableOpacity>
        ) : (
          <View style={{flex: itemsLength > 1 ? 0.2 : 0}} />
        )}
      </View>
    </View>
  );
};

export default DeliverTable;

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
    borderColor: 'black',
    backgroundColor: 'white',
    textAlign: 'center',
    width: 50,
    color: 'black',
  },
  rateContainer: {flex: 0.8, alignItems: 'center'},
});
