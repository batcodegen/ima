import {
  Alert,
  KeyboardAvoidingView,
  Linking,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {useGetDeliveryData} from '../../hooks/useDelivery';
import RefreshButton from '../../components/RefreshButton';
import string from '../../helpers/strings.json';
import Ionicon from 'react-native-vector-icons/Ionicons';
import DropDownFile from '../../components/DropDown';
import {StackActions, useTheme} from '@react-navigation/native';
import TableView from '../../components/TableView';
import {formatToLocalRupee} from '../../helpers/utils';
import DeliverTable from '../../components/DeliverTable';
import {launchCamera} from 'react-native-image-picker';
import BottomAlert from '../../components/BottomAlert';
import {useSelector} from 'react-redux';
import uuid from 'react-native-uuid';
import paymentmode from '../../assets/dummydata/paymentmode.json';
import BottomSheetComponent from '../../components/BottomSheetComponent';
import CollectTable from '../../components/CollectTable';
import ViewCustomerData from '../../components/ViewCustomerData';
import {ROUTES} from '../../navigator/routes';

const CylinderDelivery2 = ({navigation, route}) => {
  const {colors} = useTheme();

  // bottom sheet vars
  const alertRef = useRef(null);
  const parentBottomSheetRef = useRef(null);

  // local states
  const [productList, setProductList] = useState([]);
  const [numberOfCylinder, setNoOfCylinder] = useState(0);
  const [imageData, setImageData] = useState(null);
  const [selectedUserData, setSelectedUserData] = useState(null);
  const [items, setItems] = useState(null);
  const [collectItems, setCollectItems] = useState(null);
  const [totalBillValue, setTotalBillValue] = useState(0);
  const [totalDiscountValue, setTotalDiscountValue] = useState(0);
  const [finalBillAmount, setFinalBillAmount] = useState(0);
  const [securitydeposit, setSecurityDeposit] = useState(0);
  const [paymentcollected, setPaymentCollected] = useState(0);
  const [paymenttobecollected, setPaymentToBeCollected] = useState(0);
  const [balanceAmount, setBalanceAmount] = useState(0);
  const [remarks, setRemarks] = useState('');
  const [modeofpayment, setModeOfPayment] = useState(paymentmode[0].value);

  // redux state
  const {customerinfo, productinfo} = useSelector(state => state.deliverydata);
  const {extras} = useSelector(state => state.auth);

  // apis
  const {refetchDeliveryData, callCustomerSaleApi} = useGetDeliveryData();

  // should refetch on nav back from create customer success
  useEffect(() => {
    if (route?.params?.shouldRefetch) {
      refetchDeliveryData();
    }
  }, [route.params]);

  // top header refresh
  useEffect(() => {
    navigation.setOptions({
      // eslint-disable-next-line react/no-unstable-nested-components
      headerRight: props => (
        <RefreshButton
          onPress={() => {
            refetchDeliveryData();
          }}
        />
      ),
    });
  }, [navigation]);

  // save first value as default from customerinfo
  useEffect(() => {
    if (customerinfo?.length > 0) {
      setSelectedUserData(customerinfo[0]);
    }
  }, [customerinfo]);

  // when customerinfo is saved, create:
  // productlist, default values, bills, etc.
  useEffect(() => {
    if (selectedUserData) {
      let productData = [];
      if (selectedUserData?.product_usages?.length > 0) {
        productData = selectedUserData.product_usages?.map(usage => {
          const product = productinfo.find(prod => prod.id === usage.product);
          return {...usage, ...product};
        });
      } else {
        productData = [...productinfo];
      }
      if (productData?.length > 0) {
        const initData = [
          {
            id: 1,
            quantity: '1',
            weight: productData?.[0],
            rate: productData?.[0]?.price ?? 0,
            calculatedDisc: productData?.[0]?.discount ?? 0,
          },
        ];
        cylinderQtyFromProdUsage(productData);
        setProductList(productData);
        setItems(initData);
        setCollectItems([{...initData[0], quantity: '0'}]);
        calculateBillAmountAndDiscount(initData);
      }
    }
  }, [selectedUserData, productinfo]);

  const handleViewModalPress = () => parentBottomSheetRef.current.focus();
  const handlePresentModalPress = () => {
    navigation.dispatch(
      StackActions.replace(ROUTES.CUSTOMERSTACK, {screen: 'NewCustomer'}),
    );
  };

  // delivered product add/remove items
  const handleAdd = () => {
    const newItem = [
      ...items,
      {
        id: uuid.v4(),
        quantity: '1',
        weight: productList[0],
        rate: productList[0].price,
        calculatedDisc: productList[0].discount ?? 0,
      },
    ];
    setItems(newItem);
    calculateBillAmountAndDiscount(newItem);
  };
  const handleUpdate = (index, newData) => {
    const updatedItems = [...items];
    updatedItems[index] = {...updatedItems[index], ...newData};
    setItems(updatedItems);
    calculateBillAmountAndDiscount(updatedItems);
  };
  const handleRemove = index => {
    const updatedItems = items.filter((_, i) => i !== index);
    setItems(updatedItems);
    calculateBillAmountAndDiscount(updatedItems);
  };

  // collected product add/remove
  const handleAddCollect = () => {
    setCollectItems([
      ...collectItems,
      {id: uuid.v4(), quantity: '1', weight: productList[0]},
    ]);
  };
  const handleCollectUpdate = (index, newData) => {
    const updatedItems = [...collectItems];
    updatedItems[index] = {...updatedItems[index], ...newData};
    setCollectItems(updatedItems);
  };
  const handleCollectRemove = index => {
    const updatedItems = collectItems.filter((_, i) => i !== index);
    setCollectItems(updatedItems);
  };

  //   console.log('deliverydata', selectedUserData);

  const calculateBillAmountAndDiscount = data => {
    const totalBill = data
      .filter(item => item.quantity)
      .reduce((accumulator, item) => {
        const quantity = parseInt(item.quantity, 10);
        const price = item.rate || item.weight.price * quantity;
        return accumulator + price;
      }, 0);
    const totalDiscount = data.reduce(
      (acc, item) => acc + parseFloat(item.calculatedDisc),
      0.0,
    );
    const finalBillAmt = totalBill - totalDiscount;
    setTotalBillValue(totalBill);
    setTotalDiscountValue(totalDiscount);
    setFinalBillAmount(finalBillAmt);
    calculatePaymentToBeCollected(finalBillAmt, securitydeposit);
  };

  const calculatePaymentToBeCollected = (finalBillAmt, depositCollected) => {
    const finalPaymentToCollect =
      finalBillAmt +
      parseFloat(depositCollected) +
      (selectedUserData?.pending_payment ?? 0);
    setPaymentToBeCollected(finalPaymentToCollect);
    calculateBalanceAmount(finalPaymentToCollect, paymentcollected);
  };

  const calculateBalanceAmount = (toBeCollectedAmt, collectedAmt) => {
    setBalanceAmount(toBeCollectedAmt - collectedAmt);
  };

  const cylinderQtyFromProdUsage = productData => {
    const totalCylinder = productData?.reduce(
      (acc, item) => acc + (item.quantity ? parseInt(item.quantity, 10) : 0),
      0,
    );
    setNoOfCylinder(totalCylinder);
  };

  // pick image for payment screenshot
  const selectFromCamera = async () => {
    try {
      const result = await launchCamera({
        mediaType: 'photo',
        includeBase64: true,
      });
      setImageData(result?.assets?.[0]);
    } catch (error) {
      alertRef?.current?.showAlert(error, 'Error');
    }
  };

  const showAlert = (title, msg, shouldCloseModal) => {
    Alert.alert(
      title,
      msg,
      [
        {
          text: 'OK',
          onPress: () => {
            if (shouldCloseModal) {
              refetchDeliveryData();
            }
          },
        },
      ],
      {cancelable: false},
    );
  };

  // submit value & call api
  const submitdeliverydata = async () => {
    if (!remarks) {
      alertRef.current.showAlert('Please add remarks.', 'Error');
    } else if (!imageData) {
      alertRef.current.showAlert('Payment screenshot needed.', 'Error');
    } else {
      const collecteddata = collectItems.map(item => ({
        product: item.weight.id,
        quantity: parseInt(item.quantity, 10) || 0,
        cylinder_status: 'E',
      }));
      const deliverdata = items.map(item => ({
        product: item.weight.id,
        quantity: parseInt(item.quantity, 10) || 0,
        unit_price: item.weight.price,
        total_price: item.rate,
        cylinder_status: 'F',
      }));
      const apidata = {
        collected: collecteddata,
        delivered: deliverdata,
        customer: selectedUserData.id,
        source: extras.source_id,
        payments: {
          mode_of_payment: modeofpayment,
          security_deposits: String(securitydeposit),
          payment_collected: String(paymentcollected),
          payment_screenshot: imageData?.base64 ?? '',
        },
      };
      console.log('api0-', apidata);
      const {success, error} = await callCustomerSaleApi(apidata);
      if (success) {
        showAlert('Success', 'Sale created successfully', true);
      } else {
        showAlert('Error', error, false);
      }
    }
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
    <KeyboardAvoidingView behavior={'height'} keyboardVerticalOffset={50}>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
        bounces={false}>
        <View style={styles.dataContainer}>
          <View style={styles.titleContainer}>
            {/* Customer Name */}
            <Text style={{color: colors.text}}>{string.customerName}</Text>
            <Pressable
              style={styles.plusContainer}
              onPress={() => {
                handlePresentModalPress();
              }}>
              <Ionicon
                name={'add-circle-outline'}
                size={20}
                color={'dodgerblue'}
              />
            </Pressable>
            <Pressable
              onPress={() => {
                handleViewModalPress();
              }}>
              <Ionicon name={'eye'} size={20} color={'dodgerblue'} />
            </Pressable>
          </View>
          <View style={styles.valueContainer}>
            <DropDownFile
              data={customerinfo}
              labelField={'business_name'}
              valueField={'business_name'}
              onSelect={item => {
                setSelectedUserData(item);
              }}
            />
          </View>
        </View>

        {/* Contact Number */}
        <View style={styles.dataContainer}>
          <View style={styles.titleContainer}>
            <Text style={[{color: colors.text}]}>{string.contactnumber}</Text>
          </View>
          <View style={styles.valueContainer}>
            <Text
              style={[styles.contact, {color: colors.secondary}]}
              onPress={() => {
                if (selectedUserData?.phone_number) {
                  Linking.openURL(`tel:${selectedUserData?.phone_number}`);
                }
              }}>
              {selectedUserData?.phone_number ?? 'Unavailable'}
            </Text>
          </View>
        </View>

        {/* Cylinder Held , Security Deposit  */}
        <TableView title={string.cylinderHeld} value={numberOfCylinder} />
        <TableView
          title={string.securityDeposit}
          value={formatToLocalRupee(selectedUserData?.securityDeposit)}
        />

        {/* Delivered view */}
        {
          <View style={styles.deliveredContainer}>
            <View style={styles.deliveredTopContainer}>
              <Text style={[styles.title, {color: colors.text}]}>
                {string.delivered}
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
              <HeaderTitleView
                style={styles.weightContainer}
                title={'Product'}
              />
              <HeaderTitleView
                style={styles.quantityContainer}
                title={'Quantity'}
              />
              <HeaderTitleView
                style={styles.rateTextContainer}
                title={'Rate'}
              />
              <HeaderTitleView
                style={styles.rateTextContainer}
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
                <DeliverTable
                  data={productList}
                  index={index}
                  itemsLength={items.length}
                  updateData={handleUpdate}
                  onRemove={handleRemove}
                />
              </View>
            ))}
          </View>
        }

        {/* Collected view */}
        {
          <View style={styles.collectContainer}>
            <View style={styles.collectHeaderContainer}>
              <Text style={{fontWeight: 'bold', color: 'black'}}>
                {'Collected'}
              </Text>
              <Pressable
                style={styles.plusContainer}
                onPress={handleAddCollect}>
                <Ionicon
                  name={'add-circle-outline'}
                  size={20}
                  color={'dodgerblue'}
                />
              </Pressable>
            </View>
            <View style={styles.collectTableContainer}>
              <View style={styles.bottomCollectView}>
                <HeaderTitleView
                  title={'Product'}
                  style={styles.weightContainer}
                />
                <HeaderTitleView
                  title={'Quantity'}
                  style={styles.weightContainer}
                />
                <HeaderTitleView style={styles.rateTextContainer} title={''} />
                <HeaderTitleView style={styles.rateTextContainer} title={''} />
                {collectItems?.length > 1 ? (
                  <View style={styles.emptyView}>
                    <Text>{''}</Text>
                  </View>
                ) : null}
              </View>
              {collectItems?.map((_, index) => (
                <View style={styles.tableContainer} key={_.id}>
                  <CollectTable
                    index={index}
                    data={productList}
                    itemsLength={collectItems.length}
                    updateData={handleCollectUpdate}
                    onRemove={handleCollectRemove}
                  />
                </View>
              ))}
            </View>
          </View>
        }

        {/* bottom view */}
        <View style={styles.bottomContainer}>
          <TableView
            title={string.paymentToCollect}
            value={formatToLocalRupee(totalBillValue)}
          />
          <TableView
            title={string.discount}
            value={formatToLocalRupee(totalDiscountValue)}
          />
          <TableView
            title={string.finalbillamount}
            value={formatToLocalRupee(finalBillAmount)}
          />
          <TableView
            title={string.newsecuritydeposit}
            value={String(securitydeposit)}
            ontextupdate={depositValue => {
              setSecurityDeposit(depositValue);
              calculatePaymentToBeCollected(finalBillAmount, depositValue);
            }}
            // editable={items !== null && collectItems !== null}
          />
          <TableView
            title={string.pendingPayment}
            value={formatToLocalRupee(selectedUserData?.pendingpayment)}
          />
          <TableView
            title={string.paymentToBeCollected}
            value={formatToLocalRupee(paymenttobecollected)}
          />
          <TableView
            title={string.paymentCollected}
            value={String(paymentcollected)}
            ontextupdate={collectedValue => {
              setPaymentCollected(collectedValue);
              calculateBalanceAmount(paymenttobecollected, collectedValue);
            }}
            // editable={items !== null && collectItems !== null}
          />

          {/* Mode of payment */}
          <View style={styles.dataContainer}>
            <View style={styles.titleContainer}>
              <Text style={{color: 'black'}}>{string.modeofpayment}</Text>
            </View>
            <View style={styles.valueContainer}>
              <DropDownFile
                data={paymentmode}
                labelField={'name'}
                valueField={'name'}
                onSelect={item => {
                  setModeOfPayment(item.value);
                }}
                showSearch={false}
                customStyle={{width: 120, alignSelf: 'flex-end'}}
              />
            </View>
          </View>

          <TableView
            title={string.balance}
            value={formatToLocalRupee(balanceAmount)}
          />

          {/* Remarks */}
          <View style={styles.dataContainer}>
            <View style={styles.titleContainer}>
              <Text style={{color: colors.text}}>{'Remarks'}</Text>
            </View>
            <View style={styles.remarks}>
              <TextInput
                // editable={items !== null && collectItems !== null}
                style={[styles.remarkTextinput, {color: colors.text}]}
                value={remarks}
                maxLength={50}
                onChangeText={setRemarks}
              />
            </View>
          </View>

          {/* payment screenshot */}
          <View style={styles.dataContainer}>
            <View style={styles.titleContainer}>
              <Text style={[{color: colors.text}]}>{'Payment Screenshot'}</Text>
            </View>
            <TouchableOpacity
              style={styles.valueContainer}
              onPress={selectFromCamera}>
              <Text
                style={[styles.contact, {color: 'gray'}]}
                ellipsizeMode="middle"
                numberOfLines={1}>
                {imageData?.fileName ?? 'Click to upload'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* button */}
        <TouchableOpacity onPress={submitdeliverydata} style={styles.loginBtn}>
          <Text style={styles.loginText}>Submit</Text>
        </TouchableOpacity>
        <BottomSheetComponent ref={parentBottomSheetRef}>
          <ViewCustomerData data={selectedUserData} />
        </BottomSheetComponent>
      </ScrollView>
      <BottomAlert ref={alertRef} />
    </KeyboardAvoidingView>
  );
};

