import { useCallback, useMemo, useState } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";

import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

import { BsPlus } from "react-icons/bs";
import FormCadastrarUsuario from "./FormCadastrarUsuario";

import { api } from "../services/api";

const TableUsers = () => {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const containerStyle = useMemo(() => ({ minWidth: "100%" }), []);
  const gridStyle = useMemo(() => ({ minWidth: "100%" }), []);

  const [rowData, setRowData] = useState();
  const columnDefs = [
    {
      headerName: "",
      headerCheckboxSelection: true,
      checkboxSelection: true,
      minWidth: 150,
      maxWidth: 45,
      width: 55,
    },
    {
      headerName: "Usuários",
      children: [
        {
          headerName: "Nome",
          field: "name",
          filter: "agTextColumnFilter",
        },
        {
          headerName: "Email",
          field: "email",
          filter: "agTextColumnFilter",
        },
        {
          headerName: "Perfil",
          field: "perfil",
          filter: "agTextColumnFilter",
        },
        {
          headerName: "Status",
          field: "status",
          filter: "agTextColumnFilter",
        },
        {
          headerName: " ",
          field: "id",
          cellRendererFramework: () => (
            <div>
              <Button>Update</Button>
              <Button>Delete</Button>
            </div>
          ),
        },
      ],
    },
  ];

  const defaultColDef = useMemo(() => {
    return {
      floatingFilter: true,
      flex: 5,
    };
  }, []);

  const onGridReady = useCallback(() => {
    api.get("http://localhost:8080/lista-de-usuarios").then((res) => {
      const data = res.data.users;
      setRowData(data);
    });
  }, []);

  return (
    <div className="containe-main">
      <h1>Usuários Cadastrados</h1>
      <div style={containerStyle}>
        <div
          style={gridStyle}
          className="ag-theme-alpine">
          <div className="col-lg-12 btn-modal-cadastrar">
            <Button
              className="btn-primary btn-styles"
              onClick={handleShow}>
              <BsPlus /> Cadastrar
            </Button>
          </div>

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

          <AgGridReact
            rowSelection="multiple"
            columnDefs={columnDefs}
            rowData={rowData}
            domLayout="autoHeight"
            floatingFilter={true}
            defaultColDef={defaultColDef}
            onGridReady={onGridReady}
          />
        </div>
      </div>
    </div>
  );
};

export default TableUsers;
