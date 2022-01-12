import React, { useMemo } from 'react';
import { useColorScheme, Dimensions } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';

import { Dashboard } from './pages/Dashboard';

import { Container, Circle } from './styles';

const screen = Dimensions.get('screen');

const App = () => {
  // const isDarkMode = useColorScheme() === 'dark';

  const height = useMemo(() => screen.height / 3, []);

  return (
    <NavigationContainer>
      <Container>
        <Circle right={-100} top={-80} />
        <Circle top={height} left={-100} />
        <Dashboard />
      </Container>
    </NavigationContainer>
  );
};

export default App;
