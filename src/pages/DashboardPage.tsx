import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { useEffect, useState } from "react";
import { useUserStore, type User } from "../store/userStore";
import { userService } from "../service/apiService";
import UserTable from "../conponents/UserTable";
import UserForm from "../conponents/UserForm";

const DashboardPage = () => {
  const [loading, setLoading] = useState(true);
  const [openForm, setOpenForm] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [logoutLoading, setLogoutLoading] = useState(false);

  const users = useUserStore((state) => state.users);
  const setUsers = useUserStore((state) => state.setUsers);
  const addUser = useUserStore((state) => state.addUser);
  const updateUser = useUserStore((state) => state.updateUser);
  const deleteUser = useUserStore((state) => state.deleteUser);

  const token = useAuthStore((state) => state.token);
  const clearToken = useAuthStore((state) => state.clearToken);

  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
  }, [token]);

  const fetchUsers = async () => {
    if (!token) return;
    try {
      setLoading(true);
      const userData = await userService.fetchUsers(token);
      setUsers(userData);
    } catch (err: any) {
      showError(err.message || "Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  const handleAddUser = async (userData: Omit<User, "id">) => {
    if (!token) return;

    try {
      const res = await userService.addUser(token, userData);
      addUser(res);
      setOpenForm(false);
      showSuccess("User added successfully");
    } catch (err: any) {
      showError(err.message || "Failed to add user");
      throw err;
    }
  };

  const handleUpdateUser = async (userData: Omit<User, "id">) => {
    if (!token || !editingUser) return;

    try {
      console.log(`Updating user: ${editingUser.id} with data:`, userData);
      
      const updatedUser = await userService.updateUser(
        token,
        editingUser.id,
        userData
      );
      const completeUser: User = {...updatedUser, id: editingUser.id};
      updateUser(completeUser);
      setEditingUser(null);
      setOpenForm(false);
      showSuccess("User updated successfully");
    } catch (err: any) {
      showError(err.message || "Failed to update user");
      throw err;
    }
  };

  const handleDelete = async (userId: string) => {
    if (!token) return;

    try {
      await userService.deleteUser(token, userId);
      deleteUser(userId);
      showSuccess("User deleted successfully");
    } catch (err: any) {
      showError(err.message || "Failed to delete user");
      throw err;
    }
  };

  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setOpenForm(true);
  };

  const handleCloseForm = () => {
    setEditingUser(null);
    setOpenForm(false);
  };

  const showError = (message: string) => {
    setError(message);
    setTimeout(() => setError(null), 5000);
  };

  const showSuccess = (message: string) => {
    setSuccess(message);
    setTimeout(() => setSuccess(null), 5000);
  };

  const handleLogout = () => {
    setLogoutLoading(true);
    setTimeout(() => {
      clearToken();
      navigate("/login");
    }, 2000);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="bg-white p-8 rounded-2xl shadow-lg border border-blue-100">
          <div className="flex items-center justify-center space-x-3">
            <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-lg font-medium text-gray-700">
              Loading users...
            </span>
          </div>
        </div>
      </div>
    );
  }



  if(logoutLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="bg-white p-8 rounded-2xl shadow-lg border border-blue-100 text-center">
          <div className="flex flex-col items-center space-y-4">
            <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin mb-4"></div>
            <h3 className="text-xl font-semibold text-gray-800">Logging out</h3>
            <p className="text-gray-600">Taking you back to login screen...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="bg-white/80 backdrop-blur-sm p-8 rounded-3xl shadow-sm border border-white/60 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div className="mb-6 lg:mb-0">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                User Dashboard
              </h1>
              <p className="text-gray-600 mt-2 flex items-center">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
                {users.length} users managed
              </p>
            </div>

            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
              <button
                className="group bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 px-6 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2 font-medium"
                onClick={() => setOpenForm(true)}
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                <span>Add New User</span>
              </button>

              <button
                className="group bg-gradient-to-r from-red-500 to-red-600 text-white py-3 px-6 rounded-xl hover:from-red-600 hover:to-red-700 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2 font-medium"
                onClick={handleLogout}
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  />
                </svg>
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="space-y-3 mb-6">
          {error && (
            <div className="p-4 bg-red-50 border-l-4 border-red-500 rounded-r-lg shadow-sm">
              <div className="flex items-center">
                <svg
                  className="w-5 h-5 text-red-500 mr-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <p className="text-red-700 font-medium">{error}</p>
              </div>
            </div>
          )}

          {success && (
            <div className="p-4 bg-green-50 border-l-4 border-green-500 rounded-r-lg shadow-sm">
              <div className="flex items-center">
                <svg
                  className="w-5 h-5 text-green-500 mr-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <p className="text-green-700 font-medium">{success}</p>
              </div>
            </div>
          )}
        </div>

        {/* User Table */}
        <UserTable
          users={users}
          onEdit={handleEditUser}
          onDelete={handleDelete}
        />

        {/* User Form Modal */}
        <UserForm
          open={openForm}
          onClose={handleCloseForm}
          onSubmit={editingUser ? handleUpdateUser : handleAddUser}
          user={editingUser}
          isEditing={!!editingUser}
        />
      </div>
    </div>
  );
};

export default DashboardPage;
