import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";

import { Container, Row, Col, Modal } from "react-bootstrap";

import {
  BsFillPersonFill,
  BsEnvelopeFill,
  BsGearFill,
  BsFillPenFill,
  BsJournalCheck,
  BsGrid,
  BsEyeFill,
} from "react-icons/bs";
import FormCadastrarUsuario from "../components/FormCadastrarUsuario";

const HomePage = () => {
  const [profile, setProfile] = useState({});
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    setProfile(user || {});
  }, []);

  return (
    <>
      <div className="container-global home-page">
        <div className="container mt-5 ">
          <div className="row">
            <div className="col-md-6 mb-4">
              <div className="card border-0">
                <div className="card-body">
                  <div className="box">
                    <div className="box-circle-white">
                      <div className="box-circle-blue">
                        <BsFillPersonFill />
                      </div>
                    </div>
                  </div>
                  <div className="display-user">
                    <h5 className="card-title">
                      Bem-vindo, {profile.user?.name}
                    </h5>
                    <span>
                      <BsEnvelopeFill />
                      {profile.user?.email}
                      <a href="/meu-perfil-de-usuario"></a>
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-md-6 mb-4">
              <div className="card border-0">
                <div className="card-body">
                  <div className="box">
                    <div className="box-circle-white">
                      <div className="box-circle-blue">
                        <BsFillPenFill />
                      </div>
                    </div>
                  </div>
                  <div className="display-user">
                    <h5 className="card-title">Meu Perfil</h5>

                    <span>Visualizar meu perfil</span>
                  </div>
                </div>
                <NavLink to={`/meu-perfil-de-usuario/${profile.user?.id}`}>
                  <BsEyeFill />
                </NavLink>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-md-6 mb-4 ">
              <div className="card border-0">
                <div className="card-body">
                  <div className="box">
                    <div className="box-circle-white">
                      <div className="box-circle-blue">
                        <BsJournalCheck />
                      </div>
                    </div>
                  </div>
                  <div className="display-user">
                    <h5 className="card-title">Função no Sistema</h5>
                    <span>{profile.user?.Roles[0]?.role_name}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-md-6 mb-4">
              <div className="card border-0">
                <div className="card-body">
                  <div className="box">
                    <div className="box-circle-white">
                      <div className="box-circle-blue">
                        <BsJournalCheck />
                      </div>
                    </div>
                  </div>
                  <div className="display-user">
                    <h5 className="card-title">
                      Permissão de Acesso ao Sistema
                    </h5>
                    {/* <span>{profile.user?.Profiles[0]?.profile_name}</span> */}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ATALHOS */}
        <div className="container mt-5">
          <span>
            <BsGrid />
            <h5>Atalhos</h5>
          </span>
          <div className="row">
            {/* Perfil do usuário */}
            <div className="col-md-4 mb-4">
              <div className="card border-0">
                <div className="card-body">
                  <h5 className="card-title"></h5>
                  <NavLink></NavLink>
                  <button className="btn btn-primary">Ir para Cadastro</button>
                </div>
              </div>
            </div>

            {/* Cadastrar Novo Usuário */}
            <div className="col-md-4 mb-4">
              <div className="card border-0">
                <div className="card-body">
                  <h5 className="card-title"></h5>
                  <button className="btn btn-primary">Ir para Cadastro</button>
                </div>
              </div>
            </div>

            {/* Configurações */}
            <div className="col-md-4 mb-4">
              <div className="card border-0">
                <div className="card-body">
                  <h5 className="card-title"></h5>
                  <button
                    className="btn btn-primary"
                    onClick={handleShow}>
                    Cadastrar
                  </button>
                  <Modal
                    show={show}
                    onHide={handleClose}>
                    <Modal.Header closeButton>
                      <Modal.Title className="modal-title">
                        Cadastrar usuário
                      </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                      <FormCadastrarUsuario />
                    </Modal.Body>
                  </Modal>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default HomePage;
