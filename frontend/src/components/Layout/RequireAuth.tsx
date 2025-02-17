import useAuth from "@/hooks/use-auth";
import { Loader2 } from "lucide-react";
import { useEffect } from "react";
import { Navigate, Outlet, useLocation, useNavigate } from "react-router-dom";

const RequireAuth = () => {
  const { getToken, isAuthenticated, isLoading, logout, getLoggedInUser } =
    useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const token = getToken();
      const user = getLoggedInUser();

      if (!token || !user) {
        logout();
        navigate("/login", {
          state: { from: location },
          replace: true,
        });
        return;
      }

      if (location.pathname === "/login") {
        navigate("/");
      }
    };

    checkAuth();
  }, [isAuthenticated, location.pathname]);

  if (isLoading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-gray-50">
        <div className="text-center space-y-4">
          <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto" />
          <p className="text-gray-600 text-lg">Loading your account...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
};

export default RequireAuth;
