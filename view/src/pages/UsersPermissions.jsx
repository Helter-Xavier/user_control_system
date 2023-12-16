import React from "react";
import { FaUserCheck } from "react-icons/fa";

const UsersPermissions = () => {
  return (
    <div className="container-global">
      <div className="text-title">
        <h1 className="text-profile-title">
          <FaUserCheck className="mr-5" />
          Permissões de Acesso
        </h1>
      </div>
    </div>
  );
};

export default UsersPermissions;
