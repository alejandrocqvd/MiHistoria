/**
 * RequireAuth Component
 * 
 * A higher-order component for handling route protection in React applications. 
 * It checks if a user is authenticated (via AuthContext). If not authenticated, 
 * it redirects the user to the login page. Otherwise, it renders the children components, 
 * allowing access to the protected route.
 * 
 * Usage: Wrap this component around any React component or JSX elements that should be 
 * accessible only to authenticated users.
 * 
 * Author: Alejandro Cardona
 * Date: 2024-01-06
 */

import { Navigate, useLocation } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../context/authContext";

/**
 * Interface for RequireAuthProps
 * 
 * @property {JSX.Element} children - The React components or JSX elements to render
 */
interface RequireAuthProps {
  children: JSX.Element;
}

/**
 * RequireAuth Function Component
 * 
 * Responsible for conditionally rendering the children elements based on user authentication status.
 * If the user is not authenticated, redirects to the login page, otherwise renders the children.
 * 
 * @param {RequireAuthProps} props - Props for RequireAuth component.
 * @returns {JSX.Element} - JSX rendering of children components or redirection to login page.
 */
function RequireAuth({ children }: RequireAuthProps): JSX.Element {
  const auth = useContext(AuthContext);
  const location = useLocation();

  if (!auth?.currentUser) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}

export default RequireAuth;
