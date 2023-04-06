import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useAuth } from "../../context/AuthContext";
import { NavigationContainer } from '@react-navigation/native';
import { Button } from 'react-native';
import Login from '../Login';
import NavigationTab from "./NavigationTab";


const Stack = createNativeStackNavigator();

export const StackNav = () => {
  const { authState, onLogout } = useAuth();

  return (
    <NavigationContainer>

      <Stack.Navigator screenOptions={{
        headerShown: false,
      }}>
        {authState?.authenticated ?
          <Stack.Screen name="NavigationTab" component={NavigationTab} options={{
            headerRight: () => <Button onPress={onLogout} title='Sign Out' />
          }}></Stack.Screen>
          :
          <Stack.Screen name="Login" component={Login}></Stack.Screen>
        }


      </Stack.Navigator>
    </NavigationContainer>
  )
}

export default StackNav;
