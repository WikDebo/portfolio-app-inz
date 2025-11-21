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
  const [preview, setPreview] = useState<string>("/silly-seal.gif");
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
            : "/silly-seal.gif"
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
      setPreview("/silly-seal.gif");
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

  if (loading) return <p>Loading profile settings…</p>;

  return (
    <div className="profile">
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
            {
              /* user info section*/
            }
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
              {/* user info section*/}
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
                  <h4 className="email">{user?.email}</h4>

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
                  {/* user photo section*/}
                  <div className="profile__wrapper__avatar">
                    <img
                      className="profile__wrapper__avatar-img"
                      src={preview || "/silly-seal.gif"}
                      alt="Profile Preview"
                    />
                  </div>
                  <input
                    className="add-btn_picture"
                    type="file"
                    accept="image/*"
                    onChange={(e) => onFileChange(e, setFieldValue)}
                  />
                  {preview && preview !== "/silly-seal.gif" && (
                    <button
                      className="save-btn"
                      type="button"
                      onClick={handleRemovePhoto}
                      disabled={isSubmitting}
                    >
                      Remove Photo
                    </button>
                  )}
                  {/* user link section*/}
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
                              <a href={l.link} target="_blank" rel="noreferrer">
                                {l.link}
                              </a>
                              <button
                                className="link-btn"
                                type="button"
                                onClick={() => startEdit(l.id, l.link)}
                                disabled={isSubmitting}
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  height="24px"
                                  viewBox="0 -960 960 960"
                                  width="24px"
                                  fill="var(--color-text)"
                                >
                                  <path d="M200-200h57l391-391-57-57-391 391v57Zm-80 80v-170l528-527q12-11 26.5-17t30.5-6q16 0 31 6t26 18l55 56q12 11 17.5 26t5.5 30q0 16-5.5 30.5T817-647L290-120H120Zm640-584-56-56 56 56Zm-141 85-28-29 57 57-29-28Z" />
                                </svg>
                              </button>
                              <button
                                className="link-btn"
                                type="button"
                                onClick={() => deleteLink(l.id)}
                                disabled={isSubmitting}
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  height="24px"
                                  viewBox="0 -960 960 960"
                                  width="24px"
                                  fill="var(--color-text)"
                                >
                                  <path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z" />
                                </svg>
                              </button>
                            </>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* about me section*/}
                <div className="profile__wrapper__info">
                  <section className="s-profile-settings__section">
                    <h3 className="s-section-title">About me</h3>
                    <br></br>
                    <Field as="textarea" name="bio" className="input__about" />
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
    </div>
  );
};

export default ProfileEditing;
