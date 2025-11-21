/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useContext, useEffect, useState } from "react";
import ProfileService from "../services/profile.service";
import AuthContext from "../context/AuthContext";

export default function Settings() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const { logout } = useContext(AuthContext);

  const [email, setEmail] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const loadProfile = async () => {
    try {
      const resp = await ProfileService.getMyProfile();
      const u = resp.data;
      setEmail(u.email);
    } catch (err) {
      console.error("Failed to load profile", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  const saveAccount = async () => {
    setSaving(true);
    setMessage(null);

    try {
      const form = new FormData();
      form.append("email", email);
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

  const savePassword = async () => {
    setSaving(true);
    setMessage(null);
    try {
      await ProfileService.changePassword(oldPassword, newPassword);
      setMessage("Password changed successfully");
      setOldPassword("");
      setNewPassword("");
    } catch (err) {
      console.error(err);
      setMessage("Failed to change password");
    } finally {
      setSaving(false);
    }
  };

  const deleteAccount = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to permanently delete your account? This action cannot be undone."
    );
    if (!confirmed) return;

    setSaving(true);
    setMessage(null);

    try {
      await ProfileService.deleteMyAccount();
      setMessage("Your account has been deleted.");

      logout();
      window.location.href = "/";
    } catch (err: any) {
      console.error(err);
      const apiMessage =
        err?.response?.data?.message || "Failed to delete account";
      setMessage(apiMessage);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p>Loading settings…</p>;

  return (
    <div className="settings-page">
      <h2>Settings</h2>

      {/* User Info section */}
      <section>
        <h3>Account Info</h3>
        <label>Username</label>
        <label>Email</label>
        <input value={email} onChange={(e) => setEmail(e.target.value)} />
        <button onClick={saveAccount} disabled={saving}>
          Save Account Info
        </button>
      </section>

      {/* Password section*/}
      <section>
        <h3>Change Password</h3>
        <label>Current Password</label>
        <input
          type="password"
          value={oldPassword}
          onChange={(e) => setOldPassword(e.target.value)}
        />
        <label>New Password</label>
        <input
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
        <button onClick={savePassword} disabled={saving}>
          Update Password
        </button>
      </section>
      <section>
        <h3>Delete Account</h3>
        <button onClick={deleteAccount} disabled={saving}>
          Delete My Account
        </button>
      </section>
      {message && <div className="message">{message}</div>}
      {/*add dark mode?*/}
    </div>
  );
}
