import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { JSX } from "react";

type Props = {
  children: JSX.Element;
  allowedRoles: string[];
};

const RoleProtectedRoute = ({ children, allowedRoles }: Props) => {
  const token = localStorage.getItem("token");
  if (!token) return <Navigate to="/unauthorized" />;

  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const decoded: any = jwtDecode(token);
    const isExpired = decoded.exp * 1000 < Date.now();

    if (isExpired) {
      localStorage.clear();
      return <Navigate to="/unauthorized" />;
    }

    if (!allowedRoles.includes(decoded.role)) {
        return <Navigate to="/unauthorized" />;
    }

    return children;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (e) {
    localStorage.clear();
    return <Navigate to="/unauthorized" />;
  }
};

export default RoleProtectedRoute;
