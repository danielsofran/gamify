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
import {Quests} from "./pages/quests/Quests";
import {AttendQuest} from "./pages/quests/AttendQuest";
import {QuestWinners} from "./pages/quests/QuestWinners";
import {Profile} from "./pages/auth/Profile";
import {Leaderboard} from "./pages/quests/Leaderboard";

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
            <Route path='employee/quests/' element={<Quests editable={false} />} />
            <Route path='employee/quests/:questId/attend/' element={<AttendQuest />} />
            <Route path='employee/quests/:questId/winners/' element={<QuestWinners rewardable={false} />} />
            <Route path='employee/leaderboard/' element={<Leaderboard rewardable={false} />}/>
          </Route>

          {/*ceo routes*/}
          <Route element={<RequireAuth allowedRoles={[UserType.CEO]} />}>
            <Route path='ceo/' element={<Navigate to='/ceo/register_requests/'/>}/>
            <Route path='ceo/register_requests/' element={<RegisterRequests />} />
            <Route path='ceo/register_requests/view/:id/' element={<ViewRegisterRequest />} />
            <Route path='ceo/quests/' element={<Quests editable={true} />} />
            <Route path='ceo/quests/:questId/winners/' element={<QuestWinners rewardable={true} />} />
            <Route path='ceo/leaderboard/' element={<Leaderboard rewardable={true} />}/>
          </Route>

          {/*common routes*/}
          <Route element={<RequireAuth allowedRoles={[UserType.CEO, UserType.Employee]} />}>
            <Route path='logout/' action={() => logout()}/>
            <Route path='add_quest/' element={<AddQuest />}/>
            <Route path='profile/' element={<Profile />}/>
          </Route>
        </Route>
      </Routes>
  );
}

export default App;
