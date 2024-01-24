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
  const [discount, setDiscount] = useState(0);

  useEffect(() => {
    if (data) {
      setQuantity('1');
      setSelectedWeight(data?.[0]);
      setRate(data?.[0]?.price);
      setDiscount(data?.[0]?.discount ?? 0);
    }
  }, [data]);

  const calculateRateAndDiscount = (weight, quantityText) => {
    const selectedObject = data.find(item => item.product === weight.product);
    const rates = quantityText
      ? selectedObject.price * parseFloat(quantityText)
      : 0;
    const discountPrice = quantityText
      ? parseFloat(quantityText) * parseFloat(weight?.discount ?? 0)
      : 0;
    setRate(selectedObject.price);
    setDiscount(weight?.discount ?? 0);
    updateData(index, {
      quantity: quantityText,
      weight: weight,
      rate: rates,
      calculatedDisc: discountPrice,
    });
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
            labelField={'product'}
            valueField={'product'}
            showSearch={false}
            onSelect={item => {
              setSelectedWeight(item);
              calculateRateAndDiscount(item, quantity);
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
              calculateRateAndDiscount(selectedWeight, sanitizedText);
            }}
          />
        </View>
        <View style={styles.rateContainer}>
          <Text
            ellipsizeMode="tail"
            style={{color: 'black'}}>{`₹${rate}`}</Text>
        </View>
        <View style={styles.rateContainer}>
          <Text
            ellipsizeMode="tail"
            style={{color: 'black'}}>{`₹${discount}`}</Text>
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
