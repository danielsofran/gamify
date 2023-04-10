import React from 'react';
import {Navigate, Route, Routes} from "react-router-dom";
import Layout from "./context/Layout";
import Unauthorized from "./pages/auth/Unauthorized";
import RequireAuth from "./context/RequireAtuh";
import {RequestType, UserType} from "./data/enums";
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
import {Reward} from "./pages/quests/Reward";
import {Requests} from "./pages/shop/Requests";
import {AddSalaryIncreaseRequest} from "./pages/shop/AddSalaryIncreaseRequest";
import {AddFreeDaysRequest} from "./pages/shop/AddFreeDaysRequest";
import {AddCareerDevelopmentRequest} from "./pages/shop/AddCareerDevelopmentRequest";

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

            <Route path='employee/requests/salary-increase/' element={<Requests own={true} type={RequestType.SALARY_INCREASE}/>} />
            <Route path='employee/requests/free-days/' element={<Requests own={true} type={RequestType.FREE_DAYS}/>} />
            <Route path='employee/requests/career-development/' element={<Requests own={true} type={RequestType.CAREER_DEVELOPMENT}/>} />

            <Route path='employee/shop/salary-increase/' element={<AddSalaryIncreaseRequest />} />
            <Route path='employee/shop/free-days/' element={<AddFreeDaysRequest />} />
            <Route path='employee/shop/career-development/' element={<AddCareerDevelopmentRequest />} />
          </Route>

          {/*ceo routes*/}
          <Route element={<RequireAuth allowedRoles={[UserType.CEO]} />}>
            <Route path='ceo/' element={<Navigate to='/ceo/register_requests/'/>}/>
            <Route path='ceo/register_requests/' element={<RegisterRequests />} />
            <Route path='ceo/register_requests/view/:id/' element={<ViewRegisterRequest />} />
            <Route path='ceo/quests/' element={<Quests editable={true} />} />
            <Route path='ceo/quests/:questId/winners/' element={<QuestWinners rewardable={true} />} />
            <Route path='ceo/leaderboard/' element={<Leaderboard rewardable={true} />}/>
            <Route path='/reward/:id/' element={<Reward />} />

            <Route path='ceo/requests/salary-increase/' element={<Requests own={false} type={RequestType.SALARY_INCREASE}/>} />
            <Route path='ceo/requests/free-days/' element={<Requests own={false} type={RequestType.FREE_DAYS}/>} />
            <Route path='ceo/requests/career-development/' element={<Requests own={false} type={RequestType.CAREER_DEVELOPMENT}/>} />
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
