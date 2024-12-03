import { Navigate } from "react-router-dom";
import { useContext } from "react";
import { Context } from "./components/Wrapper";

const ProtectedRoute = ({ children }) => {
  const context = useContext(Context);

  // Example: Check if user is authenticated
  const isAuthenticated = context.isAuthenticated;

  return isAuthenticated ? children : <Navigate to="/" />;
};

export default ProtectedRoute;
