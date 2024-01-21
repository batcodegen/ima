import {FlatList, ScrollView, StyleSheet, Text, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useStockReport} from '../../hooks/useStockReport';
import DropDownFile from '../../components/DropDown';
import {useTheme} from '@react-navigation/native';
import RefreshButton from '../../components/RefreshButton';

const StockReport = ({navigation}) => {
  const {colors} = useTheme();
  const {summaryreport, locationreport, cumulativeData, refetch} =
    useStockReport();
  const [selectedItem, setSelectedItem] = useState({});
  useEffect(() => {
    if (locationreport) {
      setSelectedItem(locationreport[0]);
    }
  }, [locationreport]);

  useEffect(() => {
    navigation.setOptions({
      // eslint-disable-next-line react/no-unstable-nested-components
      headerRight: props => (
        <RefreshButton
          onPress={() => {
            refetch();
          }}
        />
      ),
    });
  }, [navigation]);

  // const filterLocations = locReport => {
  //   return locReport?.filter(obj => typeof obj.location === 'string') ?? [];
  // };

  const renderItemSummary = ({item, index}) => (
    <View style={[styles.cardfilled, styles.shadow]} key={index}>
      <Text style={styles.filledText}>{item.product}</Text>
      {item.product_type === 'C' ? (
        <>
          <View style={styles.cardContainer}>
            <View style={styles.leftContainer}>
              <Text style={styles.filledText}>{'Filled'}</Text>
            </View>
            <View style={styles.rightContainer}>
              <Text style={styles.filledValue}>{item.filled}</Text>
            </View>
          </View>
          <View style={styles.cardContainer}>
            <View style={styles.bottomContainer}>
              <Text style={styles.filledText}>{'Empty'}</Text>
            </View>
            <View style={styles.bottomContainer}>
              <Text style={styles.filledValue}>{item.empty}</Text>
            </View>
          </View>
        </>
      ) : (
        <View style={[styles.cardContainer, {marginTop: 10}]}>
          <View style={styles.bottomContainer}>
            <Text style={styles.filledText2}>{'Stock'}</Text>
          </View>
          <View style={styles.bottomContainer}>
            <Text style={styles.filledValue}>{item.stock}</Text>
          </View>
        </View>
      )}
    </View>
  );

  const renderItem = ({item, index}) => (
    <View style={[styles.card, styles.shadow]} key={index}>
      <Text style={styles.filledText}>{item.product || item.name}</Text>
      {item.product_type === 'C' ? (
        <>
          <View style={styles.cardContainer}>
            <View style={styles.leftContainer}>
              <Text style={styles.filledText}>{'Filled'}</Text>
            </View>
            <View style={styles.rightContainer}>
              <Text style={styles.filledValue}>
                {item?.filled ?? item.filled_quantity}
              </Text>
            </View>
          </View>
          <View style={styles.cardContainer}>
            <View style={styles.bottomContainer}>
              <Text style={styles.filledText}>{'Empty'}</Text>
            </View>
            <View style={styles.bottomContainer}>
              <Text style={styles.filledValue}>
                {item?.empty ?? item.empty_quantity}
              </Text>
            </View>
          </View>
        </>
      ) : (
        <View style={[styles.cardContainer, {marginTop: 10}]}>
          <View style={styles.bottomContainer}>
            <Text style={styles.filledText2}>{'Stock'}</Text>
          </View>
          <View style={styles.bottomContainer}>
            <Text style={styles.filledValue}>{item.stock}</Text>
          </View>
        </View>
      )}
    </View>
  );

  //   if (error) {
  //     return <Text style={{color: 'black'}}>Error</Text>;
  //   }

  return (
    <>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}>
        <Text style={styles.totalsummary}>Overall summary</Text>
        <View style={styles.summaryContainer}>
          <View style={styles.totalfilled}>
            <Text style={[styles.textbold, {color: colors.text}]}>
              Total Filled
            </Text>
            <Text style={{color: colors.text}}>{cumulativeData?.filled}</Text>
          </View>
          <View style={styles.totalfilled}>
            <Text style={[styles.textbold, {color: colors.text}]}>
              Total Empty
            </Text>
            <Text style={{color: colors.text}}>{cumulativeData?.empty}</Text>
          </View>
          <View style={styles.totalfilled}>
            <Text style={[styles.textbold, {color: colors.text}]}>
              Total Products
            </Text>
            <Text style={{color: colors.text}}>{cumulativeData?.total}</Text>
          </View>
          <View style={[styles.totalfilled, {marginTop: 10}]}>
            <Text style={[styles.textbold, {color: colors.text}]}>
              Total Customers Filled
            </Text>
            <Text style={{color: colors.text}}>
              {cumulativeData?.customerFilled}
            </Text>
          </View>
        </View>
        <Text style={styles.totalsummary}>Total summary</Text>
        <FlatList
          data={summaryreport ?? []}
          renderItem={renderItemSummary}
          keyExtractor={(_, i) => i.toString()}
          numColumns={2}
        />
        <Text style={styles.locationsummary}>Location summary</Text>
        <View style={styles.dataContainer}>
          <View style={styles.titleContainer}>
            <Text style={{fontSize: 16, color: 'black'}}>{'Location: '}</Text>
          </View>
          <View style={styles.valueContainer}>
            <DropDownFile
              data={locationreport}
              labelField={'location'}
              valueField={'location'}
              showSearch={false}
              onSelect={item => {
                const selectedOptn = locationreport?.filter(
                  i => item.location === i.location,
                );
                setSelectedItem(selectedOptn[0]);
              }}
            />
          </View>
        </View>
        <Text style={styles.tableTitle}>{'Active Stock'}</Text>
        <FlatList
          data={selectedItem?.stock ?? []}
          renderItem={renderItem}
          keyExtractor={(_, index) => index.toString()}
          numColumns={2}
        />
      </ScrollView>
    </>
  );
};

export default StockReport;

const styles = StyleSheet.create({
  textbold: {fontWeight: 'bold'},
  summaryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 10,
    flexWrap: 'wrap',
  },
  totalfilled: {alignItems: 'center'},
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  cardContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomContainer: {flex: 1},
  leftContainer: {flex: 1, marginTop: 10},
  rightContainer: {flex: 1, marginTop: 10},
  contentContainer: {paddingBottom: 50},
  totalsummary: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'black',
  },
  subcontainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  shadow: {
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  cardfilled: {
    width: '45%',
    paddingVertical: 5,
    borderRadius: 10,
    paddingHorizontal: 10,
    backgroundColor: 'lightblue',
    margin: 10,
    justifyContent: 'center',
  },
  cardempty: {
    paddingVertical: 20,
    borderRadius: 10,
    paddingHorizontal: 50,
    backgroundColor: 'lightcyan',
    marginEnd: 20,
  },
  weightText: {marginVertical: 10, fontWeight: '600'},
  filledText: {
    textAlign: 'center',
    color: 'black',
    fontWeight: 'bold',
  },
  filledText2: {
    textAlign: 'center',
    color: 'black',
  },
  filledValue: {
    textAlign: 'center',
    color: 'black',
  },
  locationsummary: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 30,
    color: 'black',
  },
  dataContainer: {flexDirection: 'row', marginBottom: 5},
  titleContainer: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'row',
  },
  valueContainer: {flex: 1, borderWidth: 1, borderRadius: 5},
  tableTitle: {
    fontWeight: 'bold',
    fontSize: 14,
    marginVertical: 20,
    color: 'black',
  },
  card: {
    width: '45%',
    backgroundColor: '#fff',
    margin: 8,
    padding: 5,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
