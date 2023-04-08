import { useLocation, Navigate, Outlet } from "react-router-dom";
// import useAuth from "../hooks/useAuth";
import React, {useEffect, useState} from "react";
import {axiosJson} from "../api/axios";
import {CEO, deserializeUser, Employee} from "../data/User";
import {UserType} from "../data/enums";

const RequireAuth:React.FC<{allowedRoles: UserType[]}> = ({ allowedRoles }) => {
    // const { auth, setAuth } = useAuth();
    const location = useLocation();
    let [user, setUser] = useState<Employee | CEO | null>(null);

    useEffect(() => {
        axiosJson.get('auth2/user/').then((response) => {
            let userJson = deserializeUser(response.data);
            // console.warn("Deserialized user: ", userJson)
            setUser(userJson);
            console.info("User: ", user)
            //setAuth({user, roles: [user.type]})
        }).catch((error) => {
            console.log("RequireAuth axios error:\n"+error);
        });
    }, [])

    return (
        // auth?.roles?.find(role => allowedRoles?.includes(role))
        <Outlet />
        // user !== undefined && user !== null && allowedRoles.includes(user.type)
        //     ? <Outlet />
        //     : user === null || user === undefined
        //         ? <Navigate to="/unauthorized" state={{ from: location }} replace />
        //         : <Navigate to="/login" state={{ from: location }} replace />
    );
}

export default RequireAuth;