export default CylinderDelivery2;

const styles = StyleSheet.create({
  title: {fontWeight: 'bold'},
  contact: {textAlign: 'right'},
  container: {paddingHorizontal: 10, paddingVertical: 20},
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 20,
    textAlign: 'center',
    color: 'black',
  },
  dataContainer: {flexDirection: 'row', marginVertical: 5},
  titleContainer: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'row',
  },
  remarks: {
    borderWidth: 1,
    borderColor: 'gainsboro',
    borderRadius: 5,
    width: 120,
  },
  remarkTextinput: {padding: 0, marginHorizontal: 5},
  valueContainer: {flex: 1},
  rate: {alignSelf: 'flex-end', marginHorizontal: 10},
  titleContainer1: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  weightContainer: {flex: 1, alignItems: 'center'},
  quantityContainer: {flex: 1, alignItems: 'center'},
  rateTextContainer: {flex: 0.8, alignItems: 'center'},
  deliveredContainer: {marginVertical: 20},
  deliveredTopContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  plusContainer: {paddingHorizontal: 10},
  emptyView: {flex: 0.2},
  tableContainer: {flexDirection: 'row', marginBottom: 15},
  collectContainer: {flexDirection: 'column'},
  collectHeaderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  collectTableContainer: {
    // flex: 1,
  },
  bottomCollectView: {flexDirection: 'row', marginBottom: 10},
  bottomContainer: {marginTop: 20},
  button: {
    backgroundColor: 'lightblue',
    width: 100,
    alignSelf: 'center',
    alignItems: 'center',
    padding: 10,
    marginTop: 20,
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
    fontWeight: 'bold',
  },
});
