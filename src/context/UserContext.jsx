"use client";
import { API_PATH } from "@/utils/apiPaths";
import axiosInstance from "@/utils/axiosInstance";
import React, { createContext, useContext, useEffect, useState } from "react";

export const UserContext = createContext();

// Custom hook with build-time safety
export const useUser = () => {
    const context = useContext(UserContext);

    // Return default values during SSR/build
    if (typeof window === 'undefined') {
        return {
            user: null,
            loading: true,
            updateUser: () => { },
            clearUser: () => { }
        };
    }

    if (!context) {
        throw new Error('useUser must be used within a UserProvider');
    }

    return context;
};

const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        // Skip during SSR
        if (typeof window === 'undefined') {
            setLoading(false)
            return;
        }

        if (user) return;

        const accessToken = localStorage.getItem("token")
        if (!accessToken) {
            setLoading(false)
            return;
        }

        const fetchUser = async () => {
            try {
                const response = await axiosInstance.get(API_PATH.AUTH.GET_PROFILE)
                setUser(response.data)
            } catch (error) {
                console.error("User not authenticated", error)
                clearUser()
            } finally {
                setLoading(false)
            }
        };

        fetchUser()
    }, []);

    const updateUser = (userData) => {
        setUser(userData)
        if (userData?.token) {
            localStorage.setItem("token", userData.token)
        }
        setLoading(false)
    }

    const clearUser = () => {
        setUser(null)
        localStorage.removeItem('token')
    }

    return (
        <UserContext.Provider value={{ user, loading, updateUser, clearUser }}>
            {children}
        </UserContext.Provider>
    )
}

export default UserProvider;