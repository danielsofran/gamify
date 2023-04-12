import { Outlet } from "react-router-dom"
import {UserType} from "../model/enums";
import {useEffect, useState} from "react";
import {axiosJson} from "../api/axios";
import {EmployeeNavbar} from "../components/EmployeeNavbar";
import {CeoNavbar} from "../components/CeoNavbar";
import '../App.scss'

const Layout = () => {
    const [userType, setUserType] = useState<UserType>(UserType.Guest);

    useEffect(() => {
        axiosJson.get('auth2/user/').then((response) => {
            if(response.data.employee !== null) setUserType(UserType.Employee);
            else setUserType(UserType.CEO);
        }).catch((error) => {
            setUserType(UserType.Guest);
        });
    }, []);

    return (
        <>
            {userType === UserType.Guest && <></>}
            {userType === UserType.Employee && <EmployeeNavbar />}
            {userType === UserType.CEO && <CeoNavbar />}
            <main className="App">
                <Outlet />
            </main>
        </>
    )
}

export default Layout