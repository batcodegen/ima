import {GestureHandlerRootView} from 'react-native-gesture-handler';
import React from 'react';
import {SafeAreaView, StyleSheet} from 'react-native';
import AppNavigator from './src/navigator/AppNavigator';
import {Provider} from 'react-redux';
import {peristor, store} from './src/redux/store';
import {PersistGate} from 'redux-persist/integration/react';
// import './src/api/mockresp';

function App(): React.JSX.Element {
  return (
    <GestureHandlerRootView style={styles.container}>
      <Provider store={store}>
        <PersistGate loading={null} persistor={peristor}>
          <SafeAreaView style={styles.safearea}>
            <AppNavigator />
          </SafeAreaView>
        </PersistGate>
      </Provider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1},
  safearea: {flex: 1},
});

export default App;
