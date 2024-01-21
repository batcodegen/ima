import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {BarChart, PieChart} from 'react-native-gifted-charts';
import {useTheme} from '@react-navigation/native';

const renderDot = color => {
  return (
    <View
      style={[
        styles.dot,
        {
          backgroundColor: color,
        },
      ]}
    />
  );
};

const StockChart = ({data}) => {
  const {colors} = useTheme();

  const pieData = [
    {
      value: data.filled,
      color: '#177AD5',
      label: 'Filled',
      gradientCenterColor: '#79D2DE', // Gradient for Sales
    },
    {
      value: data.empty,
      color: '#79D2DE',
      label: 'Empty',
      gradientCenterColor: '#177AD5', // Gradient for Purchases
    },
    {
      value: data.total,
      color: '#ED6665',
      label: 'Total Products',
      focused: true,
      gradientCenterColor: '#177AD5', // Gradient for Expenses
    },
    {
      value: data.customerFilled,
      color: '#BDB2FA',
      gradientCenterColor: '#8F80F3',
      label: 'Total Customer Filled',
    },
  ];

  const renderLegendComponent = () => {
    return (
      <View style={styles.topLegendContainer}>
        <View style={styles.legendContainer}>
          {renderDot('#177AD5')}
          <Text style={{color: colors.text}}>{`Filled: ${data.filled}`}</Text>
        </View>
        <View style={[styles.legendContainer, {marginVertical: 10}]}>
          {renderDot('#79D2DE')}
          <Text style={{color: colors.text}}>{`Empty: ${data.empty}`}</Text>
        </View>
        <View style={styles.legendContainer}>
          {renderDot('#ED6665')}
          <Text
            style={{
              color: colors.text,
            }}>{`Total Products: ${data.total}`}</Text>
        </View>
        <View style={[styles.legendContainer, {marginVertical: 10}]}>
          {renderDot('#8F80F3')}
          <Text
            style={{
              color: colors.text,
            }}>{`Total Customers: ${data.customerFilled}`}</Text>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.chartContainer}>
      <PieChart
        data={pieData}
        donut
        focusOnPress
        showGradient
        sectionAutoFocus
        radius={80}
        innerRadius={50}
      />
      {renderLegendComponent()}
    </View>
  );
};

export default StockChart;

const styles = StyleSheet.create({
  dot: {height: 10, width: 10, borderRadius: 5, marginRight: 10},
  topLegendContainer: {justifyContent: 'center'},
  legendContainer: {flexDirection: 'row', alignItems: 'center'},
  centerContainer: {justifyContent: 'center', alignItems: 'center'},
  centerTextVal: {fontSize: 18, color: 'black', fontWeight: 'bold'},
  centerText: {fontSize: 14},
  chartContainer: {flexDirection: 'row'},
});
