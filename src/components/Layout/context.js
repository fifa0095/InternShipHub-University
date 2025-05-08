"use client"

import { createContext, useState, useContext } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null)

    const SetUserContext = (val) => {
        console.log("log from auth provide", val)
        setUser(val)
    }

    const logout = () => {
        setUser(null)
    }

    return (
        <AuthContext.Provider value={{user, SetUserContext, logout}}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext)