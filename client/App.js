import { Button, StyleSheet, Text, View } from 'react-native';
import { AuthProvider } from "./app/context/AuthContext"
import StackNav from './app/screens/navigators/StackNav';

export default function App() {
  return (
    <AuthProvider>
      <StackNav>

      </StackNav>
    </AuthProvider>
  );
}
