import { ReactNode } from "react";
import LogoutButton from "./LogoutButton";

const Layout = ({ children }: { children: ReactNode }) => {
  const user = localStorage.getItem("role");

  return (
    <div className="min-h-screen flex flex-col">
      <nav className="bg-gray-800 text-white p-4 flex justify-between">
        <span>Mythos360 – {user?.toUpperCase()} Mode</span>
        <LogoutButton />
      </nav>
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
};

export default Layout;
