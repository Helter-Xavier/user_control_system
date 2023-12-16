import Form from "react-bootstrap/Form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import brasao from "../assets/brasao.png";

import { useForm } from "react-hook-form";
import { api } from "../services/api";

import Spinner from "react-bootstrap/Spinner";
import Alert from "react-bootstrap/Alert";

import { useNavigate } from "react-router-dom";

import { useState } from "react";
import Button from "react-bootstrap/esm/Button";

const schema = yup
  .object({
    name: yup.string().required("Este campo é obrigatório"),
    email: yup
      .string()
      .email("Digite um email válido")
      .required("Este email é obrigatório"),
    status: yup.string().required("Este campo é obrigatório"),
    role_name: yup.string().required("Este campo é obrigatório"),
    password_hash: yup
      .string()
      .min(6, "A senha deve ter pelo menos 6 digitos")
      .required("A senha é obrigatório"),
  })
  .required();

const Register = () => {
  const [loading, setLoading] = useState(true);
  const [show, setShow] = useState(true);

  const [message, setMessage] = useState("");
  const [confirmTimeout, setConfirmTimeout] = useState(true);

  const [messageFailed, setMessageFailed] = useState("");
  const [startTimeout, setStartTimeout] = useState(true);

  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  const onSubmit = async (data) => {
    setLoading(!loading);

    await api
      .post("/cadastro-completo", data)
      .then((response) => {
        const msgSucess = response.data.message;

        const loadingTimer = setTimeout(() => {
          setConfirmTimeout(false);
          setLoading(loading);
          setMessage(msgSucess);
        }, 2000);

        const reload = setTimeout(() => {
          navigate("/login");
          return () => clearTimeout(reload);
        }, 4000);

        return () => clearTimeout(loadingTimer);
      })
      .catch((error) => {
        console.log(error);
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
    <>
      <div
        className="container col-11 col-md-9"
        id="form-container">
        <div className="row gx-6">
          <div className="col-md-5">
            <h2>Realize o seu cadastro</h2>
            <Form onSubmit={handleSubmit(onSubmit)}>
              <Form.Group className="mb-3">
                <div className="mb-3">
                  <Form.Label>Nome:</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    placeholder="Digite seu nome completo"
                    className="custom-input-form"
                    {...register("name", { required: true })}
                  />
                  <span className="error-message">{errors.name?.message}</span>
                </div>

                <div className="mb-3">
                  <Form.Label>E-mail</Form.Label>
                  <Form.Control
                    className="custom-input-form"
                    type="email"
                    name="email"
                    placeholder="Digite seu email"
                    {...register("email", { required: true })}
                  />
                  <span className="error-message">{errors.email?.message}</span>
                </div>

                <div className="mb-3">
                  <Form.Label>Status</Form.Label>
                  <Form.Select
                    className="custom-input-form"
                    aria-label="Default select example"
                    name="status"
                    {...register("status", { required: true })}>
                    <option disabled>Status</option>
                    <option value="Ativo">Ativo</option>
                    <option value="Inativo">Inativo</option>
                  </Form.Select>
                  <span className="error-message">
                    {errors.status?.message}
                  </span>
                </div>

                <Form.Group
                  className="mb-3"
                  controlId="formBasicPerfil">
                  <Form.Label>Perfil</Form.Label>
                  <Form.Select
                    aria-label="Default select example"
                    name="perfil"
                    className="custom-input-form"
                    {...register("role_name", { required: true })}>
                    <option value="Usuario Comum">Usuário</option>
                  </Form.Select>
                  <span className="error-message">
                    {errors.role_name?.message}
                  </span>
                </Form.Group>

                <div className="mb-3">
                  <Form.Label>Senha</Form.Label>
                  <Form.Control
                    className="custom-input-form"
                    type="password"
                    placeholder="Digite sua senha"
                    name="password_hash"
                    {...register("password_hash", { required: true })}
                  />
                  <span className="error-message">
                    {errors.password_hash?.message}
                  </span>
                </div>
              </Form.Group>
              <Button
                type="submit"
                className="btn btn-primay"
                value="Cadastrar">
                Cadastrar
              </Button>
            </Form>
          </div>

          <div className="col-md-6 logo-prefeitura">
            <div className="row align-items-center gx-5">
              <div className="col-12">
                <img
                  src={brasao}
                  alt=""
                />
              </div>
              <div
                className="col-12"
                id="link-container">
                <a href="/login">Já tenho cadastro</a>
              </div>
            </div>
          </div>
        </div>
      </div>
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
    </>
  );
};

export default Register;
