// Navbar.jsx

import React, { useContext, useEffect, useState } from "react";
import { AiOutlineSetting } from "react-icons/ai";
import { NavLink } from "react-router-dom";

import { AuthContext } from "../../context/authContext";
import { FiLogOut } from "react-icons/fi";

const Navbar = () => {
  const [profile, setProfile] = useState({});

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    setProfile(user || {});
  }, []);

  // console.log(profile.user);

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const { logout } = useContext(AuthContext);

  const handleLogout = () => {
    logout();
  };

  return (
    <nav className="navbar">
      <div className="flex items-center justify-between text-black pr-6 pl-6">
        <div className="name">
          <h1>{profile.user?.name}</h1>
        </div>

        <span className="dropdown-name"></span>
        <div className="position-btn-dropdown">
          <button
            onClick={toggleDropdown}
            className="btn-open-dropdown">
            <AiOutlineSetting fontSize={25} />
          </button>

          {isDropdownOpen && (
            <div className="absolute top-5 right-10 mt-2 bg-white border rounded-md opened-dropdown">
              <NavLink
                to={`/meu-perfil-de-usuario/${profile.user?.id}`}
                className="profile-dropdown p-2">
                <span className="dropdown-name">{profile.user?.name}</span>
                <span className="dropdown-profile">
                  {profile.user?.Roles[0]?.role_name}
                </span>
                <span className="dropdown-status">{profile.user?.status}</span>
              </NavLink>
              <NavLink
                to={`/meu-perfil-de-usuario/${profile.user?.id}`}
                className="navlink-dropdown p-2">
                Meu perfil
              </NavLink>
              <NavLink
                className="navlink-dropdown p-2 "
                onClick={handleLogout}>
                <FiLogOut /> Sair
              </NavLink>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
