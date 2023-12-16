import React, { useState } from "react";
import { Modal } from "react-bootstrap";

import {
  BsFillPersonFill,
  BsEnvelopeFill,
  BsGearFill,
  BsFillPenFill,
  BsJournalCheck,
  BsGrid,
  BsEyeFill,
} from "react-icons/bs";
import FormCadastrarUsuario from "./FormCadastrarUsuario";

const ShortCuts = () => {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <>
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
                <button className="btn btn-primary">Ir para Perfil</button>
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
    </>
  );
};

export default ShortCuts;
