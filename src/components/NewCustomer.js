import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useRef, useState} from 'react';
import {BottomSheetScrollView} from '@gorhom/bottom-sheet';
import CustomHTextView from './CustomHTextView';
import BottomAlert from './BottomAlert';

const NewCustomer = ({sendData}) => {
  const alertRef = useRef();
  const [name, setBusinessName] = useState('');
  const [billingAddress, setBillingAddress] = useState('');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [gstNumber, setGstNumber] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [phonenum, setPhoneNum] = useState('');

  const addUserToList = () => {
    if (
      name === '' ||
      billingAddress === '' ||
      email === '' ||
      code === '' ||
      gstNumber === '' ||
      deliveryAddress === '' ||
      contactPerson === '' ||
      phonenum === ''
    ) {
      alertRef.current.showAlert('All fields are required.', 'Error');
    } else {
      sendData({
        business_name: name,
        billing_address: billingAddress,
        email,
        code,
        gst_number: gstNumber,
        delivery_address: deliveryAddress,
        contact_person: contactPerson,
        phone_number: phonenum,
      });
    }
  };

  return (
    <View style={styles.contentContainer}>
      <Text style={styles.title}>Add New Customer</Text>
      <BottomSheetScrollView
        style={styles.scroll}
        showsVerticalScrollIndicator={false}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={50}>
          <CustomHTextView
            setValue={setBusinessName}
            fieldValue={name}
            title={'Business name'}
          />
          <CustomHTextView
            setValue={setCode}
            fieldValue={code}
            title={'Code'}
          />
          <CustomHTextView
            setValue={setGstNumber}
            fieldValue={gstNumber}
            title={'GST number'}
          />
          <CustomHTextView
            setValue={setDeliveryAddress}
            fieldValue={deliveryAddress}
            title={'Delivery address'}
            multiline={true}
          />
          <CustomHTextView
            setValue={setContactPerson}
            fieldValue={contactPerson}
            title={'Contact person'}
          />
          <CustomHTextView
            setValue={setEmail}
            fieldValue={email}
            title={'Email'}
          />
          <CustomHTextView
            setValue={setPhoneNum}
            fieldValue={phonenum}
            title={'Phone number'}
          />
          <CustomHTextView
            setValue={setBillingAddress}
            fieldValue={billingAddress}
            title={'Billing address'}
            multiline={true}
          />

          <View style={styles.button}>
            <TouchableOpacity onPress={addUserToList} style={styles.loginBtn}>
              <Text style={styles.loginText}>Create Customer</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </BottomSheetScrollView>
      <BottomAlert ref={alertRef} />
    </View>
  );
};

export default NewCustomer;

const styles = StyleSheet.create({
  contentContainer: {flex: 1, padding: 20, marginBottom: 90},
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: 'black',
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
});
