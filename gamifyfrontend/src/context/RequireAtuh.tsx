import { useLocation, Navigate, Outlet } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import React, {useEffect, useState} from "react";
import {axiosGet} from "../api/axios";
import {deserializeUser} from "../data/User";

const RequireAuth = ({ allowedRoles }) => {
    // const { auth, setAuth } = useAuth();
    const location = useLocation();
    const [user, setUser] = useState(null);

    useEffect(() => {
        axiosGet.get('auth2/user/').then((response) => {
            let userJson = deserializeUser(response.data);
            console.warn("Deserialized user: ", userJson)
            setUser(userJson);
            console.info("User: ", user)
            //setAuth({user, roles: [user.type]})
        }).catch((error) => {
            console.log("RequireAuth axios error:\n"+error);
        });
    }, [])

    return (
        // auth?.roles?.find(role => allowedRoles?.includes(role))
        allowedRoles.includes(user?.type)
            ? <Outlet />
            : user === null
                ? <Navigate to="/unauthorized" state={{ from: location }} replace />
                : <Navigate to="/login" state={{ from: location }} replace />
    );
}

export default RequireAuth;