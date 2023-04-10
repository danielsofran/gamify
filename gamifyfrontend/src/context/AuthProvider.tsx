import { createContext, useState } from "react";
import React from "react";
import {CEO, Employee} from "../data/User";

const AuthContext = createContext({});

export const AuthProvider:React.FC<{children: React.ReactNode }> = ({ children }) => {
    const [auth, setAuth] = useState({})
    return (
        <AuthContext.Provider value={{ auth, setAuth }}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthContext;