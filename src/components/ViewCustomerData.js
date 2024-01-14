import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {BottomSheetScrollView} from '@gorhom/bottom-sheet';
import TableView from './TableView';
import {formatToLocalRupee} from '../helpers/utils';

const ViewCustomerData = ({data}) => {
  return (
    <View style={styles.container}>
      <BottomSheetScrollView>
        <TableView
          title={'Business name'}
          value={data?.business_name}
          viewableText
        />
        <TableView title={'Code'} value={data?.code} viewableText />
        <TableView
          title={'Billing address'}
          value={data?.billing_address}
          viewableText
        />
        <TableView
          title={'Delivery address'}
          value={data?.delivery_address}
          viewableText
        />
        <TableView
          title={'Security deposit'}
          value={formatToLocalRupee(data?.security_deposit)}
          viewableText
        />
        <TableView
          title={'Pending payment'}
          value={formatToLocalRupee(data?.pending_payment)}
          viewableText
        />
        <TableView
          title={'Contact person'}
          value={data?.contact_person}
          viewableText
        />
        <TableView
          title={'Phone number'}
          value={data?.phone_number}
          viewableText
        />
        <TableView
          title={'Email'}
          value={data?.email === '' ? '-' : data?.email}
          viewableText
        />
        <TableView title={'GST number'} value={data?.gst_number} viewableText />
      </BottomSheetScrollView>
    </View>
  );
};

export default ViewCustomerData;

const styles = StyleSheet.create({
  container: {flex: 1, paddingHorizontal: 20, paddingTop: 20},
});
