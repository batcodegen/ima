import {Alert} from 'react-native';
import strings from './strings.json';

function formatToLocalRupee(number) {
  if (!number) {
    return '₹ 0';
  }
  const locale = 'en-IN';

  if (number >= 100000) {
    const lakhs = number / 100000;
    const formatter = new Intl.NumberFormat(locale, {
      style: 'currency', // Format as decimal for lakhs
      minimumFractionDigits: 1, // Show at least one decimal place
      maximumFractionDigits: 2, // Limit to two decimal places,
      currency: 'INR',
    });
    return formatter.format(lakhs) + ' lakh';
  } else {
    const formatter = new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: 'INR',
    });
    return formatter.format(number);
  }
}

function formatRequiredFieldsMessage(response) {
  if (!response) {
    return strings.somethingwentwrong;
  }
  const requiredFields = Object.entries(response)
    .filter(([, messages]) => messages.length > 0)
    .map(([field, messages]) => `${field} - ${JSON.stringify(messages[0])}`);

  return requiredFields.join('\n');
}

function showConfirmAlert(title, message, handleAffermative) {
  Alert.alert(
    title,
    message,
    [
      {
        text: 'OK',
        onPress: handleAffermative,
      },
      {text: 'CANCEL', onPress: () => {}},
    ],
    {cancelable: false},
  );
}

export {formatToLocalRupee, formatRequiredFieldsMessage, showConfirmAlert};
