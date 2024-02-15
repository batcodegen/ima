import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import string from '../../helpers/strings.json';
import DropDownFile from '../../components/DropDown';
import {useSelector} from 'react-redux';
import BottomAlert from '../../components/BottomAlert';

const types = [
  {name: 'Filled', id: 'F'},
  {name: 'Empty', id: 'E'},
];

const HandOverRequest = ({callApi, prodListData, showQuantityError}) => {
  const alertRef = useRef(null);
  const [quantity, setQuantity] = useState('0');
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [SelectedType, setSelectedType] = useState(types[0]);
  const {productinfo, locations} = useSelector(state => state.deliverydata);
  const {extras} = useSelector(state => state.auth);

  useEffect(() => {
    if (locations) {
      setSelectedLocation(locations[0]);
    }
    if (productinfo) {
      setSelectedCategory(productinfo[0]);
    }
  }, [locations, productinfo]);

  const checkForMaxQuantity = quantityText => {
    const matchingProduct = prodListData.find(
      product => product.id === selectedCategory.id,
    );
    // console.log('matchingProduct', JSON.stringify(matchingProduct));
    let filteredQuantity = null;
    if (matchingProduct) {
      if (SelectedType.id === 'F') {
        filteredQuantity = matchingProduct.filled_stock;
      } else {
        filteredQuantity = matchingProduct.empty_stock;
      }
    }
    if (
      (filteredQuantity && filteredQuantity < quantityText) ||
      filteredQuantity === 0
    ) {
      if (showQuantityError) {
        setTimeout(() => {
          showQuantityError(
            `Quantity cannot be greater than ${filteredQuantity} for ${selectedCategory?.product}`,
          );
        }, 600);
      }
      return String(filteredQuantity);
    }
    return quantityText;
  };

  const addRequestToList = async () => {
    if (!quantity) {
      alertRef.current.showAlert('Please add quantity.', 'Error');
    } else {
      //call api
      const apidata = {
        status: 'pending',
        cylinder_status: SelectedType?.id,
        product: selectedCategory?.id,
        quantity: quantity,
        destination: selectedLocation?.id,
        source: extras?.source_id,
      };
      callApi(apidata);
    }
  };

  return (
    <View style={styles.contentContainer}>
      <Text style={styles.title}>Create new request</Text>
      <View style={styles.dataContainer}>
        <View style={styles.titleContainer}>
          <Text style={{color: 'black'}}>{'Location/Vehicle'}</Text>
        </View>
        <View style={styles.valueContainer}>
          <DropDownFile
            data={locations}
            labelField={'name'}
            valueField={'name'}
            onSelect={item => setSelectedLocation(item)}
          />
        </View>
      </View>
      <View style={styles.dataContainer}>
        <View style={styles.titleContainer}>
          <Text style={{color: 'black'}}>{'Product'}</Text>
        </View>
        <View style={styles.valueContainer}>
          <DropDownFile
            data={productinfo}
            labelField={'product'}
            valueField={'product'}
            showSearch={false}
            onSelect={item => {
              setSelectedCategory(item);
              setSelectedType(prevType => ({...prevType, ...types[0]}));
              setQuantity(prevValue => prevValue - prevValue);
            }}
          />
        </View>
      </View>
      <View style={styles.dataContainer}>
        <View style={styles.titleContainer}>
          <Text style={{color: 'black'}}>{string.type}</Text>
        </View>
        <View style={styles.valueContainer}>
          <DropDownFile
            data={types}
            labelField={'name'}
            valueField={'name'}
            showSearch={false}
            createdCustomer={SelectedType}
            onSelect={item => {
              setSelectedType(item);
              setQuantity(prevValue => prevValue - prevValue);
            }}
          />
        </View>
      </View>
      <View style={styles.dataContainer}>
        <Text style={styles.titleContainer}>Quantity</Text>
        <View style={styles.valueContainer}>
          <TextInput
            textBreakStrategy="simple"
            style={styles.textinput}
            onChangeText={text => {
              const sanitizedText = text.replace(/[^0-9]/g, '');
              const newQuantity = checkForMaxQuantity(sanitizedText);
              setQuantity(newQuantity);
            }}
            value={String(quantity)}
            keyboardType="numeric"
          />
        </View>
      </View>
      <View style={styles.button}>
        <TouchableOpacity onPress={addRequestToList} style={styles.loginBtn}>
          <Text style={styles.loginText}>Create Request </Text>
        </TouchableOpacity>
      </View>
      <BottomAlert ref={alertRef} />
    </View>
  );
};

export default HandOverRequest;

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    padding: 20,
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: 'black',
  },
  titleText: {flex: 0.5, color: 'black', textAlign: 'center'},
  textinput: {
    // flex: 1,
    borderRadius: 10,
    backgroundColor: 'ghostwhite',
    color: 'black',
    padding: 0,
    paddingStart: 2,
    height: 30,
  },
  loginBtn: {
    width: '80%',
    backgroundColor: '#6495ED',
    borderRadius: 25,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 40,
    marginBottom: 10,
    alignSelf: 'center',
  },
  loginText: {
    color: 'white',
  },
  button: {justifyContent: 'flex-end'},
  dataContainer: {
    flexDirection: 'row',
    marginVertical: 10,
    alignItems: 'center',
  },
  titleContainer: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'row',
    color: 'black',
  },
  valueContainer: {flex: 1},
});
