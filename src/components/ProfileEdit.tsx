/* eslint-disable @typescript-eslint/no-explicit-any */
import React, {
  useEffect,
  useState,
  useContext,
  type ChangeEvent,
} from "react";
import { useNavigate } from "react-router-dom";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import ProfileService from "../services/profile.service";
import LinksService from "../services/links.service";
import type { IUser, IUserLink } from "../types/user.type";
import AuthContext from "../context/AuthContext";
import AuthService from "../services/auth.service";

const ProfileEditing: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser, setCurrentUser } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<IUser | null>(null);
  const [preview, setPreview] = useState<string>("/preview.png");
  const [file, setFile] = useState<File | null>(null);
  const [links, setLinks] = useState<IUserLink[]>([]);
  const [newLink, setNewLink] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingValue, setEditingValue] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    const loadProfile = async () => {
      setLoading(true);
      try {
        const resp = await ProfileService.getMyProfile();
        const data = resp.data ?? resp;
        setUser(data);
        setPreview(
          data.profilephoto
            ? `http://localhost:8080/uploads/${data.profilephoto}`
            : "/preview.png"
        );

        const linksResp = await LinksService.getMyLinks();
        setLinks(linksResp);
      } catch (err) {
        console.error(err);
        setErrorMsg("Failed to load profile. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    loadProfile();
  }, []);

  const onFileChange = (
    e: ChangeEvent<HTMLInputElement>,
    setFieldValue: any
  ) => {
    const f = e.target.files?.[0] ?? null;
    setFile(f);
    setFieldValue("profilephoto", f);
    if (f) setPreview(URL.createObjectURL(f));
  };

  const handleRemovePhoto = async () => {
    try {
      await ProfileService.deleteProfilePhoto();
      setFile(null);
      setPreview("/preview.png");
      setSuccessMsg("Profile photo removed successfully.");

      if (currentUser)
        setCurrentUser({ ...currentUser, profilephoto: undefined });
    } catch (err) {
      console.error(err);
      setErrorMsg("Failed to remove profile photo.");
    }
  };

  const handleAddLink = async () => {
    if (!newLink.trim()) return;
    try {
      const added = await LinksService.addLink(newLink.trim());
      setLinks((prev) => [...prev, added]);
      setNewLink("");
      setSuccessMsg("Link added successfully.");
    } catch (err) {
      console.error(err);
      setErrorMsg("Failed to add link.");
    }
  };

  const startEdit = (id: number, link: string) => {
    setEditingId(id);
    setEditingValue(link);
  };

  const saveEdit = async (id: number) => {
    try {
      await LinksService.updateLink(id, editingValue);
      setLinks((prev) =>
        prev.map((l) => (l.id === id ? { ...l, link: editingValue } : l))
      );
      setEditingId(null);
      setSuccessMsg("Link updated successfully.");
    } catch (err) {
      console.error(err);
      setErrorMsg("Failed to update link.");
    }
  };

  const deleteLink = async (id: number) => {
    try {
      await LinksService.deleteLink(id);
      setLinks((prev) => prev.filter((l) => l.id !== id));
      setSuccessMsg("Link deleted successfully.");
    } catch (err) {
      console.error(err);
      setErrorMsg("Failed to delete link.");
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
    <div className="profile">
      <aside className="page-content">
        <div className="profile__all">
          {errorMsg && <div className="error-msg">{errorMsg}</div>}
          {successMsg && <div className="success-msg">{successMsg}</div>}
          <Formik
            enableReinitialize
            initialValues={{
              username: user?.username ?? "",
              email: user?.email ?? "",
              usertitle: user?.usertitle ?? "",
              bio: user?.bio ?? "",
              profilephoto: null as File | null,
            }}
            validationSchema={Yup.object({
              username: Yup.string()
                .max(50, "Max 50 characters")
                .required("Username is required"),
              usertitle: Yup.string().max(50, "Max 50 characters"),
              bio: Yup.string().max(10000, "Max 10000 characters"),
            })}
            onSubmit={async (values, { setSubmitting }) => {
              setErrorMsg(null);
              setSuccessMsg(null);

              try {
                const form = new FormData();
                form.append("username", values.username);
                form.append("usertitle", values.usertitle);
                form.append("bio", values.bio);
                if (file) form.append("profilephoto", file);

                const resp = await ProfileService.updateProfile(form);
                const updatedUser = resp.data.user;

                const updatedStoredUser = AuthService.updateStoredUser({
                  username: updatedUser.username,
                  usertitle: updatedUser.usertitle,
                  bio: updatedUser.bio,
                  profilephoto: updatedUser.profilephoto,
                });

                setCurrentUser(updatedStoredUser);

                setSuccessMsg("Profile updated successfully!");
                navigate("/profile");
              } catch (err: any) {
                if (
                  err.response?.data?.message === "Username is already taken."
                ) {
                  setErrorMsg("That username is already taken.");
                } else {
                  setErrorMsg("Failed to update profile.");
                }
              } finally {
                setSubmitting(false);
              }
            }}
          >
            {({ isSubmitting, setFieldValue }) => (
              <Form>
                <header className="profile__wrapper">
                  <div className="profile__wrapper__info">
                    <h2 className="profile-name">
                      <Field
                        className="text__input"
                        name="username"
                        type="text"
                        placeholder="Username"
                      />
                      <ErrorMessage
                        name="username"
                        component="div"
                        className="modal__error"
                      />
                    </h2>

                    <p className="profile-title">
                      <Field
                        className="text__input"
                        name="usertitle"
                        type="text"
                        placeholder="Your title"
                      />
                      <ErrorMessage
                        name="usertitle"
                        component="div"
                        className="modal__error"
                      />
                    </p>

                    <div className="profile__wrapper__avatar">
                      <img
                        className="profile__wrapper__avatar-img"
                        src={preview || "/preview.png"}
                        alt="Profile Preview"
                      />
                    </div>
                    <input
                      className="add-btn_picture"
                      type="file"
                      accept="image/*"
                      onChange={(e) => onFileChange(e, setFieldValue)}
                    />
                    {preview && preview !== "/preview.png" && (
                      <button
                        className="add-btn"
                        type="button"
                        onClick={handleRemovePhoto}
                        disabled={isSubmitting}
                      >
                        Remove Photo
                      </button>
                    )}
                    <div className="profile-links">
                      <p>You can also follow me on:</p>
                      <div className="link-list">
                        <input
                          className="text__input"
                          type="text"
                          placeholder="https://..."
                          value={newLink}
                          onChange={(e) => setNewLink(e.target.value)}
                        />
                        <button
                          className="add-btn"
                          type="button"
                          onClick={handleAddLink}
                          disabled={isSubmitting}
                        >
                          Add
                        </button>
                        {links.map((l) => (
                          <div key={l.id} className="link-item">
                            {editingId === l.id ? (
                              <>
                                <input
                                  className="text__input"
                                  value={editingValue}
                                  onChange={(e) =>
                                    setEditingValue(e.target.value)
                                  }
                                />
                                <button
                                  className="add-btn"
                                  type="button"
                                  onClick={() => saveEdit(l.id)}
                                  disabled={isSubmitting}
                                >
                                  Save
                                </button>
                                <button
                                  className="add-btn"
                                  type="button"
                                  onClick={() => setEditingId(null)}
                                >
                                  Cancel
                                </button>
                              </>
                            ) : (
                              <>
                                <a
                                  href={l.link}
                                  className="small"
                                  target="_blank"
                                  rel="noreferrer"
                                >
                                  {l.link}
                                </a>
                                <br></br>

                                <span
                                  onClick={() => startEdit(l.id, l.link)}
                                  className="material-symbols-outlined"
                                >
                                  edit
                                </span>

                                <span
                                  onClick={() => deleteLink(l.id)}
                                  className="material-symbols-outlined"
                                >
                                  Delete
                                </span>
                              </>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="profile__wrapper__info">
                    <section className="s-profile-settings__section">
                      <h3 className="s-section-title">About me</h3>
                      <br></br>
                      <Field
                        as="textarea"
                        name="bio"
                        className="input__about"
                      />
                      <ErrorMessage
                        name="bio"
                        component="div"
                        className="modal__error"
                      />
                    </section>{" "}
                  </div>
                </header>
                <button
                  type="submit"
                  className="save-btn"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Saving..." : "Save changes"}
                </button>
              </Form>
            )}
          </Formik>
        </div>
      </aside>
    </div>
  );
};

export default ProfileEditing;
