import { useEffect, useState, type FC, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { userService } from "../service/apiService";

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute: FC<ProtectedRouteProps> = ({ children }) => {
  const token = useAuthStore((state) => state.token);
  const clearToken = useAuthStore((state) => state.clearToken);
  const navigate = useNavigate();
  const [isValidating, setIsValidating] = useState(true);

  useEffect(() => {
    const validateToken = async () => {
      if(!token) {
        navigate("/login");
        return
      }

      try {
        await userService.fetchUsers(token);
        setIsValidating(false);
      } catch (err: any) {
        if(err.message.includes("401") || err.message.includes("unauthorized")) {
          clearToken();
          navigate("/login");
        } else {
          console.error("Token validation error:", err);
          setIsValidating(false);
        }
      } 
    }

    validateToken()
  }, [token, navigate]);

   if (isValidating) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="bg-white p-8 rounded-2xl shadow-lg border border-blue-100">
          <div className="flex items-center justify-center space-x-3">
            <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-lg font-medium text-gray-700">
              Verifying session...
            </span>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;
