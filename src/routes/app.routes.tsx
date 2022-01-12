import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { Dashboard } from '../pages/Dashboard';
import { CreateDate } from '../pages/CreateDate';

export type AppStackParamList = {
  Dashboard: undefined;
  CreateDate: undefined;
};

const Stack = createNativeStackNavigator<AppStackParamList>();

export const AppRoutes = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: 'transparent' },
      }}>
      <Stack.Screen name="Dashboard" component={Dashboard} />
      <Stack.Screen name="CreateDate" component={CreateDate} />
    </Stack.Navigator>
  );
};
