/* eslint-disable @typescript-eslint/no-explicit-any */
import { useContext, useEffect, useState } from "react";
import ProfileService from "../services/profile.service";
import AuthContext from "../context/AuthContext";
import { useTheme } from "../context/ThemeProvider";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";

interface EmailValues {
  email: string;
}
interface PasswordValues {
  oldPassword: string;
  newPassword: string;
  repeatPassword: string;
}

export default function Settings() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const { logout } = useContext(AuthContext);
  const { theme, toggleTheme } = useTheme();
  const [email, setEmail] = useState("");

  const validationSchemaAccount = Yup.object().shape({
    email: Yup.string()
      .email("This is not a valid email.")
      .required("This field is required!"),
  });

  const validationSchemaPassword = Yup.object().shape({
    oldPassword: Yup.string().required("Current password is required!"),
    newPassword: Yup.string()
      .min(6, "The password must be at least 6 characters.")
      .max(40, "The password cannot exceed 40 characters.")
      .required("This field is required!"),
    repeatPassword: Yup.string()
      .oneOf([Yup.ref("newPassword")], "Passwords must match")
      .required("Please repeat the new password"),
  });

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const resp = await ProfileService.getMyProfile();
        setEmail(resp.data.email);
      } catch (err) {
        console.error("Failed to load profile", err);
      } finally {
        setLoading(false);
      }
    };
    loadProfile();
  }, []);

  const saveAccount = async (values: EmailValues) => {
    setSaving(true);
    setMessage(null);
    try {
      const form = new FormData();
      form.append("email", values.email);
      const resp = await ProfileService.updateProfile(form);
      setMessage(resp.data.message);
      setEmail(resp.data.user.email);
    } catch (err) {
      console.error(err);
      setMessage("Failed to save profile");
    } finally {
      setSaving(false);
    }
  };

  const savePassword = async (values: PasswordValues, { resetForm }: any) => {
    setSaving(true);
    setMessage(null);
    if (values.newPassword !== values.repeatPassword) {
      setSaving(false);
      return;
    }
    try {
      await ProfileService.changePassword(
        values.oldPassword,
        values.newPassword
      );
      setMessage("Password changed successfully");
      resetForm({
        values: { oldPassword: "", newPassword: "", repeatPassword: "" },
      });
    } catch (err) {
      console.error(err);
      setMessage("Failed to change password");
    } finally {
      setSaving(false);
    }
  };

  const deleteAccount = async () => {
    if (
      !window.confirm(
        "Are you sure you want to permanently delete your account?"
      )
    )
      return;

    setSaving(true);
    setMessage(null);
    try {
      await ProfileService.deleteMyAccount();
      setMessage("Your account has been deleted.");
      logout();
      window.location.href = "/";
    } catch (err: any) {
      console.error(err);
      setMessage(err?.response?.data?.message || "Failed to delete account");
    } finally {
      setSaving(false);
    }
  };

  if (loading)
    return (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
        <circle
          fill="#DC7A34"
          stroke="#DC7A34"
          stroke-width="2"
          r="15"
          cx="40"
          cy="65"
        >
          <animate
            attributeName="cy"
            calcMode="spline"
            dur="2"
            values="65;135;65;"
            keySplines=".5 0 .5 1;.5 0 .5 1"
            repeatCount="indefinite"
            begin="-.4"
          ></animate>
        </circle>
        <circle
          fill="#DC7A34"
          stroke="#DC7A34"
          stroke-width="2"
          r="15"
          cx="100"
          cy="65"
        >
          <animate
            attributeName="cy"
            calcMode="spline"
            dur="2"
            values="65;135;65;"
            keySplines=".5 0 .5 1;.5 0 .5 1"
            repeatCount="indefinite"
            begin="-.2"
          ></animate>
        </circle>
        <circle
          fill="#DC7A34"
          stroke="#DC7A34"
          stroke-width="2"
          r="15"
          cx="160"
          cy="65"
        >
          <animate
            attributeName="cy"
            calcMode="spline"
            dur="2"
            values="65;135;65;"
            keySplines=".5 0 .5 1;.5 0 .5 1"
            repeatCount="indefinite"
            begin="0"
          ></animate>
        </circle>
      </svg>
    );

  return (
    <div className="settings">
      <aside className="page-content">
        <div className="settings__all">
          <h2>Settings</h2>

          <section className="settings__section">
            <h3>Account Info</h3>
            <Formik
              enableReinitialize
              initialValues={{ email }}
              validationSchema={validationSchemaAccount}
              onSubmit={saveAccount}
            >
              <Form>
                <Field
                  type="email"
                  name="email"
                  className="settings__input"
                  placeholder="Enter email"
                />
                <ErrorMessage
                  name="email"
                  component="div"
                  className="modal__error"
                />
                <button type="submit" className="save-btn" disabled={saving}>
                  Save Account Info
                </button>
              </Form>
            </Formik>
          </section>

          <section className="settings__section">
            <h3>Change Password</h3>
            <br />
            <Formik
              initialValues={{
                oldPassword: "",
                newPassword: "",
                repeatPassword: "",
              }}
              validationSchema={validationSchemaPassword}
              onSubmit={savePassword}
            >
              <Form>
                <Field
                  type="password"
                  name="oldPassword"
                  className="settings__input"
                  placeholder="Current password"
                />
                <ErrorMessage
                  name="oldPassword"
                  component="div"
                  className="modal__error"
                />

                <Field
                  type="password"
                  name="newPassword"
                  className="settings__input"
                  placeholder="New password"
                />
                <ErrorMessage
                  name="newPassword"
                  component="div"
                  className="modal__error"
                />

                <Field
                  type="password"
                  name="repeatPassword"
                  className="settings__input"
                  placeholder="Repeat new password"
                />
                <ErrorMessage
                  name="repeatPassword"
                  component="div"
                  className="modal__error"
                />

                <button type="submit" className="save-btn" disabled={saving}>
                  Update Password
                </button>
              </Form>
            </Formik>
          </section>

          <section className="settings__section">
            <h3>Delete Account</h3>
            <button
              className="save-btn"
              onClick={deleteAccount}
              disabled={saving}
            >
              Delete My Account
            </button>
          </section>

          <section className="settings__section">
            <h3>Toggle theme</h3>
            <div
              className={`toggle__button ${theme === "dark" ? "active" : ""}`}
              onClick={toggleTheme}
            >
              <span className="toggle__circle"></span>
            </div>
          </section>

          <section className="settings__section">
            <h3>Other</h3>
            <p className="medium">Privacy Policy</p>
            <p className="medium">Terms & Conditions</p>
          </section>

          {message && <div className="message">{message}</div>}
        </div>
      </aside>
    </div>
  );
}
