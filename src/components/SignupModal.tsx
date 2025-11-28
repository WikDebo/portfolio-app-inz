import React from "react";
import { useNavigate } from "react-router-dom";
import Signup from "./Register";

const SignupModal: React.FC = () => {
  const navigate = useNavigate();

  const handleClose = () => navigate(-1);
  const switchToLogin = () => navigate("/login");

  return <Signup closeModal={handleClose} switchToLogin={switchToLogin} />;
};

export default SignupModal;
