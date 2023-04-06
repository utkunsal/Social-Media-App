import { View, Text, StyleSheet, TouchableOpacity, Alert, TextInput, SafeAreaView, StatusBar } from 'react-native'
import React, { useState } from 'react'
import { useAuth } from '../context/AuthContext';

const Login = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const { onLogin, onRegister } = useAuth();

    const login = async () => {
        try {
            const result = await onLogin(username, password);

            if (result && result.error) {
                Alert.alert(result.message, '')
            }
        } catch (err) {
            return { message: err.message };
        }
    }

    const register = async () => {
        try {
            const result = await onRegister(username, password);

            if (result && result.error) {
                Alert.alert(result.message, '')
            } else {
                login();
            }
        } catch (err) {
            return { message: err.message };
        }
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.form}>
                <TextInput style={styles.input}
                    placeholder='username'
                    placeholderTextColor="#757575"
                    onChangeText={text => setUsername(text)}
                    autoCapitalize='none'
                />
                <TextInput style={styles.input}
                    placeholder='password'
                    placeholderTextColor="#757575"
                    secureTextEntry={true}
                    onChangeText={text => setPassword(text)}
                    autoCapitalize='none'
                />

                <TouchableOpacity onPress={login} style={styles.button}>
                    <Text style={{ color: "#E5E5E5", fontSize: 17 }}>Log In</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={register} style={styles.button}>
                    <Text style={{ color: "#E5E5E5", fontSize: 17 }}>Register</Text>
                </TouchableOpacity>

            </View>
            <StatusBar
                barStyle={'light-content'}
            />


        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 21,
        backgroundColor: '#181818',
        justifyContent: "center",

    },
    form: {
        flex: 1,
        padding: 50,
        marginVertical: 70,

    },
    input: {
        padding: 15,
        marginTop: 16,
        paddingVertical: 5,
        borderWidth: 1,
        borderColor: '#20232a',
        borderRadius: 1,
        backgroundColor: '#292929',
        color: '#20232a',
        fontSize: 17,
        color: '#D1D1D1',
    },
    button: {
        alignSelf: "center",
        alignItems: "center",
        backgroundColor: "#181818",
        padding: 6,
        marginTop: 20,
        width: 170,
        borderWidth: 1,
        borderColor: "#505050",
        borderRadius: 30

    },
});


export default Login;