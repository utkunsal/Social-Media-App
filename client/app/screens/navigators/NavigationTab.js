import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Home from '../Home';
import Share from '../Share';
import ProfileNav from './ProfileNav';
import SearchUser from '../SearchUser';
import { Icon } from 'react-native-elements';


const Tab = createBottomTabNavigator();

const NavigationTab = () => {
  return (
    <Tab.Navigator
      initialRouteName='ProfileNav'
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          position: 'absolute',
          height: 90,
          backgroundColor: '#202020',
        },
        tabBarActiveTintColor: '#AD4D4D',
        tabBarInactiveTintColor: '#858585',
      }}>
      <Tab.Screen
        options={{
          tabBarLabel: "",
          tabBarIcon: ({ color }) => (
            <Icon name="home" color={color} size={30} />
          )
        }}
        name="Home" component={Home} />
      <Tab.Screen
        options={{
          tabBarLabel: "",
          tabBarIcon: ({ color }) => (
            <Icon name="search" color={color} size={30} />
          )
        }}
        name="Search" component={SearchUser} />
      <Tab.Screen
        options={{
          tabBarLabel: "",
          tabBarIcon: ({ color }) => (
            <Icon name="add" color={color} size={30} />
          )
        }}
        name="Share" component={Share} />
      <Tab.Screen
        options={{
          tabBarLabel: "",
          tabBarIcon: ({ color }) => (
            <Icon name="person" color={color} size={30} />
          )
        }}
        name="ProfileNav" component={ProfileNav} />


    </Tab.Navigator>
  );
}



export default NavigationTab;