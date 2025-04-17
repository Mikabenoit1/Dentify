import React from 'react';
import { AppRegistry } from 'react-native';
import { AppProvider } from './utils/AppContext';
import Navigation from './navigation';

const App = () => {
  return (
    <AppProvider>
      <Navigation />
    </AppProvider>
  );
};

AppRegistry.registerComponent('Dentify', () => App);

export default App;