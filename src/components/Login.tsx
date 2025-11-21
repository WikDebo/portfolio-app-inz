/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import "../scss/components/_signin.scss";
import AuthService from "../services/auth.service.ts";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import type { IUser } from "../types/user.type.ts";
import { Navigate } from "react-router-dom";

interface Props {
  closeModal: () => void;
  switchToSignup: () => void;
  onLoginSuccess: (user: IUser) => void;
}

interface FormValues {
  username: string;
  password: string;
}

const Login: React.FC<Props> = ({
  closeModal,
  switchToSignup,
  onLoginSuccess,
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [redirect, setRedirect] = useState<string | null>(null);

  const initialValues: FormValues = {
    username: "",
    password: "",
  };
  const validationSchema = Yup.object().shape({
    username: Yup.string().required("This field is required!"),
    password: Yup.string().required("This field is required!"),
  });

  const handleLogin = async (values: FormValues) => {
    //setError("");
    //setLoading(true);
    try {
      const user = await AuthService.login(values.username, values.password);
      onLoginSuccess(user);
      // Optional redirect
      setRedirect("/profile");
    } catch (err: any) {
      setError(err.response?.data?.message || "Login failed");
    }
    setLoading(false);
  };

  if (redirect) {
    return <Navigate to={redirect} />;
  }

  return (
    <div className="modal" onClick={closeModal}>
      <div className="modal__container" onClick={(e) => e.stopPropagation()}>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleLogin}
        >
          <Form>
            <h1>Sign In</h1>
            {error && <p className="modal__error">{error}</p>}

            <label htmlFor="username">
              <b>Username</b>
            </label>
            <Field
              type="text"
              id="username"
              name="username"
              placeholder="Enter username"
              required
            />
            <ErrorMessage
              name="username"
              component="div"
              className="modal__error"
            />

            <label htmlFor="password">
              <b>Password</b>
            </label>
            <Field
              type="password"
              id="password"
              placeholder="Enter Password"
              name="password"
              required
            />
            <ErrorMessage
              name="password"
              component="div"
              className="modal__error"
            />

            {/*<label className="modal__checkbox">
            <input type="checkbox" defaultChecked /> Remember me
          </label>
          */}
            <button type="submit" disabled={loading} className="modal__button">
              Sign In
            </button>

            <p className="modal__text">
              Don’t have an account?{" "}
              <span onClick={switchToSignup}>Create one</span>
            </p>
          </Form>
        </Formik>
      </div>
    </div>
  );
};

export default Login;
