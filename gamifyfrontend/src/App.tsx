import React from 'react';
import {Navigate, Route, Routes} from "react-router-dom";
import Layout from "./context/Layout";
import Unauthorized from "./pages/auth/Unauthorized";
import RequireAuth from "./context/RequireAtuh";
import {UserType} from "./data/enums";
import {LoginPage} from "./pages/auth/LoginPage";
import {RegisterPage} from "./pages/auth/RegisterPage";
import {logout} from "./api/utils";
import {RegisterRequests} from "./pages/auth/RegisterRequests";
import {ViewRegisterRequest} from "./pages/auth/ViewRegisterRequest";
import {AddQuest} from "./pages/quests/AddQuest";
import {CeoQuests} from "./pages/quests/CeoQuests";

function App() {
  return (
      <Routes>
        <Route path='/' element={<Layout/>}>
          {/*public routes*/}
          <Route path='/' element={<Navigate to='/login/'/>}/>
          <Route path='login/' element={<LoginPage />}/>
          <Route path='register/' element={<RegisterPage />}/>
          <Route path='unauthorized/' element={<Unauthorized />}/>

          {/*employee routes*/}
          <Route element={<RequireAuth allowedRoles={[UserType.Employee]} />}>
            <Route path='employee/' element={<Navigate to='/employee/quests/'/>}/>
            {/*<Route path='employee/quests/' element=''>*/}
          </Route>

          {/*ceo routes*/}
          <Route element={<RequireAuth allowedRoles={[UserType.CEO]} />}>
            <Route path='ceo/' element={<Navigate to='/ceo/register_requests/'/>}/>
            <Route path='ceo/register_requests/' element={<RegisterRequests />} />
            <Route path='ceo/register_requests/view/:id/' element={<ViewRegisterRequest />} />
            <Route path='ceo/quests/' element={<CeoQuests />} />
          </Route>

          {/*common routes*/}
          <Route element={<RequireAuth allowedRoles={[UserType.CEO, UserType.Employee]} />}>
            <Route path='logout/' action={() => logout()}/>
            <Route path='add_quest/' element={<AddQuest />}/>
          </Route>
        </Route>
      </Routes>
  );
}

export default App;
