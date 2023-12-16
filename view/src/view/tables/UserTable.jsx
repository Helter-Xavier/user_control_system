// React import
import * as React from "react";
import { useState } from "react";
import { useEffect } from "react";
// Import formulario de cadastro
import FormCadastrarUsuario from "../../components/FormCadastrarUsuario";
// React-router-dom
import { NavLink } from "react-router-dom";
// Core Ui table
import { CSmartTable, CCollapse, CCardBody } from "@coreui/react-pro";
import { CBadge } from "@coreui/react";
// Modal react-bootstrapo
import Modal from "react-bootstrap/Modal";
// Icons github icons
import {
  AiFillEdit,
  AiFillDelete,
  AiOutlineDown,
  AiOutlineUp,
} from "react-icons/ai";
// API
import { api } from "../../services/api";
import axios from "axios";
// format-date
import { format } from "date-fns";
//Modal confirme delete
import Swal from "sweetalert2";

const UserTable = () => {
  const [details, setDetails] = useState([]);
  const [usersData, setUsersData] = useState([]);
  const [show, setShow] = useState(false);
  const [profile, setProfile] = useState({});

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const columns = [
    {
      key: "name",
      label: "Nome",
      _style: { width: "20%" },
    },
    {
      key: "email",
      label: "Email",
      _style: { width: "20%" },
    },

    {
      key: "role_name",
      label: "Função",
      _style: { width: "20%" },
    },
    {
      key: "status",
      _style: { width: "20%" },
    },
    {
      key: "show_details",
      label: "",
      _style: { width: "20%" },
      filter: false,
      sorter: false,
    },
  ];

  const getUsers = () => {
    api
      .get("http://localhost:8080/lista-de-usuarios")
      .then((res) => {
        // Mapeiamento dos usuários e ajuste da estrutura para incluir role_name
        const adjustedUsersData = res.data.users.map((user) => {
          return {
            id: user.id,
            name: user.name,
            email: user.email,
            status: user.status,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
            role_name: user.Roles.length > 0 ? user.Roles[0].role_name : null,
            // profile_name:
            //   user.Profiles.length > 0 ? user.Profiles[0].profile_name : null,
          };
        });
        setUsersData(adjustedUsersData);
      })
      .catch((err) => {
        // Mensagem de erro
        console.log(err);
      });
  };

  useEffect(() => {
    getUsers();
    //Usuario localStorage
    const user = JSON.parse(localStorage.getItem("user"));
    setProfile(user || {});
  }, []);

  // Verificar usuario
  const verifyUser = profile.user?.Roles[0]?.role_name;
  // Status do usuario
  const getBadge = (status) => {
    switch (status) {
      case "Ativo":
        return "success";
      case "Inativo":
        return "secondary";
      case "Pendente":
        return "warning";
      case "Banido":
        return "danger";
      default:
        return "primary";
    }
  };
  //Detalhes dos usuario na tabela
  const toggleDetails = (index) => {
    const position = details.indexOf(index);
    let newDetails = details.slice();
    if (position !== -1) {
      newDetails.splice(position, 1);
    } else {
      newDetails = [...details, index];
    }
    setDetails(newDetails);
  };

  //Confirm Delete
  const handleConfirm = (id) => {
    Swal.fire({
      title: "Tem certeza que deseja excluir este usuário?",
      text: "Você não poderá reverter isso!",
      showDenyButton: true,
      confirmButtonText: "Confirmar",
      denyButtonText: `Cancelar`,
    }).then((result) => {
      if (result.isConfirmed) {
        axios.delete(`http://localhost:8080/deletar-usuario/${id}`);
        Swal.fire("Usuário Apagado!", "");
        window.location.reload();
      }
    });
  };

  return (
    <div className="table">
      <div className="data-grid">
        <div className="top-grid">
          <div></div>
          {verifyUser === "Administrador" && (
            <button
              className="btn-redirect"
              onClick={handleShow}>
              Cadastrar
            </button>
          )}
        </div>

        <Modal
          show={show}
          onHide={handleClose}
          dialogClassName="modal-0">
          <Modal.Header closeButton>
            <Modal.Title className="modal-title">Cadastrar usuário</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <FormCadastrarUsuario />
          </Modal.Body>
        </Modal>

        <CSmartTable
          activePage={2}
          clickableRows
          columns={columns}
          columnFilter
          columnSorter
          items={usersData}
          itemsPerPage={5}
          pagination
          scopedColumns={{
            status: (item) => (
              <td>
                <CBadge color={getBadge(item.status)}>{item.status}</CBadge>
              </td>
            ),
            show_details: (item) => {
              return (
                <td className="py-2">
                  <button
                    className="show-info"
                    onClick={() => {
                      toggleDetails(item.id);
                    }}>
                    {details.includes(item.id) ? (
                      <AiOutlineUp />
                    ) : (
                      <AiOutlineDown />
                    )}
                  </button>
                </td>
              );
            },
            details: (item) => {
              return (
                <CCollapse visible={details.includes(item.id)}>
                  <CCardBody className="p-3 detailes-styles">
                    <h4>{item.name}</h4>
                    <p>Email: {item.email}</p>
                    <p>Status: {item.status}</p>
                    <p>Perfil: {item.role_name}</p>
                    <p>
                      Cadastro em:{" "}
                      {format(new Date(item.createdAt), "dd/MM/yyyy")}
                    </p>
                    <p>
                      Atualizado em:{" "}
                      {format(new Date(item.updatedAt), "dd/MM/yyyy")}
                    </p>
                  </CCardBody>

                  {verifyUser === "Administrador" && (
                    <div className="btn-actions">
                      <NavLink
                        title="Editar usuário!"
                        to={`/Acesso/editar/${item.id}`}>
                        <button className="btn-actions edit-btn">
                          <AiFillEdit />
                        </button>
                      </NavLink>

                      <button
                        className="btn-actions delete-btn bg-danger"
                        onClick={() => handleConfirm(item.id)}>
                        <AiFillDelete />
                      </button>
                    </div>
                  )}
                </CCollapse>
              );
            },
          }}
          sorterValue={{ column: "status", state: "asc" }}
          tableProps={{
            className: "add-this-class",
            responsive: true,
            striped: true,
            hover: true,
          }}
          tableBodyProps={{
            className: "align-middle",
          }}
        />
      </div>
    </div>
  );
};

export default UserTable;
