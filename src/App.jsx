
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import AuthGuard from './components/AuthGuard';
import GuestGuard from './components/GuestGuard';
import PublicLayout from './layouts/PublicLayout';
import AdminLayout from './layouts/AdminLayout';

import Home from './pages/Home';
import FindDoctors from './pages/FindDoctors';
import PublicDoctorProfile from './pages/PublicDoctorProfile';
import Hospitals from './pages/Hospitals';
import SignIn from './pages/SignIn';
import Dashboard from './pages/admin/Dashboard';
import HospitalList from './pages/admin/hospitals/HospitalList';
import HospitalEdit from './pages/admin/hospitals/HospitalEdit';

// Hospital View Imports
import HospitalViewLayout from './pages/admin/hospitals/view/HospitalViewLayout';
import DashboardTab from './pages/admin/hospitals/view/DashboardTab';
import ContractsTab from './pages/admin/hospitals/view/ContractsTab';
import PatientsTab from './pages/admin/hospitals/view/PatientsTab';
import DepartmentsTab from './pages/admin/hospitals/view/DepartmentsTab';
import DoctorsTab from './pages/admin/hospitals/view/DoctorsTab';

// Patient View Imports
import PatientLayout from './layouts/PatientLayout';
import PatientDashboard from './pages/patient/Dashboard';
import PatientRegistration from './pages/patient/Registration';

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes protected by GuestGuard (redirects logged in users to admin) */}
          <Route element={<GuestGuard />}>
            <Route path="/" element={<PublicLayout />}>
              <Route index element={<Home />} />
              <Route path="find-doctors" element={<FindDoctors />} />
              <Route path="find-doctors/:id" element={<PublicDoctorProfile />} />
              <Route path="hospitals" element={<Hospitals />} />
            </Route>
            {/* Auth Route without Navbar/Footer */}
            <Route path="/signin" element={<Navigate to="/signin/patient" replace />} />
            <Route path="/signin/:roleParam" element={<SignIn />} />
          </Route>

          {/* Admin Routes protected by AuthGuard (redirects guests to signin) */}
          <Route path="/admin" element={<AuthGuard />}>
            <Route element={<AdminLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="hospitals" element={<HospitalList />} />
              <Route path="hospitals/add" element={<HospitalEdit />} />
              <Route path="hospitals/edit/:id" element={<HospitalEdit />} />
              
              {/* Nested Hospital View Routes */}
              <Route path="hospitals/:id" element={<HospitalViewLayout />}>
                <Route index element={<Navigate to="dashboard" replace />} />
                <Route path="dashboard" element={<DashboardTab />} />
                <Route path="contracts" element={<ContractsTab />} />
                <Route path="patients" element={<PatientsTab />} />
                <Route path="departments" element={<DepartmentsTab />} />
                <Route path="doctors" element={<DoctorsTab />} />
              </Route>
            </Route>
          </Route>

          {/* Patient Routes protected by AuthGuard */}
          <Route path="/patient" element={<AuthGuard />}>
            <Route element={<PatientLayout />}>
              <Route index element={<PatientDashboard />} />
              <Route path=":patientId/dashboard" element={<PatientDashboard />} />
              <Route path="registration/*" element={<PatientRegistration />} />
              <Route path="second_opinion/*" element={<PatientRegistration />} />
              <Route path="second_openion/*" element={<PatientRegistration />} />
            </Route>
          </Route>

          {/* Fallback */}
          <Route path="*" element={<PublicLayout><Home /></PublicLayout>} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}
