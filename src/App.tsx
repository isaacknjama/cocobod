import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import SidebarWithHeader from './components/Dashboard';
import { ChangePassword, Login } from './components/Login';
import {
  ForgotPassword,
  ResetPassword,
  VerifyOtp,
} from './components/ForgotPassword';

import {
  CreateDistrictAdmin,
  CreateNewOwner,
  CreateRegionalAdmin,
  DashboardStatistics,
  DestinationUser,
  CreateState,
} from './components/index';

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Login />} />
        <Route path='/change-password' element={<ChangePassword />} />
        <Route path='/forgot-password' element={<ForgotPassword />} />
        <Route path='/verify-otp' element={<VerifyOtp />} />
        <Route path='/reset-password' element={<ResetPassword />} />
        <Route
          path='/dashboard'
          element={
            <SidebarWithHeader
              children={[<DashboardStatistics key='owner' />]}
            />
          }
        />
        <Route
          path='/dashboard/state'
          element={
            <SidebarWithHeader children={[<CreateState key='owner' />]} />
          }
        />
        <Route
          path='/dashboard/owner-admin'
          element={
            <SidebarWithHeader children={[<CreateNewOwner key='owner' />]} />
          }
        />
        <Route
          path='/dashboard/regional-admin'
          element={
            <SidebarWithHeader
              children={[<CreateRegionalAdmin key='owner' />]}
            />
          }
        />
        <Route
          path='/dashboard/district-admin'
          element={
            <SidebarWithHeader
              children={[<CreateDistrictAdmin key='owner' />]}
            />
          }
        />
        <Route
          path='/dashboard/destination-user'
          element={
            <SidebarWithHeader children={[<DestinationUser key='owner' />]} />
          }
        />
        <Route
          path='/dashboard/settings'
          element={<SidebarWithHeader children={[]} />}
        />
        <Route
          path='/dashboard/profile'
          element={<SidebarWithHeader children={[]} />}
        />
      </Routes>
    </Router>
  );
}

export default App;
