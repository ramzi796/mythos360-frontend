import { jwtDecode } from "jwt-decode";

export const checkTokenExpiryAndLogout = () => {
  const token = localStorage.getItem("token");
  if (!token) return;

  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const decoded: any = jwtDecode(token);
    if (decoded.exp * 1000 < Date.now()) {
      localStorage.clear();
      window.location.href = "/";
    }
  } catch {
    localStorage.clear();
    window.location.href = "/";
  }
};
