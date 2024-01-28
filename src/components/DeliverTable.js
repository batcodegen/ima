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

/**
 *
 * @param {data} = selected customer's product info
 * @param {itemsLength} = for showing space in column view
 * @param {onRemove} = when '-' is clicked
 * @param {updateData} = callback funtion to send value
 * @returns object containing quantity, weight, rate, discount
 */
const DeliverTable = ({
  onRemove,
  index,
  updateData,
  itemsLength,
  data,
  userProducts,
  showQuantityError,
}) => {
  const [quantity, setQuantity] = useState('0');
  const [selectedWeight, setSelectedWeight] = useState('');
  const [rate, setRate] = useState(0);
  const [discount, setDiscount] = useState(0);

  useEffect(() => {
    if (data) {
      setQuantity('0');
      setSelectedWeight(data?.[0]);
      setRate(data?.[0]?.price);
      setDiscount(data?.[0]?.discount ?? 0);
    }
  }, [data]);

  const calculateRateAndDiscount = (weight, quantityText) => {
    const selectedObject = data.find(item => item.product === weight.product);
    const rates = quantityText
      ? (selectedObject?.price ?? 0) * parseFloat(quantityText)
      : 0;
    const discountPrice = quantityText
      ? parseFloat(quantityText) * parseFloat(weight?.discount ?? 0)
      : 0;
    setRate(selectedObject?.price ?? 0);
    setDiscount(weight?.discount ?? 0);
    updateData(index, {
      quantity: Number(quantityText),
      weight: weight,
      rate: rates,
      calculatedDisc: discountPrice,
    });
  };

  const checkForMaxQuantity = quantityText => {
    const matchingProduct = userProducts.find(
      product => product.product === selectedWeight.id,
    );
    console.log(userProducts, selectedWeight);
    const filteredQuantity = matchingProduct ? matchingProduct.quantity : null;
    if (filteredQuantity && filteredQuantity < quantityText) {
      if (showQuantityError) {
        setTimeout(() => {
          showQuantityError(
            `Quantity cannot be greater than ${filteredQuantity} for ${selectedWeight?.product}`,
          );
        }, 600);
      }
      return String(filteredQuantity);
    }
    return quantityText;
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
              const newQuantity = checkForMaxQuantity(sanitizedText);
              calculateRateAndDiscount(selectedWeight, newQuantity);
              setQuantity(newQuantity);
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
