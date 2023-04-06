import { createNativeStackNavigator } from "@react-navigation/native-stack";

import Profile from '../Profile';
import Follow from '../Follow';

const Stack = createNativeStackNavigator();

const ProfileOptions = () => {
  return (

    <Stack.Navigator screenOptions={{ headerShown: false }}  >

      <Stack.Screen name="Profile" component={Profile} initialParams={{ id: 0 }}></Stack.Screen>
      <Stack.Screen name="Follow" component={Follow}></Stack.Screen>


    </Stack.Navigator>
  );
}



export default ProfileOptions;