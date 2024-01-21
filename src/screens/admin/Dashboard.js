import {Pressable, ScrollView, StyleSheet, Text, View} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import {ROUTES} from '../../navigator/routes';
import {useFinanceReport} from '../../hooks/useAdminDashboard';
import FinanceChart from '../../components/FinanceChart';
import {useStockReport} from '../../hooks/useStockReport';
import {useTheme} from '@react-navigation/native';
import StockChart from '../../components/StockChart';
import RefreshButton from '../../components/RefreshButton';

const Dashboard = ({navigation}) => {
  const {colors} = useTheme();
  const {data: financeData, refetch: refetchFinance} = useFinanceReport();
  const {cumulativeData, refetch: refetchStock} = useStockReport();

  const [initialFinanceData, setInitialFinanceData] = useState(null);

  useEffect(() => {
    navigation.setOptions({
      // eslint-disable-next-line react/no-unstable-nested-components
      headerRight: props => (
        <RefreshButton
          onPress={() => {
            refetchFinance();
            refetchStock();
          }}
        />
      ),
    });
  }, [navigation]);

  useEffect(() => {
    if (financeData) {
      setInitialFinanceData(prevState => ({...financeData}));
    }
  }, [financeData]);

  const navigateTo = screenName => {
    navigation.navigate(screenName);
  };

  const HeaderView = useCallback(({leftTitle, navigatePath}) => {
    return (
      <View style={styles.titleContainer}>
        <Text style={[styles.leftText, {color: colors.text}]}>{leftTitle}</Text>
        <Pressable onPress={() => navigateTo(navigatePath)}>
          <Text style={[styles.rightText, {color: colors.text}]}>
            {'View Details >'}
          </Text>
        </Pressable>
      </View>
    );
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <HeaderView
        leftTitle={'Stock Report'}
        navigatePath={ROUTES.STOCKREPORT}
      />
      {cumulativeData && <StockChart data={cumulativeData} />}
      <HeaderView
        leftTitle={'Finance Report'}
        navigatePath={ROUTES.FINANCEREPORT}
      />
      {initialFinanceData && <FinanceChart data={initialFinanceData} />}
    </ScrollView>
  );
};

export default Dashboard;

const styles = StyleSheet.create({
  rightText: {fontSize: 12, fontWeight: 'bold'},
  leftText: {fontSize: 14, fontWeight: 'bold'},
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    backgroundColor: 'gainsboro',
  },
  container: {
    // flex: 1,
    backgroundColor: '#fff',
    // alignItems: 'center',
    justifyContent: 'center',
  },
  text: {fontWeight: 'bold', fontSize: 20, color: 'black'},
  card1: {
    width: '80%',
    height: 100,
    backgroundColor: 'lightblue',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  card2: {
    marginTop: 20,
    width: '80%',
    height: 100,
    backgroundColor: 'lightcyan',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
});
