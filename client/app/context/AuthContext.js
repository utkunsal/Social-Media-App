import React, { createContext, useContext, useEffect, useState } from 'react';
import * as SecureStore from "expo-secure-store";
import client from '../../api/client';

const AuthContext = createContext();
const TOKEN_KEY = "token-key";

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [authState, setAuthState] = useState({
        token: null,
        authenticated: false,
    });

    useEffect(() => {
        const load = async () => {
            const token = await SecureStore.getItemAsync(TOKEN_KEY);

            if (token) {
                client.defaults.headers.common["Authorization"] = `Bearer ${token}`;
                setAuthState({
                    token: token,
                    authenticated: true,
                })
            }
        }
        load();
    }, [])

    const register = async (username, password) => {
        try {
            return await client.post("/auth/register", { username, password });
        } catch (err) {
            return { error: true, message: err.response.data };
        }
    }

    const login = async (username, password) => {
        try {
            const result = await client.post("/auth/login", { username, password })

            setAuthState({
                token: result.data.token,
                authenticated: true,
            })


            client.defaults.headers.common["Authorization"] = `Bearer ${result.data.token}`;

            await SecureStore.setItemAsync(TOKEN_KEY, result.data.token);

            return result;
        } catch (err) {
            return { error: true, message: err.response.data };
        }
    }

    const logout = async () => {
        await SecureStore.deleteItemAsync(TOKEN_KEY);

        client.defaults.headers.common["Authorization"] = "";

        setAuthState({
            token: null,
            authenticated: false,
        })

    }

    return (
        <AuthContext.Provider value={{
            authState,
            onRegister: register,
            onLogin: login,
            onLogout: logout,
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;

