import React, {useState, useRef} from 'react';
import {
  View,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  SectionList,
} from 'react-native';
import Ionicon from 'react-native-vector-icons/Ionicons';
import {ScrollView} from 'react-native-gesture-handler';
import BottomSheetComponent from '../../components/BottomSheetComponent';
import HandOverRequest from './HandOverRequest';

// from
// request created section -> 1 button (cancel)
// request recevied section -> 2 button (accept, reject)
// only pending request to be shown
// refresh button to be shown on header

const Item = ({
  item,
  onPress,
  backgroundColor,
  textColor,
  isOfCreateRequest,
  isLastItem,
}) => (
  <TouchableOpacity
    onPress={onPress}
    style={[styles.item, {backgroundColor, marginBottom: isLastItem ? 10 : 0}]}>
    <View style={styles.textContainer}>
      <Text style={[styles.title, {color: textColor}]}>{item.driver}</Text>
      <Text style={[styles.subTitle, {color: textColor}]}>
        {item.product} {item.type} : {item.quantity}
      </Text>
    </View>
    <View style={styles.buttonContainer}>
      {isOfCreateRequest ? null : (
        <Pressable
          style={styles.plusContainer}
          onPress={() => {
            onAcceptRequest();
          }}>
          <Ionicon
            name={'checkmark-circle-outline'}
            size={35}
            color={'green'}
          />
        </Pressable>
      )}
      <Pressable
        style={styles.plusContainer}
        onPress={() => {
          onAcceptRequest();
        }}>
        <Ionicon name={'close-circle-outline'} size={35} color={'#FF3333'} />
      </Pressable>
    </View>
  </TouchableOpacity>
);
const onAcceptRequest = async () => {};

export function HandoverScreen({navigation}) {
  const [selectedId, setSelectedId] = useState();
  const parentBottomSheetRef = useRef(null);

  React.useEffect(() => {
    navigation.setOptions({
      headerRight: props => (
        <TouchableOpacity activeOpacity={0.5} style={{marginHorizontal: 10}}>
          <Ionicon name={'refresh'} size={25} color={'black'} />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  const renderItem = ({item}) => {
    const backgroundColor = item.id === selectedId ? '#6495ED' : 'white';
    const color = item.id === selectedId ? 'white' : 'black';
    const isLastItem = isLastItemInCreatedRequest(item);
    return (
      <ScrollView>
        <Item
          item={item}
          onPress={() => setSelectedId(item.id)}
          backgroundColor={backgroundColor}
          textColor={color}
          isLastItem={isLastItem}
          isOfCreateRequest={doesDriverExistInCreatedRequests(item.id)}
        />
      </ScrollView>
    );
  };

  function isLastItemInCreatedRequest(item) {
    const createdRequest = respdata.createdrequest || [];
    return createdRequest[createdRequest.length - 1] === item;
  }

  const doesDriverExistInCreatedRequests = driverId => {
    if (respdata && respdata.createdrequest) {
      return respdata.createdrequest.some(request => request.id === driverId);
    }
    return false;
  };

  const onPressHandover = () => {
    parentBottomSheetRef.current.focus();
  };

  return (
    <SafeAreaView style={styles.container}>
      <SectionList
        sections={[
          {title: 'Created request', data: respdata.createdrequest},
          {title: 'Received request', data: respdata.receivedrequest},
        ]}
        renderItem={renderItem}
        renderSectionHeader={({section}) => (
          <View style={styles.titlewrap}>
            <Text style={styles.taskTitle}>{section.title}</Text>
          </View>
        )}
        keyExtractor={item => item.id}
        stickySectionHeadersEnabled
      />
      <TouchableOpacity
        onPress={() => onPressHandover()}
        style={styles.handoverBtn}>
        <Text style={styles.handoverText}>HandOver </Text>
      </TouchableOpacity>
      <BottomSheetComponent ref={parentBottomSheetRef}>
        <HandOverRequest />
      </BottomSheetComponent>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  titlewrap: {
    padding: 10,
    backgroundColor: 'white',
  },
  taskTitle: {fontWeight: 'bold', fontSize: 16, color: 'black'},
  item: {
    flex: 1,
    flexDirection: 'row',
    padding: 10,
    marginTop: 5,
    marginHorizontal: 5,
    borderRadius: 8,
  },
  title: {
    fontSize: 14,
    fontWeight: 'bold',
    color: 'black',
  },
  subTitle: {
    fontSize: 14,
  },
  handoverBtn: {
    width: '60%',
    backgroundColor: '#6495ED',
    borderRadius: 25,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 40,
    marginBottom: 10,
    marginLeft: 70,
  },
  handoverText: {
    color: 'white',
  },
  textContainer: {
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'flex-start',
  },
});

const respdata = {
  createdrequest: [
    {
      id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28ba',
      driver: 'Alex', // driver
      type: 'empty',
      product: '12kg', // product
      quantity: '2',
      status: 'pending', // TBD: specific request to be shown
    },
    {
      id: '3ac68afc-c605-48d3-a4f8-fbd91aa97f63',
      driver: 'Second',
      type: 'Filled',
      product: '17kg',
      quantity: '5',
      status: 'rejected',
    },
    {
      id: '58694a0f-3da1-471f-bd96-145571e29d72',
      driver: 'Third',
      type: 'empty',
      product: '21kg',
      quantity: '2',
      status: 'pending',
    },
  ],
  receivedrequest: [
    {
      id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28bs',
      driver: 'Alex', // driver
      type: 'empty',
      product: '12kg', // product
      quantity: '2',
      status: 'pending', // TBD: specific request to be shown
    },
  ],
};
