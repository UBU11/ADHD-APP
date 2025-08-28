import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  console.log("--- ProtectedRoute Check ---");
  console.log("Auth loading:", loading);
  console.log("User object:", user);

  if (loading) {
     console.log("Auth is loading showing loading indicator...");
    return <div>Loading...</div>;
  }

  if (!user) {
    console.log("No user found redirecting to login page.");
    return <Navigate to="/" replace />;
  }
  console.log("User is authenticated rendering children (Dashboard).");
  return children;
};

export default ProtectedRoute;
