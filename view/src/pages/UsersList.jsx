// Importe CSmartTable
import * as React from "react";
import UserTable from "../view/tables/UserTable";
import { BsFillPeopleFill } from "react-icons/bs";

const UsersList = () => {
  return (
    <div className="container-global container-field">
      <div className="text-title">
        <h1 className="text-profile-title">
          <BsFillPeopleFill className="mr-5" />
          Lista de usuários
        </h1>
      </div>
      <UserTable />
    </div>
  );
};

export default UsersList;
