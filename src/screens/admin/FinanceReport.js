import {Pressable, ScrollView, StyleSheet, Text, View} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import {useFinanceReport} from '../../hooks/useAdminDashboard';
import {formatToLocalRupee} from '../../helpers/utils';
import Filter from '../../components/Filter';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {useTheme} from '@react-navigation/native';
import CustomDatePicker from '../../components/CustomDatePicker';
import dayjs from 'dayjs';

const FinanceReport = () => {
  const {colors} = useTheme();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState(null);
  const [showCustomerDate, setShowCustomDate] = useState(false);
  const [toDate, setToDate] = useState(dayjs(new Date()).format('DD-MM-YYYY'));
  const [fromDate, setFromDate] = useState(
    dayjs(new Date()).format('DD-MM-YYYY'),
  );
  const [title, setTitle] = useState('Today');
  const {data} = useFinanceReport();

  useEffect(() => {
    if (data) {
      setSelectedFilter(data.today);
    }
  }, [data]);

  const toggleVisibility = () => {
    setIsModalVisible(prevState => !prevState);
  };

  const onItemSelect = item => {
    setShowCustomDate(item.id === 'customdate');
    setTitle(item.name);
    setSelectedFilter(data[item.id]);
    toggleVisibility();
  };

  const Header = useCallback(
    ({titleText}) => (
      <View style={styles.headerContainer}>
        <Text style={[styles.headerText, {color: colors.text}]}>
          {titleText}
        </Text>
      </View>
    ),
    [],
  );

  const ContentRow = useCallback(
    ({titleText1, val1, hasNext, titleText2, val2}) => (
      <View style={{flexDirection: 'row'}}>
        <View
          style={[
            styles.firstCol,
            {borderRightColor: hasNext ? colors.border : colors.background},
          ]}>
          <Text style={{color: colors.text}}>{titleText1}</Text>
          <Text style={[styles.valText, {color: colors.text}]}>
            {formatToLocalRupee(val1)}
          </Text>
        </View>
        {hasNext ? (
          <View style={styles.secondCol}>
            <Text style={{color: colors.text}}>{titleText2}</Text>
            <Text style={[styles.valText, {color: colors.text}]}>
              {formatToLocalRupee(val2)}
            </Text>
          </View>
        ) : (
          <View style={styles.secondCol} />
        )}
      </View>
    ),
    [],
  );

  const TitleContainer = useCallback(() => {
    return (
      <>
        {showCustomerDate ? (
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginHorizontal: 10,
              justifyContent: 'space-between',
              marginTop: 5,
            }}>
            <CustomDatePicker title={'From'} onDateChange={setFromDate} />
            <Text style={{color: colors.text, marginHorizontal: 5}}>-</Text>
            <CustomDatePicker title={'To'} onDateChange={setToDate} />
            <Pressable
              style={{
                padding: 10,
                backgroundColor: 'lightblue',
                marginHorizontal: 10,
                borderRadius: 5,
              }}>
              <FontAwesome
                name={'search'}
                size={20}
                color={colors.background}
              />
            </Pressable>
          </View>
        ) : (
          <Text style={[styles.titleText, {color: colors.text}]}>{title}</Text>
        )}
      </>
    );
  }, [showCustomerDate]);

  return (
    <View style={styles.topcontainer}>
      <TitleContainer />
      <ScrollView showsVerticalScrollIndicator={false}>
        <Header titleText={'Sales'} />
        <View style={styles.colContainer}>
          <ContentRow
            titleText1={'Sale'}
            titleText2={'Purchase'}
            hasNext
            val1={selectedFilter?.sales?.sale}
            val2={selectedFilter?.sales?.purchase}
          />
          <View style={[styles.separator, {backgroundColor: colors.border}]} />
          <ContentRow
            titleText1={'Profit'}
            titleText2={'Security Deposit'}
            hasNext
            val1={selectedFilter?.sales?.profit}
            val2={selectedFilter?.sales?.securitydeposit}
          />
          <View style={[styles.separator, {backgroundColor: colors.border}]} />
          <ContentRow
            titleText1={'Pending Payment'}
            hasNext={false}
            val1={selectedFilter?.sales?.pendingpayment}
          />
        </View>
        <View style={styles.bottomContainer}>
          <Text style={[styles.bottomContText, {color: colors.text}]}>
            {'Payment Collected'}
          </Text>
          <ContentRow
            titleText1={'Cash'}
            titleText2={'UPI'}
            hasNext
            val1={selectedFilter?.sales?.paymentcollected?.cash}
            val2={selectedFilter?.sales?.paymentcollected?.upi}
          />
          <View style={[styles.separator, {backgroundColor: colors.border}]} />
          <ContentRow
            titleText1={'Bank'}
            titleText2={'Cheque'}
            hasNext
            val1={selectedFilter?.sales?.paymentcollected?.online}
            val2={selectedFilter?.sales?.paymentcollected?.check}
          />
        </View>

        {/* Purchases */}
        <Header titleText={'Purchases'} />
        <View style={styles.colContainer}>
          <ContentRow
            titleText1={'Purchase'}
            titleText2={'Purchase Payments'}
            hasNext
            val1={selectedFilter?.purchases?.purchase}
            val2={selectedFilter?.purchases?.purchasepayment}
          />
          <View style={[styles.separator, {backgroundColor: colors.border}]} />
          <ContentRow
            titleText1={'Pending Payment'}
            hasNext={false}
            val1={selectedFilter?.purchases?.pendingpayment}
          />
        </View>
        <View style={styles.bottomContainer}>
          <Text style={[styles.bottomContText, {color: colors.text}]}>
            {'Freight Charges'}
          </Text>
          <ContentRow
            titleText1={'Received'}
            titleText2={'Pending'}
            hasNext
            val1={selectedFilter?.purchases?.paymentcollected?.received}
            val2={selectedFilter?.purchases?.paymentcollected?.pending}
          />
        </View>

        {/* Expenses */}
        <Header titleText={'Expenses'} />
        <View style={styles.colContainer}>
          <ContentRow
            titleText1={'Salaries'}
            titleText2={'Vehicle Expenses'}
            hasNext
            val1={selectedFilter?.expenses?.salaries}
            val2={selectedFilter?.expenses?.vehicleexpenses}
          />
          <View style={[styles.separator, {backgroundColor: colors.border}]} />
          <ContentRow
            titleText1={'Other Expenses'}
            hasNext={false}
            val1={selectedFilter?.expenses?.otherexpenses}
          />
        </View>
        <View style={styles.bottomContainer}>
          <Text style={[styles.bottomContText, {color: colors.text}]}>
            {'Payments'}
          </Text>
          <ContentRow
            titleText1={'Cash'}
            titleText2={'Bank'}
            hasNext
            val1={selectedFilter?.expenses?.paymentcollected?.cash}
            val2={selectedFilter?.expenses?.paymentcollected?.bank}
          />
        </View>
      </ScrollView>
      <Pressable style={styles.modalContainer} onPress={toggleVisibility}>
        <FontAwesome name={'filter'} size={20} />
      </Pressable>
      <Filter
        isVisible={isModalVisible}
        toggleModalState={toggleVisibility}
        onItemSelect={onItemSelect}
      />
    </View>
  );
};

