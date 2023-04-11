import {Navigate, Outlet, useLocation} from "react-router-dom";
// import useAuth from "../hooks/useAuth";
import React, {useEffect, useState} from "react";
import {axiosJson} from "../api/axios";
import {CEO, deserializeUser, Employee} from "../data/User";
import {UserType} from "../data/enums";

const RequireAuth:React.FC<{allowedRoles: UserType[]}> = ({ allowedRoles }) => {
    // const { auth, setAuth } = useAuth();
    const location = useLocation();
    const [user, setUser] = useState<Employee | CEO | null>(null);
    const [type, setType] = useState<UserType>(UserType.Guest);

    useEffect(() => {
        axiosJson.get('auth2/user/').then((response) => {
            let userJson = deserializeUser(response.data);
            console.warn("Deserialized user: ", userJson)
            setUser(userJson);
            if(userJson instanceof Employee)
                setType(UserType.Employee);
            else if(userJson instanceof CEO)
                setType(UserType.CEO);
            else
                setType(UserType.Guest);
            //setAuth({user, roles: [user.type]})
        }).catch((error) => {
            setUser(null);
            setType(UserType.Guest);
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
        // <>
        //     {allowedRoles.includes(type) ?
        //         <Outlet /> :
        //         user === null || user === undefined ?
        //             <Navigate to="/unauthorized" state={{ from: location }} replace /> :
        //             <Navigate to="/login" state={{ from: location }} replace />
        //     }
        // </>
    )
}

export default RequireAuth;