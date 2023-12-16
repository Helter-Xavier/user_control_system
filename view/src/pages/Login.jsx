// Imports
import Form from "react-bootstrap/Form";

import brasao from "../assets/brasao.png";

import { useContext, useState } from "react";
import { AuthContext } from "../context/authContext";

import Spinner from "react-bootstrap/Spinner";
import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/esm/Button";

const Login = () => {
  const { login } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [show, setShow] = useState(true);
  const [email, setEmail] = useState("");
  const [password_hash, setPassword_hash] = useState("");
  const [messageFailed, setMessageFailed] = useState("");
  const [startTimeout, setStartTimeout] = useState(true);
  const [profile, setProfile] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(!loading);

    try {
      const response = await login(email, password_hash);
      const user = response.data.user;
      const token = response.data.token;

      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("token", token);

      api.defaults.headers.Authorization = `Bearer ${token}`;

      setProfile(user);
    } catch (error) {
      const loadingTimer = setTimeout(() => {
        setStartTimeout(false);
        setLoading(loading);
        if (error.response) {
          setMessageFailed(error.response.data.mensagem);
        } else {
          setMessageFailed(error.message); // Use error.message para outros tipos de erro
        }
      }, 2000);

      return () => clearTimeout(loadingTimer);
    }
  };

  return (
    <>
      <div
        className="container col-11 col-md-9"
        id="form-container">
        <div className="row gx-5">
          <div className="col-md-6">
            <h2>Realize o seu Login</h2>
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <div className="mb-3">
                  <Form.Label>E-mail</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Digite seu email"
                    name="email"
                    required
                    onChange={(e) => setEmail(e.target.value)}
                    className="custom-input-form"
                  />
                </div>

                <div className="mb-3">
                  <Form.Label>Senha</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Digite sua senha"
                    name="password_hash"
                    required
                    onChange={(e) => setPassword_hash(e.target.value)}
                    className="custom-input-form"
                  />
                  <span className="danger-styles"></span>
                </div>
              </Form.Group>

              <Button
                type="submit"
                className="btn btn-primay"
                value="Cadastrar">
                Entrar
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
                <a href="/register">Não tenho cadastro</a>
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

export default Login;