export default FinanceReport;

const styles = StyleSheet.create({
  bottomContText: {textAlign: 'center', marginBottom: 10, fontWeight: 'bold'},
  bottomContainer: {
    borderWidth: 1,
    borderTopWidth: 0,
    marginHorizontal: 10,
    padding: 10,
    borderBottomEndRadius: 10,
    borderBottomStartRadius: 10,
    marginBottom: 10,
  },
  separator: {
    marginVertical: 5,
    height: 1,
  },
  secondCol: {alignItems: 'center', flex: 1},
  valText: {fontWeight: 'bold', fontSize: 16},
  colContainer: {
    borderWidth: 1,
    marginHorizontal: 10,
    marginTop: 10,
    padding: 10,
    borderTopEndRadius: 10,
    borderTopStartRadius: 10,
  },
  firstCol: {
    alignItems: 'center',
    flex: 1,
    borderRightWidth: 1,
  },
  headerText: {fontWeight: 'bold'},
  headerContainer: {
    backgroundColor: 'lightgrey',
    paddingVertical: 10,
    marginVertical: 10,
    paddingHorizontal: 15,
  },
  titleText: {
    backgroundColor: 'lightblue',
    padding: 10,
    marginTop: 5,
    borderRadius: 5,
    textAlign: 'center',
    alignSelf: 'center',
    fontWeight: 'bold',
  },
  modalContainer: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'lightblue',
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 0.8,
  },
  topcontainer: {
    flex: 1,
    backgroundColor: 'white',
  },
  revenueContainer: {
    backgroundColor: 'lightblue',
    borderRadius: 5,
    marginBottom: 20,
    padding: 20,
    alignItems: 'center',
    width: '48%',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  title: {fontSize: 18, textAlign: 'center', color: 'black'},
  number: {fontSize: 16, marginTop: 10, fontWeight: 'bold', color: 'black'},
});
