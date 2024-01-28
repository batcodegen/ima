import React, {forwardRef, useImperativeHandle, useRef} from 'react';
import DropdownAlert, {DropdownAlertType} from 'react-native-dropdownalert';

const getAlertType = type => {
  switch (type) {
    case 'success':
      return DropdownAlertType.Success;
    case 'info':
      return DropdownAlertType.Info;
    default:
      return DropdownAlertType.Error;
  }
};

const BottomAlert = forwardRef((props, ref) => {
  let alert = useRef(_data => new Promise(res => res));
  useImperativeHandle(ref, () => ({
    showAlert(msg, title, alertType) {
      setTimeout(async () => {
        await alert.current({
          message: msg,
          type: getAlertType(alertType),
          title,
        });
      }, 10);
    },
  }));

  return (
    <DropdownAlert
      alert={func => (alert.current = func)}
      alertPosition="bottom"
      onDismissAutomatic={() => {
        if (props.onAlertDismiss) {
          props.onAlertDismiss();
        }
      }}
    />
  );
});

export default BottomAlert;
