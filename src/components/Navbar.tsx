/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useContext, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import Signup from "./Register";
import Login from "./Login";
import AuthContext from "../context/AuthContext";

const Navbar: React.FC = () => {
  const { currentUser, logout, setCurrentUser } = useContext(AuthContext);
  const [activeModal, setActiveModal] = useState<"login" | "signup" | null>(
    null
  );

  const openLogin = () => setActiveModal("login");
  const openSignup = () => setActiveModal("signup");
  const closeModal = () => setActiveModal(null);

  const handleLoginSuccess = (user: any) => {
    setCurrentUser(user);
    closeModal();
  };

  const isLoggedIn = !!currentUser;
  const username = currentUser?.username || "";
  const profilephoto = currentUser?.profilephoto || "";
  const isAdmin = currentUser?.roles?.includes("ROLE_ADMIN") || false;

  return (
    <>
      <header className="header">
        <div className="header__left">
          <NavLink to="/" end>
            <h1>ArtFolio</h1>
          </NavLink>
        </div>

        <nav className="header__center">
          <NavLink to="/" end>
            Home
          </NavLink>
          <NavLink to="/search">Explore</NavLink>
          <NavLink to="/following">Following</NavLink>
        </nav>

        <div className="header__right">
          {!isLoggedIn ? (
            <div className="header__btn-menu">
              <button className="btn--outline" onClick={openSignup}>
                Create account
              </button>
              <button className="btn--outline" onClick={openLogin}>
                Sign In
              </button>

              {activeModal === "signup" && (
                <Signup closeModal={closeModal} switchToLogin={openLogin} />
              )}
              {activeModal === "login" && (
                <Login
                  closeModal={closeModal}
                  switchToSignup={openSignup}
                  onLoginSuccess={handleLoginSuccess}
                />
              )}
            </div>
          ) : (
            <div className="header__user-menu">
              <div className="dropdown-menu">
                <p className="medium username">{username}</p>
                <div className="avatar">
                  <img
                    src={
                      profilephoto
                        ? `http://localhost:8080/uploads/${profilephoto}` //fix the size
                        : "/silly-seal.gif"
                    }
                    alt="avatar"
                  />
                </div>
              </div>

              <ul className="dropdown">
                {isAdmin && (
                  <li>
                    <Link to="/admin">Admin Board</Link>
                  </li>
                )}
                <li>
                  <Link to="/profile">My Profile</Link>
                </li>
                <li>
                  <Link to="/profile/portfolio">My Portfolio</Link>
                </li>
                <li>
                  <Link to="/profile/gallery">My Gallery</Link>
                </li>
                <li>
                  <Link to="/settings">Settings</Link>
                </li>
                <li>
                  <a onClick={logout} className="logout-btn">
                    Log out
                  </a>
                </li>
              </ul>
            </div>
          )}
        </div>
      </header>
      <div className="header__bottom"></div>
    </>
  );
};

export default Navbar;
