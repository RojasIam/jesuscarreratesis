import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { View, ActivityIndicator } from 'react-native';
import { AuthProvider, useAuth } from './src/context/AuthContext';
import { ThemeProvider } from './src/context/ThemeContext';
import LoginScreen from './src/screens/LoginScreen';
import DashboardHomeScreen from './src/screens/DashboardHomeScreen';
import FormularioMedicionScreen from './src/screens/FormularioMedicionScreen';
import FormulasScreen from './src/screens/FormulasScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Stack = createNativeStackNavigator();

function AppNavigator() {
  const { isAuthenticated } = useAuth();
  const navigationRef = React.useRef<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    AsyncStorage.getItem('isAuthenticated').then(() => {
      setIsLoading(false);
    });
  }, []);

  useEffect(() => {
    setIsLoading(false);
    if (navigationRef.current) {
      if (isAuthenticated) {
        navigationRef.current.reset({
          index: 0,
          routes: [{ name: 'DashboardHome' }],
        });
      } else {
        navigationRef.current.reset({
          index: 0,
          routes: [{ name: 'Login' }],
        });
      }
    }
  }, [isAuthenticated]);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }

  return (
    <NavigationContainer ref={navigationRef}>
      <Stack.Navigator 
        screenOptions={{ headerShown: false }}
        initialRouteName={isAuthenticated ? "DashboardHome" : "Login"}
      >
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="DashboardHome" component={DashboardHomeScreen} />
        <Stack.Screen name="FormularioMedicion" component={FormularioMedicionScreen} />
        <Stack.Screen name="Formulas" component={FormulasScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

function App() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <AuthProvider>
          <AppNavigator />
        </AuthProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}

export default App;
