import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { useEffect, useState } from "react";
import { useUserStore } from "../store/userStore";
import { userService } from "../service/apiService";
import UserTable from "../conponents/UserTable";
import UserForm from "../conponents/UserForm";
import DeleteConfirmation from "../conponents/DeleteConfirmation";
import type { User } from "../types/user";
import { showError} from "../utils/toast";

const DashboardPage = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null)
  const [openForm, setOpenForm] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [deletingUser, setDeletingUser] = useState<User | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false); 

  const users = useUserStore((state) => state.users);
  const setUsers = useUserStore((state) => state.setUsers);
  const addUser = useUserStore((state) => state.addUser);
  const updateUser = useUserStore((state) => state.updateUser);
  const deleteUser = useUserStore((state) => state.deleteUser);

  const token = useAuthStore((state) => state.token);
  const clearToken = useAuthStore((state) => state.clearToken);

  const navigate = useNavigate();

  useEffect(() => {
    const loadDashboardData = async () => {
      if (!token) {
        navigate("/login");
        return
      }

      try {
        setLoading(true)
        setError(null)

        const userData = await userService.fetchUsers(token)
        setUsers(userData)
      }
      catch(err: any) {
        if(err.status === 401 || err.message?.includes("unauthorized") || err.message?.includes("401")) {
          clearToken()
          navigate("/login")
          return
        } else {
          const errorMessage = err.message || "Failed to load dashboard data"
          setError(errorMessage)
          showError(errorMessage)
        }
      } 
      finally {
        setLoading(false)
      }
    }

    loadDashboardData()
  }, [token, navigate, clearToken, setUsers]);


  const handleAddUser = async (userData: Omit<User, "id">) => {
    if (!token) return;

    try {
      const res = await userService.addUser(token, userData);
      addUser(res);
      setOpenForm(false);
    } catch (err: any) {
      handleApiError(err)
      throw err
    }
  };

  const handleUpdateUser = async (userData: Omit<User, "id">) => {
    if (!token || !editingUser) return;

    try {
      const updatedUser = await userService.updateUser(
        token,
        editingUser.id,
        userData
      );
      const completeUser: User = {...updatedUser, id: editingUser.id};
      updateUser(completeUser);
      setEditingUser(null);
      setOpenForm(false);
    } catch (err: any) {
      handleApiError(err)
      throw err
    }
  };

  const handleDeleteConfirm = async () => {
    if (!token || !deletingUser) return;

    try {
      setDeleteLoading(true); 
      await userService.deleteUser(token, deletingUser.id);
      deleteUser(deletingUser.id);
      setDeletingUser(null);
    } catch (err: any) {
      handleApiError(err)
      throw err
    } finally {
      setDeleteLoading(false); 
    }
  };

  const handleApiError = (error: any) => {
    const message = error.message || "An unexpected error occurred";
    showError(message);
    return { success: false, message };
  }

  const handleDeleteClick = (userId: string) => {
    const userToDelete = users.find((u) => u.id === userId);
    if(userToDelete) {
      setDeletingUser(userToDelete);
    }
  }

  const handleCloseDeleteConfirm = () => {
    setDeletingUser(null);
  }

  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setOpenForm(true);
  };

  const handleCloseForm = () => {
    setEditingUser(null);
    setOpenForm(false);
  };

  const handleLogout = () => {
    clearToken();
    navigate("/login");
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

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="bg-white p-8 rounded-2xl shadow-lg border border-blue-100 text-center">
          <div className="text-red-600 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Failed to load dashboard</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        
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
        
        <UserTable
          users={users}
          onEdit={handleEditUser}
          onDelete={handleDeleteClick}
        />

        <UserForm
          open={openForm}
          onClose={handleCloseForm}
          onSubmit={editingUser ? handleUpdateUser : handleAddUser}
          user={editingUser}
          isEditing={!!editingUser}
        />

        <DeleteConfirmation 
          open={!!deletingUser}
          user={deletingUser}
          onClose={handleCloseDeleteConfirm}
          onConfirm={handleDeleteConfirm}
          loading={deleteLoading} 
        />
      </div>
    </div>
  );
};

export default DashboardPage;