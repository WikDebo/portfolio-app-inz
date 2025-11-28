/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import Login from "./Login";
import AuthContext from "../context/AuthContext";

const LoginModal: React.FC = () => {
  const navigate = useNavigate();
  const { setCurrentUser } = useContext(AuthContext);

  const handleClose = () => navigate(-1);
  const handleLoginSuccess = (user: any) => {
    setCurrentUser(user);
    navigate("/");
  };

  return (
    <Login
      closeModal={handleClose}
      switchToSignup={() => navigate("/signup")}
      onLoginSuccess={handleLoginSuccess}
    />
  );
};

export default LoginModal;
