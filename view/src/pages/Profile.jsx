import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import { api } from "../services/api";

import Spinner from "react-bootstrap/Spinner";
import Alert from "react-bootstrap/Alert";

import { BsFillPersonFill } from "react-icons/bs";
import { FaUserEdit } from "react-icons/fa";

const schema = yup
  .object({
    name: yup.string().required("Este campo é obrigatório"),
    email: yup
      .string()
      .email("Digite um email válido")
      .required("Este email é obrigatório"),
    role_name: yup.string().required("Este campo é obrigatório"),
    status: yup.string().required("Este campo é obrigatório"),
    password_hash: yup
      .string()
      .min(6, "A senha deve ter pelo menos 6 digitos")
      .required("A senha é obrigatório"),
  })
  .required();

const Profile = () => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  const roles = ["Administrador", "Gerente", "Usuario Comum"];
  const status_user = ["Ativo", "Inativo", "Banido"];

  const { id } = useParams();
  const [_id] = useState(id);

  const [loading, setLoading] = useState(true);
  const [show, setShow] = useState(true);

  const [message, setMessage] = useState("");
  const [confirmTimeout, setConfirmTimeout] = useState(true);

  const [messageFailed, setMessageFailed] = useState("");
  const [startTimeout, setStartTimeout] = useState(true);

  const [data, setData] = useState({
    name: "",
    email: "",
    status: "",
    role_name: "",
    password_hash: "",
  });

  useEffect(() => {
    const getUser = async () => {
      try {
        const response = await api.get(`/visualizar-usuario/${_id}`);

        setData(response.data.user);
        console.log(response.data.user);
        // Preencher os campos do formulário com os dados existentes
        Object.keys(response.data.user).forEach((key) => {
          if (key === "Roles") {
            // Tratar o campo Roles separadamente
            setValue("Roles", response.data.user.Roles);
          } else {
            setValue(key, response.data.user[key]);
          }
        });
      } catch (error) {
        console.log(error);
      }
    };

    getUser();
  }, [_id, setValue]);

  const onSubmit = async (formData) => {
    setLoading(!loading);

    const updatedUserData = {
      id: _id,
      name: formData.name,
      email: formData.email,
      status: formData.status,
      password_hash: formData.password_hash,
      role_name: formData.role_name,
    };

    console.log(updatedUserData);

    api
      .put(`/editar-usuario/${_id}`, updatedUserData, data)
      .then((response) => {
        const msgSucess = response.data.mensagem;
        const loadingTimer = setTimeout(() => {
          console.log(response.data);
          setConfirmTimeout(false);
          setLoading(loading);
          setMessage(msgSucess);
        }, 2000);
        return () => clearTimeout(loadingTimer);
      })
      .catch((error) => {
        const loadingTimer = setTimeout(() => {
          setStartTimeout(false);
          setLoading(loading);
          if (error.response) {
            setMessageFailed(error.response.data.mensagem);
          } else {
            setMessageFailed("Erro: Tente novamente mais tarde!");
          }
        }, 2000);
        return () => clearTimeout(loadingTimer);
      });
  };

  return (
    <div className="container-global">
      <div className="text-title">
        <h1 className="text-profile-title">
          <FaUserEdit className="mr-5" />
          Editar perfil
          <span>Editar e alterar dados do perfil</span>
        </h1>
      </div>
      <Form
        className="bg-white p-4 border border-gray"
        onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-3">
          <Form.Label>Nome</Form.Label>
          <Form.Group controlId="formName">
            <Form.Control
              type="text"
              placeholder="Digite o nome"
              defaultValue={data.name}
              {...register("name")}
            />
            <Form.Text className="text-danger">
              {errors.name?.message}
            </Form.Text>
          </Form.Group>
        </div>

        <div className="mb-3">
          <Form.Label>Email</Form.Label>
          <Form.Group controlId="formEmail">
            <Form.Control
              type="text"
              placeholder="Digite o email"
              {...register("email")}
              defaultValue={data.email}
            />
            <Form.Text className="text-danger">
              {errors.email?.message}
            </Form.Text>
          </Form.Group>
        </div>

        <div className="mb-3">
          <Form.Label>Cargo</Form.Label>
          <Form.Group controlId="formRoleName">
            <Form.Select
              {...register("role_name")}
              defaultValue={
                data.Roles && data.Roles.length > 0
                  ? data.Roles[0].role_name
                  : ""
              }>
              {roles.map((role, index) => (
                <option
                  key={index}
                  value={role}
                  selected={
                    data.Roles &&
                    data.Roles.length > 0 &&
                    data.Roles[0].role_name === role
                  }>
                  {role}
                </option>
              ))}
            </Form.Select>
            <Form.Text className="text-danger">
              {errors.role_name?.message}
            </Form.Text>
          </Form.Group>
        </div>

        <div className="mb-3">
          <Form.Label>Status</Form.Label>
          <Form.Group controlId="formStatus">
            <Form.Select
              {...register("status")}
              defaultValue={data.status_user}
              disabled>
              {data.status && data.status > 0 && (
                <option value={data.status}>{data.status}</option>
              )}
              {status_user.map((status) => (
                <option
                  key={status}
                  value={status}>
                  {status}
                </option>
              ))}
            </Form.Select>
            <Form.Text className="text-danger">
              {errors.status?.message}
            </Form.Text>
          </Form.Group>
        </div>

        <div className="mb-3">
          <Form.Label>Senha</Form.Label>
          <Form.Group
            controlId="formPassword"
            className="mb-3">
            <Form.Control
              type="password"
              placeholder="Digite a senha"
              {...register("password_hash")}
            />
            <Form.Text className="text-blue">
              Digite sua senha para confirmar
            </Form.Text>
          </Form.Group>
        </div>

        <Button
          type="submit"
          className="btn btn-primary"
          value="Salvar">
          Salvar
        </Button>
      </Form>

      <div className="col-6 mx-auto text-center w-25 p-1">
        {!loading ? (
          <Spinner
            animation="border"
            role="status"
            variant="primary">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        ) : (
          ""
        )}

        {!confirmTimeout && (
          <Alert
            show={show}
            dismissible
            variant="success"
            onClose={() => setShow(false)}>
            <Alert.Heading>
              <span className="message-span">{message}</span>
            </Alert.Heading>
          </Alert>
        )}
        {!startTimeout && (
          <Alert
            show={show}
            dismissible
            variant="danger"
            onClose={() => setShow(false)}>
            <Alert.Heading>
              <span className="message-span">{messageFailed}</span>
            </Alert.Heading>
          </Alert>
        )}
      </div>
    </div>
  );
};

export default Profile;
