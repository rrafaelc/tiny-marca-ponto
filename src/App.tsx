import React, { useMemo } from 'react';
import { StatusBar, Dimensions } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import Toast from 'react-native-toast-message';

import { AppProvider } from './context';
import { Routes } from './routes';

import { Container, Circle } from './styles';

const screen = Dimensions.get('screen');

const App = () => {
  const height = useMemo(() => screen.height / 4, []);

  return (
    <NavigationContainer>
      <AppProvider>
        <StatusBar barStyle="light-content" backgroundColor="#000" />
        <Container>
          <Circle right={-100} top={-80} />
          <Circle top={height} left={-100} />
          <Routes />
        </Container>
        <Toast visibilityTime={3000} topOffset={15} />
      </AppProvider>
    </NavigationContainer>
  );
};

export default App;
