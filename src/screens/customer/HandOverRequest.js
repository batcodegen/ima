import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useState} from 'react';
import string from '../../helpers/strings.json';
// import {useGetApi} from '../services/useApi';
import customerData from '../../assets/dummydata/customer.json';
import categories from '../../assets/dummydata/containerweight.json';
import DropDownFile from '../../components/DropDown';

const HandOverRequest = () => {
  const [quantity, setQuantity] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [SelectedType, setSelectedType] = useState('');

  const addRequestToList = () => {};
  // const {data: customerData, error, isLoading} = useGetApi('/customers');
  // const {data: categories, error1, isLoading1} = useGetApi('/weights');
  const types = [{name: 'Empty'}, {name: 'Filled'}];

  return (
    <View style={styles.contentContainer}>
      <Text style={styles.title}>Create new request</Text>
      <View style={styles.dataContainer}>
        <View style={styles.titleContainer}>
          <Text style={{color: 'black'}}>{string.customerName}</Text>
        </View>
        <View style={styles.valueContainer}>
          <DropDownFile
            data={customerData}
            labelField={'name'}
            valueField={'name'}
            onSelect={item => console.log(item)}
          />
        </View>
      </View>
      <View style={styles.dataContainer}>
        <View style={styles.titleContainer}>
          <Text style={{color: 'black'}}>{string.category}</Text>
        </View>
        <View style={styles.valueContainer}>
          <DropDownFile
            data={categories}
            labelField={'value'}
            valueField={'value'}
            showSearch={false}
            onSelect={item => {
              setSelectedCategory(item);
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
            onSelect={item => {
              setSelectedType(item);
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
            onChangeText={setQuantity}
            value={quantity}
            keyboardType="numeric"
          />
        </View>
      </View>
      <View style={styles.button}>
        <TouchableOpacity onPress={addRequestToList} style={styles.loginBtn}>
          <Text style={styles.loginText}>Create Request </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default HandOverRequest;

const styles = StyleSheet.create({
  contentContainer: {flex: 1, padding: 20},
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
  button: {flex: 1, justifyContent: 'flex-end'},
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
