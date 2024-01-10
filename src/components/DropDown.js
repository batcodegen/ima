import {StyleSheet, Text, View, useWindowDimensions} from 'react-native';
import React, {useEffect, useState} from 'react';
import {Dropdown} from 'react-native-element-dropdown';

const DropDownFile = ({
  data,
  labelField,
  valueField,
  onSelect,
  showSearch = true,
}) => {
  const [value, setValue] = useState('');
  const {width} = useWindowDimensions();
  useEffect(() => {
    if (data) {
      setValue(data?.[0]?.[labelField]);
    }
  }, [data]);

  const renderItem = item => {
    return (
      <View style={styles.item}>
        <Text style={styles.textItem}>{item[labelField]}</Text>
        {/* {item.value === value && (
              <AntDesign
                style={styles.icon}
                color="black"
                name="Safety"
                size={20}
              />
            )} */}
      </View>
    );
  };

  if (!data) {
    return null;
  }

  return (
    <Dropdown
      style={styles.dropdown}
      placeholderStyle={styles.placeholderStyle}
      selectedTextStyle={styles.selectedTextStyle}
      inputSearchStyle={styles.inputSearchStyle}
      keyboardAvoiding={false}
      iconStyle={styles.iconStyle}
      data={data}
      search={showSearch}
      maxHeight={300}
      mode="modal"
      showsVerticalScrollIndicator={false}
      labelField={labelField}
      valueField={valueField}
      placeholder="Select"
      searchPlaceholder="Search..."
      value={value}
      onChange={item => {
        setValue(item[labelField]);
        onSelect(item);
      }}
      containerStyle={{borderRadius: 10, width: width * 0.7}}
      itemContainerStyle={{borderRadius: 10}}
      // renderLeftIcon={() => (
      //   <AntDesign style={styles.icon} color="black" name="Safety" size={20} />
      // )}
      renderItem={renderItem}
    />
  );
};

export default DropDownFile;

const styles = StyleSheet.create({
  dropdown: {
    height: 30,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 12,
    shadowColor: '#000',
    elevation: 2,
  },
  icon: {
    marginRight: 5,
  },
  item: {
    padding: 17,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  textItem: {
    flex: 1,
    fontSize: 16,
    color: 'black',
  },
  placeholderStyle: {
    fontSize: 16,
    color: 'black',
  },
  selectedTextStyle: {
    fontSize: 16,
    color: 'black',
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
    color: 'black',
  },
});
