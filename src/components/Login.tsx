/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import AuthService from "../services/auth.service.ts";
import type { IUser } from "../types/user.type.ts";

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

  const initialValues: FormValues = { username: "", password: "" };

  const validationSchema = Yup.object().shape({
    username: Yup.string().required("This field is required!"),
    password: Yup.string().required("This field is required!"),
  });

  const handleLogin = async (values: FormValues) => {
    setError("");
    setLoading(true);
    try {
      const user = await AuthService.login(values.username, values.password);
      onLoginSuccess(user);
    } catch (err: any) {
      setError(err.response?.data?.message || "Login failed");
    }
    setLoading(false);
  };
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeModal();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [closeModal]);

  return (
    <span className="modal" tabIndex={-1} onClick={closeModal}>
      <a className="modal__container" onClick={(e) => e.stopPropagation()}>
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
              name="password"
              placeholder="Enter Password"
              required
            />
            <ErrorMessage
              name="password"
              component="div"
              className="modal__error"
            />

            <button type="submit" disabled={loading} className="modal__button">
              {loading ? "Signing in..." : "Sign In"}
            </button>

            <p className="modal__text">
              Don’t have an account?{" "}
              <span onClick={switchToSignup}>Create one</span>
            </p>
          </Form>
        </Formik>
      </a>
    </span>
  );
};

export default Login;
