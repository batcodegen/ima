import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Linking,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import DropDownFile from '../../components/DropDown';
import string from '../../helpers/strings.json';
import TableView from '../../components/TableView';
import DeliverTable from '../../components/DeliverTable';
import CollectTable from '../../components/CollectTable';
import Ionicon from 'react-native-vector-icons/Ionicons';
import BottomSheetComponent from '../../components/BottomSheetComponent';
import paymentmode from '../../assets/dummydata/paymentmode.json';
import {useGetDeliveryData} from '../../hooks/useDelivery';
import NewCustomer from '../../components/NewCustomer';
import {formatToLocalRupee} from '../../helpers/utils';
import RefreshButton from '../../components/RefreshButton';
import BottomAlert from '../../components/BottomAlert';

export function CylinderDelivery({navigation}) {
  const onP = () => navigation.navigate('CylinderDelivery2');
  const alertRef = useRef();
  // textinputs
  const [billdata, setBillData] = useState({
    bill: 0,
    discount: 0,
    finalbill: 0,
  });
  const [securitydeposit, setSecurityDeposit] = useState(0);
  const [paymentcollected, setPaymentCollected] = useState(0);
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  // bottom sheet vars
  const parentBottomSheetRef = useRef(null);

  const handlePresentModalPress = () => parentBottomSheetRef.current.focus();

  // init states
  const [items, setItems] = useState([
    {id: 1, quantity: '1', weight: '', rate: '0'},
  ]);
  const [collectItems, setCollectItems] = useState([
    {id: 1, quantity: '', weight: ''},
  ]);

  // apis
  const {
    deliverydata,
    weightsData,
    callCreateCustomerApi,
    refetchDeliveryData,
  } = useGetDeliveryData();

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

  useEffect(() => {
    if (weightsData && deliverydata) {
      setItems([
        {
          id: 1,
          quantity: '1',
          weight: weightsData[0].name,
          rate: weightsData[0].price,
        },
      ]);
      const disc = deliverydata?.[0]?.discount;
      const finalbill = weightsData[0].price - disc;
      setBillData(prevState => ({
        ...prevState,
        discount: disc,
        bill: weightsData[0].price,
        finalbill: finalbill,
      }));
      setSelectedCustomer(deliverydata?.[0]);
    }
  }, [weightsData, deliverydata]);

  useEffect(() => {
    const billAmt = calculateBillAmount();
    const disc = calculateDiscount(billAmt);
    const finalbill = billAmt - disc;
    setBillData(prevState => ({
      ...prevState,
      bill: billAmt,
      discount: disc,
      finalbill: finalbill,
    }));
  }, [calculateBillAmount, calculateDiscount, items, selectedCustomer]);

  const handleAdd = () => {
    setItems([
      ...items,
      {
        id: items.length + 1,
        quantity: '1',
        weight: weightsData[0].name ?? '',
        rate: String(weightsData[0].price) ?? '0',
      },
    ]);
  };

  const handleRemove = index => {
    const updatedItems = items.filter((_, i) => i !== index);
    setItems(updatedItems);
  };

  const handleUpdate = (index, newData) => {
    const updatedItems = [...items];
    updatedItems[index] = {...updatedItems[index], ...newData};
    setItems(updatedItems);
  };

  const handleAddCollect = () => {
    setCollectItems([
      ...collectItems,
      {id: collectItems.length + 1, quantity: '', weight: ''},
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

  const getTotalValue = () => {
    return items.reduce(
      (accumulator, item) => accumulator + parseFloat(item.rate),
      0,
    );
  };

  const calculateBalance = () => {
    //paymenttobecollected + pendingpayemnt (top) - paymentcollected
    return (
      parseFloat(billdata.bill) +
      (selectedCustomer?.pendingPayment ?? 0) -
      (paymentcollected ? parseFloat(paymentcollected) : 0)
    );
  };

  const submitdeliverydata = () => {
    if (securitydeposit === '' || paymentcollected === '') {
      alertRef.current.showAlert('Fields cannot be empty.', 'Error');
    } else {
      showAlert('Success', 'Delivery data has been updated!');
    }
  };

  const HeaderTitleView = useCallback(
    ({style, title}) => (
      <View style={style}>
        <Text style={{color: 'black'}}> {title}</Text>
      </View>
    ),
    [],
  );

  // const billamount  = useMemo(()=> {
  //   return items.reduce(
  //     (accumulator, currentValue) =>
  //       accumulator + parseFloat(currentValue.rate),
  //     0,
  //   );

  // },[])

  const calculateBillAmount = useCallback(() => {
    return items.reduce(
      (accumulator, currentValue) =>
        accumulator + parseFloat(currentValue.rate),
      0,
    );
  }, [items]);

  const calculateDiscount = useCallback(
    billAmt => {
      return selectedCustomer?.discount;
    },
    [selectedCustomer],
  );

  const handleItemChange = item => {
    setSelectedCustomer(item);
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
              parentBottomSheetRef.current.close();
              refetchDeliveryData();
            }
          },
        },
      ],
      {cancelable: false},
    );
  };

  const updateNewCustomerData = async custData => {
    const {success, error} = await callCreateCustomerApi(custData);
    // TODO: handle actual error correctly
    if (success) {
      showAlert('Success', 'Customer created successfully', true);
    } else {
      showAlert('Error', error, false);
    }
  };

  // console.log('bill, disc', billdata.bill, discount, items);
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={50}>
      <Text onPress={onP}>nav</Text>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
        bounces={false}>
        <View style={styles.dataContainer}>
          <View style={styles.titleContainer}>
            <Text style={{color: 'black'}}>{string.customerName}</Text>
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
          </View>
          <View style={styles.valueContainer}>
            <DropDownFile
              data={deliverydata}
              labelField={'name'}
              valueField={'name'}
              onSelect={item => {
                handleItemChange(item);
              }}
            />
          </View>
        </View>
        <View style={styles.dataContainer}>
          <View style={styles.titleContainer}>
            <Text style={{color: 'black'}}>{string.contactnumber}</Text>
          </View>
          <View style={styles.valueContainer}>
            <Text
              style={{color: 'dodgerblue', textAlign: 'right'}}
              onPress={() => {
                if (selectedCustomer?.contact) {
                  Linking.openURL(`tel:${selectedCustomer?.contact}`);
                }
              }}>
              {selectedCustomer?.contact ?? 'Unavailable'}
            </Text>
          </View>
        </View>
        <TableView
          title={string.cylinderHeld}
          value={selectedCustomer?.cylinderHeld}
        />
        <TableView
          title={string.discount}
          value={formatToLocalRupee(selectedCustomer?.discount)}
        />
        <TableView
          title={'Security Deposit'}
          value={formatToLocalRupee(selectedCustomer?.securityDeposit)}
        />

        {/* Delivered view */}
        <View>
          <View style={styles.deliveredContainer}>
            <View style={styles.deliveredTopContainer}>
              <Text style={{fontWeight: 'bold', color: 'black'}}>
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
              {items?.length > 1 ? (
                <View style={styles.emptyView}>
                  <Text>{''}</Text>
                </View>
              ) : null}
            </View>
            {items.map((_, index) => (
              <View style={styles.tableContainer} key={_.id}>
                <DeliverTable
                  data={weightsData}
                  index={index}
                  itemsLength={items.length}
                  updateData={handleUpdate}
                  onRemove={handleRemove}
                />
              </View>
            ))}
          </View>
        </View>

        {/* Collected view */}
        <View style={styles.collectContainer}>
          <View style={styles.collectHeaderContainer}>
            <Text style={{fontWeight: 'bold', color: 'black'}}>
              {'Collected'}
            </Text>
            <Pressable style={styles.plusContainer} onPress={handleAddCollect}>
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
              {collectItems?.length > 1 ? (
                <View style={styles.emptyView}>
                  <Text>{''}</Text>
                </View>
              ) : null}
            </View>
            {collectItems.map((_, index) => (
              <View style={styles.tableContainer} key={_.id}>
                <CollectTable
                  index={index}
                  data={weightsData}
                  itemsLength={collectItems.length}
                  updateData={handleCollectUpdate}
                  onRemove={handleCollectRemove}
                />
              </View>
            ))}
          </View>
        </View>

        {/* bottom view */}
        <View style={styles.bottomContainer}>
          <TableView
            title={string.paymentToCollect}
            value={formatToLocalRupee(billdata.bill)}
          />
          <TableView
            title={string.discount}
            value={formatToLocalRupee(billdata.discount)}
          />
          <TableView
            title={string.finalbillamount}
            value={formatToLocalRupee(billdata.finalbill)}
          />
          <TableView
            title={string.newsecuritydeposit}
            value={String(securitydeposit)}
            ontextupdate={setSecurityDeposit}
          />
          <TableView
            title={string.pendingPayment}
            value={formatToLocalRupee(selectedCustomer?.pendingpayment)}
          />
          <TableView
            title={string.paymentCollected}
            value={String(paymentcollected)}
            ontextupdate={setPaymentCollected}
          />

          <View style={styles.dataContainer}>
            <View style={styles.titleContainer}>
              <Text style={{color: 'black'}}>{string.modeofpayment}</Text>
            </View>
            <View style={styles.valueContainer}>
              <DropDownFile
                data={paymentmode}
                labelField={'value'}
                valueField={'value'}
                onSelect={item => console.log(item)}
                showSearch={false}
              />
            </View>
          </View>
          <TableView
            title={string.balance}
            value={formatToLocalRupee(String(calculateBalance()))}
          />
        </View>

        {/* button */}
        <TouchableOpacity onPress={submitdeliverydata} style={styles.loginBtn}>
          <Text style={styles.loginText}>Submit</Text>
        </TouchableOpacity>
        <BottomSheetComponent ref={parentBottomSheetRef}>
          <NewCustomer sendData={updateNewCustomerData} />
        </BottomSheetComponent>
      </ScrollView>
      <BottomAlert ref={alertRef} />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
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
