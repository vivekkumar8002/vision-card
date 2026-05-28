import PropTypes from "prop-types";
import { useContext } from "react";
import { Navigate } from "react-router-dom";

import AuthContext from "../context/AuthContext";
import RequireAuth from "./RequireAuth";

function RequireAdmin({ children }) {
  const auth = useContext(AuthContext);

  return (
    <RequireAuth>
      {auth?.user?.isAdmin ? children : <Navigate to="/profile" replace />}
    </RequireAuth>
  );
}

RequireAdmin.propTypes = {
  children: PropTypes.node.isRequired,
};

export default RequireAdmin;
