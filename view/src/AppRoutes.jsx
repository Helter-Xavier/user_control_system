import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";

import { useContext } from "react";
import { AuthProvider, AuthContext } from "./context/authContext";

import PropTypes from "prop-types";

// import Register from "./pages/Register";
import Login from "./pages/Login";
import Register from "./pages/Register";
import NewUserRegister from "./pages/NewUserRegister.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import MyUserProfile from "./pages/MyUserProfile";
import EditUser from "./pages/EditUser";
import VisibleUsers from "./pages/VisibleUsers";
import UsersList from "./pages/UsersList";
import UsersProfile from "./pages/UsersProfile";
import UsersPermissions from "./pages/UsersPermissions";
import Profile from "./pages/Profile.jsx";
import RootLayout from "./view/RootLayout.jsx";

const AppRoutes = () => {
  const Private = ({ children }) => {
    Private.propTypes = {
      children: PropTypes.string.isRequired,
    };
    const { authenticated, loading } = useContext(AuthContext);
    if (loading) {
      return <div className="loading">Carregando...</div>;
    }
    // Se não tiver authenticado não sai da dela de login
    if (!authenticated) {
      return <Navigate to="/login" />;
    }
    return children;
  };

  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route
            path="/login"
            element={<Login />}
          />
          <Route
            exact
            path="/register"
            element={<Register />}
          />
          <Route
            exact
            path="/"
            element={
              <Private>
                <RootLayout>
                  <Dashboard />
                </RootLayout>
              </Private>
            }
          />
          <Route
            exact
            path="/meu-perfil-de-usuario/:id"
            element={
              <Private>
                <RootLayout>
                  <Profile />
                </RootLayout>
              </Private>
            }
          />
          <Route
            exact
            path="/cadastrar-novo-usuario"
            element={
              <Private>
                <RootLayout>
                  <NewUserRegister />
                </RootLayout>
              </Private>
            }
          />
          <Route
            exact
            path="/Acesso/editar/:id"
            element={
              <Private>
                <RootLayout>
                  <EditUser />
                </RootLayout>
              </Private>
            }
          />
          <Route
            exact
            path="/acesso/visualizar"
            element={
              <Private>
                <RootLayout>
                  <VisibleUsers />
                </RootLayout>
              </Private>
            }
          />
          <Route
            exact
            path="/tabelas/usuarios"
            element={
              <Private>
                <RootLayout>
                  <UsersList />
                </RootLayout>
              </Private>
            }
          />
          <Route
            exact
            path="/tabelas/perfis"
            element={
              <Private>
                <RootLayout>
                  <UsersProfile />
                </RootLayout>
              </Private>
            }
          />
          <Route
            exact
            path="/tabelas/permissoes"
            element={
              <Private>
                <RootLayout>
                  <UsersPermissions />
                </RootLayout>
              </Private>
            }
          />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default AppRoutes;
