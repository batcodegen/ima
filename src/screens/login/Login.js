import React, {useState, useEffect} from 'react';
import {
  Text,
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import {useSigninUser} from '../../hooks/useLoginUser';
import {useSelector} from 'react-redux';

const LoginScreen = ({navigation}) => {
  const [touchstatus, setTouchStatus] = useState({
    touchedEmail: false,
    touchedPassword: false,
  });
  const [state, setState] = useState({
    emailId: '',
    password: '',
    userData: {fname: '', lastName: ''},
  });
  const [errors, setErrors] = useState({});
  const {signInUser} = useSigninUser();

  useEffect(() => {
    const errorObj = {};
    // Validate email if touched
    if (touchstatus.touchedEmail) {
      if (state.emailId.trim() === '') {
        errorObj.email = 'Email is required';
      } else if (!isValidEmail(state.emailId)) {
        errorObj.email = 'Invalid email';
      } else {
        errorObj.email = '';
      }
    }

    // Validate password if touched
    if (touchstatus.touchedPassword) {
      if (state.password.trim() === '') {
        errorObj.password = 'Password is required';
      } else if (state.password.length < 6) {
        errorObj.password = 'Password must be at least 6 characters';
      } else {
        errorObj.password = '';
      }
    }
    setErrors(errorObj);
  }, [
    state.emailId,
    state.password,
    touchstatus.touchedEmail,
    touchstatus.touchedPassword,
  ]);

  const isValidEmail = value => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value);
  };

  const isSubmitDisabled = () => {
    return (
      state.emailId.trim() === '' ||
      state.password.trim() === '' ||
      errors.email !== '' ||
      errors.password !== ''
    );
  };

  const onPressLogin = async (email, password) => {
    await signInUser({email, password});
  };

  const handleOnChange = (text, input) => {
    setState(prevState => ({...prevState, [input]: text}));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}> Login</Text>
      <Text style={styles.subTitle}> Welcome!</Text>
      <View style={styles.inputView}>
        <TextInput
          style={styles.inputText}
          placeholder="Email"
          value={state.emailId}
          placeholderTextColor="#A9A9A9"
          onChangeText={text => {
            handleOnChange(text, 'emailId');
          }}
          onBlur={() =>
            setTouchStatus(prevState => ({...prevState, touchedEmail: true}))
          }
        />
      </View>
      {touchstatus.touchedEmail && errors.email !== '' && (
        <Text style={styles.error}>{errors.email}</Text>
      )}

      <View style={styles.inputView}>
        <TextInput
          style={styles.inputText}
          secureTextEntry
          value={state.password}
          placeholder="Password"
          placeholderTextColor="#A9A9A9"
          onChangeText={text => {
            handleOnChange(text, 'password');
          }}
          onFocus={() =>
            setTouchStatus(prevState => ({...prevState, touchedPassword: true}))
          }
        />
      </View>
      {touchstatus.touchedPassword && errors.password !== '' && (
        <Text style={styles.error}>{errors.password}</Text>
      )}
      <TouchableOpacity
        onPress={() => onPressLogin(state.emailId, state.password)}
        disabled={isSubmitDisabled()}
        style={
          isSubmitDisabled()
            ? [styles.loginBtn, {backgroundColor: 'lightgray'}]
            : styles.loginBtn
        }>
        <Text style={styles.loginText}>LOGIN </Text>
      </TouchableOpacity>
      {/* Display error messages */}
    </View>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  subTitle: {
    fontSize: 15,
    color: '#6495ED',
    marginBottom: 40,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 30,
    color: '#6495ED',
    marginBottom: 20,
  },
  inputView: {
    width: '80%',
    backgroundColor: '#F5F5F5',
    borderRadius: 25,
    height: 50,
    marginBottom: 20,
    justifyContent: 'center',
    padding: 20,
  },
  inputText: {
    height: 50,
    color: 'black',
  },
  forgotAndSignUpText: {
    color: 'white',
    fontSize: 11,
  },
  loginBtn: {
    width: '80%',
    backgroundColor: '#6495ED',
    borderRadius: 25,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 40,
    marginBottom: 10,
  },
  loginText: {
    color: 'white',
  },
  error: {
    color: 'red',
    fontSize: 14,
    marginBottom: 12,
  },
});
