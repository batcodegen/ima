import {
  Alert,
  KeyboardAvoidingView,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import CustomHTextView from './CustomHTextView';
import BottomAlert from './BottomAlert';
import DocumentPicker, {types} from 'react-native-document-picker';
import RNFS from 'react-native-fs';
import {StackActions, useTheme} from '@react-navigation/native';
import Ionicon from 'react-native-vector-icons/Ionicons';
import {useSelector} from 'react-redux';
import DropDownFile from './DropDown';
import uuid from 'react-native-uuid';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {useGetDeliveryData} from '../hooks/useDelivery';
import {ROUTES} from '../navigator/routes';

const ProductTable = ({onRemove, index, updateData, itemsLength, data}) => {
  const [quantity, setQuantity] = useState('1');
  const [selectedWeight, setSelectedWeight] = useState('');
  const [discount, setDiscount] = useState('0');

  useEffect(() => {
    if (data) {
      setSelectedWeight(data?.[0]);
    }
  }, [data]);

  const calculateRateAndDiscount = (weight, quantityText, discountText) => {
    const selectedObject = data.find(item => item.product === weight.product);
    updateData(index, {
      quantity: Number(quantityText),
      product: selectedObject.id,
      discount: discountText,
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
              calculateRateAndDiscount(item, quantity, discount);
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
              calculateRateAndDiscount(selectedWeight, sanitizedText, discount);
            }}
          />
        </View>
        <View style={styles.inputContainer}>
          <TextInput
            value={discount}
            style={[styles.input, {width: 60}]}
            keyboardType={'numeric'}
            onChangeText={text => {
              const sanitizedText = text.replace(/[^0-9.]/g, ''); // Allow only numbers and decimal points

              // Ensure maximum 2 decimal places and restrict invalid input
              if (!sanitizedText || /^\d+(?:\.\d{0,2})?$/.test(sanitizedText)) {
                setDiscount(sanitizedText);
                calculateRateAndDiscount(
                  selectedWeight,
                  quantity,
                  sanitizedText,
                );
              } else {
                // Prevent invalid input by keeping the previous value
                setDiscount(prevDiscount => prevDiscount);
              }
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
      </View>
    </View>
  );
};

const NewCustomer = ({navigation}) => {
  const {colors} = useTheme();
  const alertRef = useRef();
  const [name, setBusinessName] = useState('');
  const [billingAddress, setBillingAddress] = useState('');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [gstNumber, setGstNumber] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [securityDeposit, setSecurityDeposit] = useState(0);
  const [pendingPayment, setPendingPayment] = useState(0);
  const [phonenum, setPhoneNum] = useState('');
  const [selectPdfFile, setSelectPfdFile] = useState(null);
  const [fileName, setFileName] = useState(null);
  const [items, setItems] = useState(null);

  const {productinfo} = useSelector(state => state.deliverydata);
  const {callCreateCustomerApi} = useGetDeliveryData();

  useEffect(() => {
    if (productinfo) {
      const initData = [
        {
          id: 1,
          quantity: 1,
          product: productinfo?.[0]?.id,
          discount: 0,
        },
      ];
      setItems(initData);
    }
  }, [productinfo]);

  // delivered product add/remove items
  const handleAdd = () => {
    const newItem = [
      ...items,
      {
        id: uuid.v4(),
        product: 1,
        quantity: 1,
        discount: '0',
      },
    ];
    setItems(newItem);
  };
  const handleUpdate = (index, newData) => {
    const updatedItems = [...items];
    updatedItems[index] = {...updatedItems[index], ...newData};
    setItems(updatedItems);
  };
  const handleRemove = index => {
    const updatedItems = items.filter((_, i) => i !== index);
    setItems(updatedItems);
  };

  const showAlert = (title, msg, shouldCloseModal, customerInfo) => {
    Alert.alert(
      title,
      msg,
      [
        {
          text: 'OK',
          onPress: () => {
            if (shouldCloseModal) {
              navigation.dispatch(
                StackActions.replace(ROUTES.CUSTOMERSTACK, {
                  screen: ROUTES.CYLINDERDELIVERY,
                  params: {
                    shouldRefetch: true,
                    createdCustomerInfo: customerInfo,
                  },
                }),
              );
            }
          },
        },
      ],
      {cancelable: false},
    );
  };

  // handles new customer creation
  const updateNewCustomerData = async custData => {
    const {success, error, customerInfo} = await callCreateCustomerApi(
      custData,
    );
    if (success) {
      showAlert('Success', 'Customer created successfully', true, customerInfo);
    } else {
      showAlert('Error', error, false);
    }
  };

  const addUserToList = () => {
    if (
      !name ||
      !billingAddress ||
      !code ||
      !gstNumber ||
      !deliveryAddress ||
      !contactPerson ||
      !phonenum ||
      !selectPdfFile
    ) {
      alertRef.current.showAlert('All fields are required.', 'Error');
    } else {
      const custCreateData = {
        business_name: name,
        billing_address: billingAddress,
        email,
        code,
        gst_number: gstNumber,
        delivery_address: deliveryAddress,
        contact_person: contactPerson,
        phone_number: phonenum,
        product_usages: items,
        gst_certificate: selectPdfFile,
        security_deposit: Number(securityDeposit),
        pending_payment: Number(pendingPayment),
      };
      // console.log('sent data--', custCreateData);
      updateNewCustomerData(custCreateData);
    }
  };

  const openPicker = () => {
    DocumentPicker.pickSingle({type: types.pdf})
      .then(res => {
        setFileName(res.name);
        RNFS.readFile(res.uri, 'base64')
          .then(base64str => {
            setSelectPfdFile(base64str);
          })
          .catch(rnfsErr => {
            alertRef.current.showAlert(
              'Failed to pick file. Please try again.',
              'Error',
            );
          });
      })
      .catch(err => {
        alertRef.current.showAlert(
          'Failed to pick file. Please try again.',
          'Error',
        );
        console.log('picker error: ', err);
      });
  };

  const HeaderTitleView = useCallback(
    ({style, title}) => (
      <View style={style}>
        <Text style={{color: colors.text}}> {title}</Text>
      </View>
    ),
    [],
  );

  return (
    <KeyboardAvoidingView
      behavior={'height'}
      keyboardVerticalOffset={50}
      style={styles.contentContainer}>
      <View style={styles.titleContent}>
        <Pressable
          onPress={() => {
            navigation.dispatch(
              StackActions.replace(ROUTES.CUSTOMERSTACK, {
                screen: ROUTES.CYLINDERDELIVERY,
              }),
            );
          }}>
          <Ionicon name={'arrow-back'} size={20} color={colors.text} />
        </Pressable>
        <Text style={styles.title}>Add New Customer</Text>
        <View />
      </View>
      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        <CustomHTextView
          setValue={setBusinessName}
          fieldValue={name}
          title={'Business name'}
        />
        <CustomHTextView setValue={setCode} fieldValue={code} title={'Code'} />
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
        <View style={styles.subcontainer}>
          <Text style={styles.titleText}>{'Security deposit'}</Text>
          <TextInput
            textBreakStrategy="simple"
            keyboardType="numeric"
            style={[styles.textinput, {height: 30}]}
            onChangeText={setSecurityDeposit}
            value={String(securityDeposit)}
          />
        </View>
        <View style={styles.subcontainer}>
          <Text style={styles.titleText}>{'Pending payment'}</Text>
          <TextInput
            textBreakStrategy="simple"
            keyboardType="numeric"
            style={[styles.textinput, {height: 30}]}
            onChangeText={setPendingPayment}
            value={String(pendingPayment)}
          />
        </View>
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
        <View style={styles.subcontainer}>
          <Text style={styles.titleText}>{'Upload GST'}</Text>
          <TouchableOpacity style={styles.picker} onPress={openPicker}>
            <Text style={{color: 'gray'}}>{fileName ?? 'Click to upload'}</Text>
          </TouchableOpacity>
        </View>

        {/* PRODUCT USAGE */}
        <View style={styles.deliveredContainer}>
          <View style={styles.deliveredTopContainer}>
            <Text style={[styles.title1, {color: colors.text}]}>
              {'Product usages'}
            </Text>
            <Pressable style={styles.plusContainer} onPress={handleAdd}>
              <Ionicon
                name={'add-circle-outline'}
                size={20}
                color={'dodgerblue'}
              />
            </Pressable>
          </View>
          <View style={styles.titleContainer1}>
            <HeaderTitleView style={styles.weightContainer} title={'Product'} />
            <HeaderTitleView
              style={styles.quantityContainer}
              title={'Quantity'}
            />
            <HeaderTitleView
              style={styles.quantityContainer}
              title={'Discount'}
            />
            {items?.length > 1 ? (
              <View style={styles.emptyView}>
                <Text>{''}</Text>
              </View>
            ) : null}
          </View>
          {items?.map((_, index) => (
            <View style={styles.tableContainer} key={_.id}>
              <ProductTable
                data={productinfo}
                index={index}
                itemsLength={items.length}
                updateData={handleUpdate}
                onRemove={handleRemove}
              />
            </View>
          ))}
        </View>

        <View style={styles.button}>
          <TouchableOpacity onPress={addUserToList} style={styles.loginBtn}>
            <Text style={styles.loginText}>Create Customer</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      <BottomAlert ref={alertRef} />
    </KeyboardAvoidingView>
  );
};

export default NewCustomer;

const styles = StyleSheet.create({
  titleContent: {
    flexDirection: 'row',
    marginBottom: 20,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  contentContainer: {flex: 1, paddingHorizontal: 20, paddingTop: 20},
  scroll: {paddingBottom: 20},
  title: {
    fontSize: 20,
    fontWeight: 'bold',
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
  subcontainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  picker: {
    backgroundColor: 'ghostwhite',
    flex: 1,
    marginStart: 10,
    borderRadius: 5,
    padding: 5,
  },
  deliveredContainer: {marginVertical: 20},
  deliveredTopContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  titleContainer1: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  weightContainer: {flex: 1, alignItems: 'center'},
  quantityContainer: {flex: 1, alignItems: 'center'},
  title1: {fontWeight: 'bold'},
  plusContainer: {paddingHorizontal: 10},
  emptyView: {flex: 0.2},
  tableContainer: {flexDirection: 'row', marginBottom: 15},
  container: {flex: 1},
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
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
});
