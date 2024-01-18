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
import {useHandover} from '../../hooks/useHandover';
import {showConfirmAlert} from '../../helpers/utils';
import BottomAlert from '../../components/BottomAlert';

const getType = type => {
  switch (type) {
    case 'F':
      return 'Filled';
    case 'E':
      return 'Empty';
    default:
      return 'Empty';
  }
};

const Item = ({
  item,
  onPress,
  backgroundColor,
  textColor,
  isOfCreateRequest,
  isLastItem,
  onAcceptRequest,
  onRejectRequest,
}) => (
  <TouchableOpacity
    onPress={onPress}
    style={[styles.item, {backgroundColor, marginBottom: isLastItem ? 10 : 0}]}>
    <View style={styles.textContainer}>
      <Text
        style={[
          styles.title,
          {color: textColor},
        ]}>{`Source : ${item.source_name}`}</Text>
      <Text
        style={[
          styles.title,
          {color: textColor},
        ]}>{`Destination : ${item.destination_name}`}</Text>
      <Text style={[styles.subTitle, {color: textColor}]}>
        {item.product_name} {getType(item.cylinder_status)} : {item.quantity}
      </Text>
    </View>
    <View style={styles.buttonContainer}>
      {isOfCreateRequest ? null : (
        <Pressable
          style={styles.acceptContainer}
          onPress={() => {
            onAcceptRequest(item);
          }}>
          <Text style={styles.acceptText}>{'Accept'}</Text>
        </Pressable>
      )}
      <Pressable
        style={styles.rejectContainer}
        onPress={() => {
          onRejectRequest(item);
        }}>
        <Text style={styles.acceptText}>
          {isOfCreateRequest ? 'Cancel' : 'Reject'}
        </Text>
      </Pressable>
    </View>
  </TouchableOpacity>
);

export function HandoverScreen({navigation}) {
  const alertRef1 = useRef(null);
  const {data, refetch, updateRequest, createHandoverRequest} = useHandover();
  const [selectedId, setSelectedId] = useState();
  const parentBottomSheetRef = useRef(null);
  React.useEffect(() => {
    navigation.setOptions({
      // eslint-disable-next-line react/no-unstable-nested-components
      headerRight: props => (
        <TouchableOpacity
          activeOpacity={0.5}
          style={styles.headerRight}
          onPress={refetch}>
          <Ionicon name={'refresh'} size={25} color={'black'} />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  const onRejectRequest = async item => {
    await updateRequest({id: item.id, status: 'rejected'});
  };
  const onAcceptRequest = async item => {
    await updateRequest({id: item.id, status: 'approved'});
  };

  const submitApi = async apidata => {
    const {success, error} = await createHandoverRequest(apidata);
    if (success) {
      alertRef1.current.showAlert(
        'Request created successfully.',
        'Success',
        'success',
      );
      parentBottomSheetRef.current.close();
      refetch();
    } else if (error) {
      alertRef1.current.showAlert(error, 'Error');
    }
  };

  const renderItem = ({item}) => {
    const backgroundColor = item.id === selectedId ? '#6495ED' : '#f5f5f5';
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
          onRejectRequest={() =>
            showConfirmAlert(
              'Remove',
              'Cancel/Reject the selected request?',
              () => onRejectRequest(item),
            )
          }
          onAcceptRequest={() =>
            showConfirmAlert('Approve', 'Approve the selected request?', () =>
              onAcceptRequest(item),
            )
          }
          isOfCreateRequest={doesDriverExistInCreatedRequests(item.id)}
        />
      </ScrollView>
    );
  };

  function isLastItemInCreatedRequest(item) {
    const createdRequest = data?.createdrequest || [];
    return createdRequest[createdRequest.length - 1] === item;
  }

  const doesDriverExistInCreatedRequests = driverId => {
    if (data && data.createdrequest) {
      return data.createdrequest.some(request => request.id === driverId);
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
          {title: 'Created request', data: data?.createdrequest ?? []},
          {title: 'Received request', data: data?.receivedrequest ?? []},
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
        <HandOverRequest callApi={submitApi} />
      </BottomSheetComponent>
      <BottomAlert ref={alertRef1} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  headerRight: {marginHorizontal: 10},
  rejectContainer: {
    backgroundColor: '#FF3333',
    padding: 5,
    borderRadius: 5,
    width: 60,
    alignItems: 'center',
  },
  acceptText: {color: 'white'},
  acceptContainer: {
    backgroundColor: 'green',
    padding: 5,
    borderRadius: 5,
    width: 60,
    alignItems: 'center',
    marginBottom: 5,
  },
  container: {
    flex: 1,
  },
  titlewrap: {
    marginTop: 5,
    padding: 10,
    backgroundColor: 'lightgrey',
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
    justifyContent: 'space-around',
  },
  buttonContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
  },
});
