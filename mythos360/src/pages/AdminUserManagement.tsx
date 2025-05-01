import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import axiosInstance from "../utils/axiosInstance";

type User = {
  userid: number;
  firstname: string;
  middlename: string;
  lastname: string;
  email: string;
  role: string;
};

type UploadSummary = {
  created: number;
  skipped: number;
  summary?: { email: string; password: string }[];
};

const AdminUserManagement = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [form, setForm] = useState({ firstname: "", middlename: "", lastname: "", email: "", password: "", role: "employee" });
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [uploadSummary, setUploadSummary] = useState<UploadSummary | null>(null);
  const [emailUsers, setEmailUsers] = useState(false);
  const [editUser, setEditUser] = useState<User | null>(null);

  const fetchUsers = async () => {
    try {
      const res = await axiosInstance.get("/users");
      setUsers(res.data);
    } catch {
      toast.error("Failed to load users");
    }
  };

  const createUser = async () => {
    try {
      await axiosInstance.post("/users", form);
      toast.success("User created");
      setForm({ firstname: "", middlename: "", lastname: "", email: "", password: "", role: "employee" });
      fetchUsers();
    } catch {
      toast.error("Error creating user");
    }
  };

  const deleteUser = async (user_id: number) => {
    try {
      await axiosInstance.delete(`/users/${user_id}`);
      toast.success("User deleted");
      fetchUsers();
    } catch {
      toast.error("Error deleting user");
    }
  };

  const handleCsvUpload = async () => {
    if (!csvFile) return toast.error("Please select a file");

    const text = await csvFile.text();
    const lines = text.trim().split("\n");
    const headers = lines[0].split(",");

    const requiredHeaders = ["firstname", "email", "role"];
    const missing = requiredHeaders.filter((h) => !headers.includes(h));
    if (missing.length > 0) return toast.error(`Missing columns: ${missing.join(", ")}`);

    const rows = lines.slice(1).map((line) => line.split(","));
    const invalidRows = rows.filter((row) => row.length < 3 || !row[0] || !row[1] || !row[2]);

    if (invalidRows.length > 0)
      return toast.error(`CSV contains ${invalidRows.length} invalid row(s).`);

    const formData = new FormData();
    formData.append("file", csvFile);

    try {
      const res = await axiosInstance.post(
        `/users/bulk-upload?send_email=${emailUsers}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      setUploadSummary(res.data);
      setCsvFile(null);
      fetchUsers();
    } catch {
      toast.error("Upload failed");
    }
  };

  const downloadTemplateCSV = () => {
    const headers = ["firstname,email,password,role\n"];
    const sample = ["John Doe,john@example.com,Password123,employee\n"];
    const blob = new Blob([...headers, ...sample], { type: "text/csv" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "mythos360_user_template.csv";
    link.click();
  };

  const resetPassword = async (userid: number) => {
    try {
      const res = await axiosInstance.patch(`/users/${userid}/reset-password`);
      const newPassword = res.data.new_password;
      navigator.clipboard.writeText(newPassword);
      toast.success(`Password reset: ${newPassword} (copied)`);
    } catch {
      toast.error("Failed to reset password");
    }
  };

  const openEditModal = (user: User) => setEditUser(user);

  const saveEditedUser = async () => {
    if (!editUser) return;
    try {
      await axiosInstance.patch(`/users/${editUser.userid}/update`, {
        firstname: editUser.firstname,
        middlename: editUser.middlename,
        lastname: editUser.lastname,
        role: editUser.role,
      });
      toast.success("User updated");
      fetchUsers();
      setEditUser(null);
    } catch {
      toast.error("Update failed");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Admin User Management</h2>

      {/* Manual User Creation */}
      <div className="mb-8 space-y-3">
        <h3 className="font-semibold">Add User Manually</h3>
        <label className="inline-flex items-center mt-2">
          <input
            type="checkbox"
            checked={emailUsers}
            onChange={(e) => setEmailUsers(e.target.checked)}
            className="mr-2"
          />
          Email login credentials to users
        </label>
        <input
          placeholder="First Name"
          className="border p-2 w-full"
          value={form.firstname}
          onChange={(e) => setForm({ ...form, firstname: e.target.value })}
        />
        <input
          placeholder="Middle Name"
          className="border p-2 w-full"
          value={form.middlename}
          onChange={(e) => setForm({ ...form, middlename: e.target.value })}
        />
        <input
          placeholder="Last Name"
          className="border p-2 w-full"
          value={form.lastname}
          onChange={(e) => setForm({ ...form, lastname: e.target.value })}
        />
        <input
          placeholder="Email"
          className="border p-2 w-full"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <input
          placeholder="Password"
          type="password"
          className="border p-2 w-full"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />
        <select
          className="border p-2 w-full"
          value={form.role}
          onChange={(e) => setForm({ ...form, role: e.target.value })}
        >
          <option key="employee" value="employee">Employee</option>
          <option key="manager" value="manager">Manager</option>
          <option key="facilitator" value="facilitator">Facilitator</option>
          <option key="admin" value="admin">Admin</option>
        </select>
        <button onClick={createUser} className="bg-green-600 text-white px-4 py-2 rounded">
          Create User
        </button>
      </div>

      {/* CSV Upload */}
      <div className="mb-6">
        <h3 className="font-semibold mb-2">Bulk Upload Users via CSV</h3>
        <div className="flex items-center space-x-4 mb-2">
          <button
            onClick={downloadTemplateCSV}
            className="bg-gray-700 text-white px-4 py-2 rounded"
          >
            Download Template CSV
          </button>
          <input
            type="file"
            accept=".csv"
            onChange={(e) => setCsvFile(e.target.files?.[0] || null)}
          />
        </div>
        <div>
          <button
            onClick={handleCsvUpload}
            className="mt-3 bg-blue-600 text-white px-4 py-2 rounded"
          >
            Upload CSV
          </button>
        </div>
      </div>

      {/* Users Table */}
      <table className="w-full border text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="border p-2">First Name</th>
            <th className="border p-2">Email</th>
            <th className="border p-2">Role</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.userid} className="text-center">
              <td className="border p-2">{user.firstname}</td>
              <td className="border p-2">{user.email}</td>
              <td className="border p-2 capitalize">{user.role}</td>
              <td className="border p-2 space-x-2">
                <button
                  onClick={() => openEditModal(user)}
                  className="bg-yellow-500 text-white px-2 py-1 rounded text-xs"
                >
                  Edit
                </button>
                <button
                  onClick={() => resetPassword(user.userid)}
                  className="bg-blue-600 text-white px-2 py-1 rounded text-xs"
                >
                  Reset Password
                </button>
                <button
                  onClick={() => deleteUser(user.userid)}
                  className="bg-red-600 text-white px-2 py-1 rounded text-xs"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Upload Summary Modal */}
      {uploadSummary && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg max-w-sm w-full text-center">
            <h2 className="text-xl font-semibold mb-4">Upload Summary</h2>
            <p className="mb-2">✅ Users created: {uploadSummary.created}</p>
            <p className="mb-4">⚠️ Users skipped (already exist): {uploadSummary.skipped}</p>

            {uploadSummary.summary && (
              <>
                <h3 className="font-semibold mt-4">Generated Passwords</h3>
                <ul className="text-sm text-left mt-2">
                  {uploadSummary.summary.map((u) => (
                    <li key={u.email}>
                      <strong>{u.email}:</strong> <code>{u.password}</code>
                    </li>
                  ))}
                </ul>
              </>
            )}

            <button
              onClick={() => setUploadSummary(null)}
              className="mt-6 bg-blue-600 text-white px-4 py-2 rounded"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {editUser && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg max-w-sm w-full text-center">
            <h2 className="text-xl font-semibold mb-4">Edit User</h2>
            <input
              value={editUser.firstname}
              onChange={(e) => setEditUser({ ...editUser, firstname: e.target.value })}
              className="w-full p-2 border mb-2"
            />
            <input
              value={editUser.middlename}
              onChange={(e) => setEditUser({ ...editUser, middlename: e.target.value })}
              className="w-full p-2 border mb-2"
            />
            <input
              value={editUser.lastname}
              onChange={(e) => setEditUser({ ...editUser, lastname: e.target.value })}
              className="w-full p-2 border mb-2"
            />
            <select
              value={editUser.role}
              onChange={(e) => setEditUser({ ...editUser, role: e.target.value })}
              className="w-full p-2 border mb-4"
            >
              <option value="employee">Employee</option>
              <option value="manager">Manager</option>
              <option value="facilitator">Facilitator</option>
              <option value="admin">Admin</option>
            </select>
            <div className="flex justify-between">
              <button
                onClick={saveEditedUser}
                className="bg-blue-600 text-white px-4 py-2 rounded"
              >
                Save
              </button>
              <button
                onClick={() => setEditUser(null)}
                className="bg-gray-500 text-white px-4 py-2 rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUserManagement;
