import React, { useState } from "react";

import { AuthContext } from "../context/authContext";
import { useContext } from "react";

import { FiLogOut } from "react-icons/fi";

import Spinner from "react-bootstrap/Spinner";

const LogoutButton = () => {
  const { logout } = useContext(AuthContext);

  const [loading, setLoading] = useState(true);
  const [show, setShow] = useState(true);

  const handleLogout = () => {
    setLoading(!loading);

    const logoutTimer = setTimeout(() => {
      setLoading(loading);
      logout();
    }, 2000);

    return () => clearTimeout(logoutTimer);
  };

  return (
    <>
      <button
        className="link"
        onClick={handleLogout}>
        <FiLogOut
          size={23}
          className="min-w-max"
        />

        <span className="link-name">Sair</span>
      </button>
      <Spinner
        animation="border"
        role="status"
        variant="primary"
        className="spinner">
        <span className="visually-hidden">Loading...</span>
      </Spinner>
    </>
  );
};

export default LogoutButton;
