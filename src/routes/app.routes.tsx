import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { Dashboard } from '../pages/Dashboard';
import { CreateCustomDate } from '../pages/CreateCustomDate';
import { CreateCustomDateForThePast } from '../pages/CreateCustomDateForThePast';
import { EditHours } from '../pages/EditHours';

export type AppStackParamList = {
  Dashboard: undefined;
  CreateCustomDate: undefined;
  CreateCustomDateForThePast: { day: number; month: number; year: number };
  EditHours: { day_id: string };
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
      <Stack.Screen name="CreateCustomDate" component={CreateCustomDate} />
      <Stack.Screen
        name="CreateCustomDateForThePast"
        component={CreateCustomDateForThePast}
      />
      <Stack.Screen name="EditHours" component={EditHours} />
    </Stack.Navigator>
  );
};
