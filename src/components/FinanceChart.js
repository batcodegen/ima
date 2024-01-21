import {StyleSheet, Text, View} from 'react-native';
import React, {useCallback} from 'react';
import {PieChart} from 'react-native-gifted-charts';
import {formatToLocalRupee} from '../helpers/utils';
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

const FinanceChart = ({data}) => {
  const {colors} = useTheme();
  const pieData = [
    {
      value: Number(data.sales.sale) || 1,
      color: '#177AD5',
      label: 'Sales',
      gradientCenterColor: '#79D2DE', // Gradient for Sales
    },
    {
      value: Number(data.purchases.purchase) || 1,
      color: '#79D2DE',
      label: 'Purchases',
      gradientCenterColor: '#177AD5', // Gradient for Purchases
    },
    {
      value:
        Number(data.expenses.vehicleexpenses) +
          Number(data.expenses.salaries) +
          Number(data.expenses.otherexpenses) || 1,
      color: '#ED6665',
      label: 'Expenses',
      focused: true,
      gradientCenterColor: '#177AD5', // Gradient for Expenses
    },
  ];

  const renderLegendComponent = () => {
    return (
      <View style={styles.topLegendContainer}>
        <View style={styles.legendContainer}>
          {renderDot('#177AD5')}
          <Text style={{color: colors.text}}>{`Sale: ${formatToLocalRupee(
            data.sales.sale,
          )}`}</Text>
        </View>
        <View style={[styles.legendContainer, {marginVertical: 10}]}>
          {renderDot('#79D2DE')}
          <Text style={{color: colors.text}}>{`Purchase: ${formatToLocalRupee(
            data.purchases.purchase,
          )}`}</Text>
        </View>
        <View style={styles.legendContainer}>
          {renderDot('#ED6665')}
          <Text style={{color: colors.text}}>{`Expenses: ${formatToLocalRupee(
            Number(data.expenses.vehicleexpenses) +
              Number(data.expenses.salaries) +
              Number(data.expenses.otherexpenses),
          )}`}</Text>
        </View>
      </View>
    );
  };

  const getTotalAmount = () =>
    Number(data.sales.sale) +
    Number(data.purchases.purchase) +
    Number(data.expenses.vehicleexpenses) +
    Number(data.expenses.salaries) +
    Number(data.expenses.otherexpenses);

  const CenterComponent = useCallback(() => {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.centerTextVal}>
          {formatToLocalRupee(getTotalAmount())}
        </Text>
        <Text style={[styles.centerText, {color: colors.text}]}>Today</Text>
      </View>
    );
  }, []);

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
        centerLabelComponent={CenterComponent}
      />
      {renderLegendComponent()}
    </View>
  );
};

export default FinanceChart;

const styles = StyleSheet.create({
  dot: {height: 10, width: 10, borderRadius: 5, marginRight: 10},
  topLegendContainer: {justifyContent: 'center'},
  legendContainer: {flexDirection: 'row', alignItems: 'center'},
  centerContainer: {justifyContent: 'center', alignItems: 'center'},
  centerTextVal: {fontSize: 18, color: 'black', fontWeight: 'bold'},
  centerText: {fontSize: 14},
  chartContainer: {flexDirection: 'row'},
});
