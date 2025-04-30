import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import PageWrapper from "@/components/PageWrapper";

type TokenPayload = {
  sub: string;
  role: string;
  exp: number;
};

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await axios.post("http://localhost:8000/auth/login", {
        email,
        password,
      });

      const token = res.data.access_token;
      const decoded: TokenPayload = jwtDecode(token);

      localStorage.setItem("token", token);
      localStorage.setItem("role", decoded.role);

      switch (decoded.role) {
        case "admin":
          navigate("/admin");
          break;
        case "manager":
          navigate("/manager");
          break;
        case "facilitator":
          navigate("/facilitator");
          break;
        default:
          navigate("/employee");
      }
    } catch (err) {
      alert("Login failed. Check credentials: " + err);
    }
  };

  return (
    <PageWrapper>
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="p-6 bg-white shadow-md rounded w-96">
                <h2 className="text-xl font-bold mb-4">Login</h2>
                <input
                type="email"
                placeholder="Email"
                className="w-full p-2 border mb-3"
                onChange={(e) => setEmail(e.target.value)}
                />
                <input
                type="password"
                placeholder="Password"
                className="w-full p-2 border mb-3"
                onChange={(e) => setPassword(e.target.value)}
                />
                <button
                onClick={handleLogin}
                className="bg-blue-600 text-white w-full p-2 rounded"
                >
                Login
                </button>
                <p className="mt-4 text-sm text-center">
                    Don’t have an account?{" "}
                    <a href="/register" className="text-blue-600 hover:underline">
                        Register here
                    </a>
                </p>
            </div>
        </div>
    </PageWrapper>
  );
};

export default Login;
