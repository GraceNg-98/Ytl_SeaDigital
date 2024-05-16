import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../screens/LoginScreen';
import DashboardScreen from '../screens/DashboardScreen';
import TransactionDetailScreen from '../screens/TransactionDetailScreen';
import { IUser } from '../types';
import { grey } from '@mui/material/colors';

export type RootStackParamList = {
  Login: undefined;
  Dashboard: {
    user: IUser | {},
    isBiometricLogin: boolean
  };
  Detail: {
    details: {}
  };
}

const Stack = createNativeStackNavigator<RootStackParamList>();

const Routes = () => {
  return (
    <NavigationContainer >
      <Stack.Navigator initialRouteName='Login'>
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false }} />
        <Stack.Screen
          name="Dashboard"
          component={DashboardScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Detail"
          component={TransactionDetailScreen}
          options={{
            headerStyle: {
              backgroundColor: grey[900],
            },
            headerTintColor: '#fff'
          }} />
      </Stack.Navigator>
    </NavigationContainer>
  )
};

export default Routes