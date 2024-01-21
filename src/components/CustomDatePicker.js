import React, {useState} from 'react';
import {View, Text, StyleSheet, TextInput, Pressable} from 'react-native';
import DatePicker from 'react-native-date-picker';
import dayjs from 'dayjs';
import {useTheme} from '@react-navigation/native';

const CustomDatePicker = ({onDateChange, title, pickedDate}) => {
  const {colors} = useTheme();
  const [selectedDate, setSelectedDate] = useState(pickedDate);
  const [isDatePickerVisible, setIsDatePickerVisible] = useState(false);

  const handleDateChange = date => {
    setSelectedDate(date);
    const formattedDate = dayjs(date).format('YYYY-MM-DD');
    onDateChange(formattedDate);
  };

  return (
    <View style={styles.container}>
      <View style={styles.leftSection}>
        <Text style={styles.label}>{title}</Text>
      </View>
      <Pressable
        style={styles.rightSection}
        onPress={() => setIsDatePickerVisible(true)}>
        <Text style={[styles.dateInput, {color: colors.text}]}>
          {dayjs(selectedDate).format('DD-MM-YYYY')}
        </Text>
      </Pressable>
      <DatePicker
        modal
        open={isDatePickerVisible}
        onCancel={() => setIsDatePickerVisible(false)}
        date={selectedDate}
        maximumDate={new Date()}
        mode="date"
        placeholder="Select Date"
        format="DD-MM-YYYY"
        confirmBtnText="Confirm"
        cancelBtnText="Cancel"
        customStyles={{
          dateInput: styles.dateInput,
        }}
        onConfirm={date => {
          setIsDatePickerVisible(false);
          handleDateChange(date);
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderWidth: 1,
    borderRadius: 5,
    borderColor: 'lightblue',
  },
  leftSection: {
    backgroundColor: 'lightblue',
    paddingHorizontal: 10,
    justifyContent: 'center',
  },
  rightSection: {
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  dateInput: {
    borderWidth: 0,
    fontWeight: 'bold',
  },
});

export default CustomDatePicker;
