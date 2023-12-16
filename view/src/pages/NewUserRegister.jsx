import FormCadastrarUsuario from "../components/FormCadastrarUsuario";
import { FaUserPlus } from "react-icons/fa";

const NewUserRegister = () => {
  return (
    <div className="container-global">
      <div className="text-title">
        <h1 className="text-profile-title">
          <FaUserPlus className="mr-5" />
          Cadastrar novo usuario
        </h1>
      </div>
      <FormCadastrarUsuario />
    </div>
  );
};

export default NewUserRegister;
