import React from 'react';
import { Text } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { AppStackParamList } from '../../routes/app.routes';
type Props = NativeStackScreenProps<AppStackParamList, 'CreateDate'>;

export const CreateDate: React.FC<Props> = ({ navigation }) => {
  return <Text>Create Date</Text>;
};
