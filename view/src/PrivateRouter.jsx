import { Navigate } from "react-router-dom";
import PropTypes from "prop-types";

export function PrivateRoute({ children }) {
  PrivateRoute.propTypes = {
    children: PropTypes.string.isRequired,
  };
  const user = false;

  return user ? children : <Navigate to="/login" />;
}
