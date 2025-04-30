import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [form, setForm] = useState({
    firstname: "",
    middlename: "",
    lastname: "",
    email: "",
    password: "",
    role: "employee",
  });

  const navigate = useNavigate();

  const handleRegister = async () => {
    try {
      await axios.post("http://localhost:8000/auth/register", form);
      alert("Registration successful. Please log in.");
      navigate("/");
    } catch {
      alert("Registration failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="p-6 bg-white shadow-md rounded w-96">
        <h2 className="text-xl font-bold mb-4">Register</h2>
        <input
          type="text"
          placeholder="First Name"
          className="w-full p-2 border mb-3"
          onChange={(e) => setForm({ ...form, firstname: e.target.value })}
        />
        <input
          type="text"
          placeholder="Middle Name"
          className="w-full p-2 border mb-3"
          onChange={(e) => setForm({ ...form, middlename: e.target.value })}
        />
        <input
          type="text"
          placeholder="Last Name"
          className="w-full p-2 border mb-3"
          onChange={(e) => setForm({ ...form, lastname: e.target.value })}
        />
        <input
          type="email"
          placeholder="Email"
          className="w-full p-2 border mb-3"
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full p-2 border mb-3"
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />
        <select
          className="w-full p-2 border mb-3"
          onChange={(e) => setForm({ ...form, role: e.target.value })}
        >
          <option value="employee">Employee</option>
          <option value="manager">Manager</option>
          <option value="facilitator">Facilitator</option>
          <option value="admin">Admin</option>
        </select>
        <button
          onClick={handleRegister}
          className="bg-green-600 text-white w-full p-2 rounded"
        >
          Register
        </button>
      </div>
    </div>
  );
};

export default Register;
