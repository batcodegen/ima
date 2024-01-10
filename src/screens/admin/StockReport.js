import {FlatList, ScrollView, StyleSheet, Text, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useStockReport} from '../../hooks/useStockReport';
import DropDownFile from '../../components/DropDown';

const StockReport = () => {
  const {data} = useStockReport();
  const [selectedItem, setSelectedItem] = useState({});
  useEffect(() => {
    if (data) {
      setSelectedItem(data?.locationreport[0]);
    }
  }, [data]);

  const renderItemSummary = ({item, index}) => (
    <View style={[styles.cardfilled, styles.shadow]} key={index}>
      <Text style={styles.filledText}>{item.weight}</Text>
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
    </View>
  );

  const renderItem = ({item, index}) => (
    <View style={[styles.card, styles.shadow]} key={index}>
      <Text style={styles.filledText}>{item.weight}</Text>
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
        <Text style={styles.totalsummary}>Total summary</Text>
        <FlatList
          data={data?.summaryreport ?? []}
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
              data={data?.locationreport}
              labelField={'location'}
              valueField={'location'}
              showSearch={false}
              onSelect={item => {
                const selectedOptn = data?.locationreport?.filter(
                  i => item === i.location,
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
    paddingVertical: 20,
    borderRadius: 10,
    paddingHorizontal: 20,
    backgroundColor: 'lightblue',
    margin: 10,
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
  filledValue: {
    textAlign: 'center',
    color: 'black',
    fontSize: 18,
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
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    alignItems: 'center',
  },
});
