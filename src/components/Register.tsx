/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import AuthService from "../services/auth.service.ts";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";

type SignupProps = {
  closeModal: () => void;
  switchToLogin: () => void;
};

interface FormValues {
  email: string;
  username: string;
  password: string;
  repeatPassword: string;
}

const Signup: React.FC<SignupProps> = ({ closeModal, switchToLogin }) => {
  const [error, setError] = useState("");
  //const { setCurrentUser } = useContext(AuthContext);

  const initialValues: FormValues = {
    email: "",
    username: "",
    password: "",
    repeatPassword: "",
  };

  const validationSchema = Yup.object().shape({
    username: Yup.string()
      .min(3, "The username must be at least 3 characters.")
      .max(20, "The username cannot exceed 20 characters.")
      .required("This field is required!"),
    email: Yup.string()
      .email("This is not a valid email.")
      .required("This field is required!"),
    password: Yup.string()
      .min(6, "The password must be at least 6 characters.")
      .max(40, "The password cannot exceed 40 characters.")
      .required("This field is required!"),
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

            <p className="modal__text">
              By creating an account you agree to our{" "}
              <span>Terms & Privacy</span>.
            </p>

            <button type="submit" className="modal__button">
              Sign up
            </button>

            <div className="modal__text">
              Already have an account?{" "}
              <span onClick={switchToLogin}>Sign in</span>
            </div>
          </Form>
        </Formik>
      </div>
    </div>
  );
};

export default Signup;
