import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import ManagerDashboard from "./pages/ManagerDashboard";
import FacilitatorDashboard from "./pages/FacilitatorDashboard";
import EmployeeDashboard from "./pages/EmployeeDashboard";
import { useEffect } from "react";
import { checkTokenExpiryAndLogout } from "./utils/tokenExpiryCheck";
import Register from "./pages/Register";
import RoleProtectedRoute from "./components/RoleProtectedRoute";
import Unauthorized from "./pages/Unauthorized";

const AnimatedRoutes = () => {
  const location = useLocation();

  useEffect(() => {
    checkTokenExpiryAndLogout();
  }, []);

  return (
    
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/unauthorized" element={<Unauthorized />} />

        <Route
          path="/admin"
          element={
            <RoleProtectedRoute allowedRoles={["admin"]}>
              <AdminDashboard />
            </RoleProtectedRoute>
          }
        />
        <Route
          path="/manager"
          element={
            <RoleProtectedRoute allowedRoles={["manager", "admin"]}>
              <ManagerDashboard />
            </RoleProtectedRoute>
          }
        />
        <Route
          path="/facilitator"
          element={
            <RoleProtectedRoute allowedRoles={["facilitator", "admin"]}>
              <FacilitatorDashboard />
            </RoleProtectedRoute>
          }
        />
        <Route
          path="/employee"
          element={
            <RoleProtectedRoute allowedRoles={["employee", "manager", "admin"]}>
              <EmployeeDashboard />
            </RoleProtectedRoute>
          }
        />
      </Routes>
    </AnimatePresence>
  );
};

const App = () => (
  <Router>
    <AnimatedRoutes />
  </Router>
);

export default App;
