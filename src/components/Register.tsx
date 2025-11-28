/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import AuthService from "../services/auth.service.ts";

interface SignupProps {
  closeModal: () => void;
  switchToLogin: () => void;
}

interface FormValues {
  email: string;
  username: string;
  password: string;
  repeatPassword: string;
}

const Signup: React.FC<SignupProps> = ({ closeModal, switchToLogin }) => {
  const [error, setError] = useState("");

  const initialValues: FormValues = {
    email: "",
    username: "",
    password: "",
    repeatPassword: "",
  };

  const validationSchema = Yup.object().shape({
    username: Yup.string()
      .min(3, "At least 3 characters")
      .max(20, "Max 20 characters")
      .required("Required"),
    email: Yup.string().email("Invalid email").required("Required"),
    password: Yup.string()
      .min(6, "At least 6 characters")
      .max(40, "Max 40 characters")
      .required("Required"),
  });

  const handleRegister = async (values: FormValues) => {
    if (values.password !== values.repeatPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      await AuthService.register(
        values.username,
        values.email,
        values.password
      );
      switchToLogin();
    } catch (err: any) {
      setError("Signup failed. Email or username may already exist.");
    }
  };

  return (
    <div className="modal" onClick={closeModal}>
      <div className="modal__container" onClick={(e) => e.stopPropagation()}>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleRegister}
        >
          <Form>
            <h1>Sign Up</h1>
            {error && <p className="modal__error">{error}</p>}

            <label htmlFor="email">
              <b>Email</b>
            </label>
            <Field
              type="text"
              id="email"
              name="email"
              placeholder="Enter email"
            />
            <ErrorMessage
              name="email"
              component="div"
              className="modal__error"
            />

            <label htmlFor="username">
              <b>Username</b>
            </label>
            <Field
              type="text"
              id="username"
              name="username"
              placeholder="Enter username"
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
            />
            <ErrorMessage
              name="password"
              component="div"
              className="modal__error"
            />

            <label htmlFor="repeatPassword">
              <b>Repeat Password</b>
            </label>
            <Field
              type="password"
              id="repeatPassword"
              name="repeatPassword"
              placeholder="Repeat Password"
            />
            <ErrorMessage
              name="repeatPassword"
              component="div"
              className="modal__error"
            />

            <button type="submit" className="modal__button">
              Sign up
            </button>

            <p className="modal__text">
              Already have an account?{" "}
              <span onClick={switchToLogin}>Sign in</span>
            </p>
          </Form>
        </Formik>
      </div>
    </div>
  );
};

export default Signup;
