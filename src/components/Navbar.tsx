import { Link, NavLink, useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import React, { useContext, useState } from "react";

const Navbar: React.FC = () => {
  const { currentUser, logout } = useContext(AuthContext);
  const isLoggedIn = !!currentUser;
  const username = currentUser?.username || "";
  const profilephoto = currentUser?.profilephoto || "";
  const isAdmin = currentUser?.roles?.includes("ROLE_ADMIN") || false;
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const renderMainLinks = (onClick?: () => void) => (
    <>
      <NavLink to="/" end onClick={onClick}>
        Home
      </NavLink>
      <NavLink to="/search" onClick={onClick}>
        Explore
      </NavLink>
      <NavLink to="/following" onClick={onClick}>
        Following
      </NavLink>
    </>
  );

  const renderUserDropdown = (onClick?: () => void) => (
    <>
      {isAdmin && (
        <li>
          <Link to="/admin" onClick={onClick}>
            Admin Board
          </Link>
        </li>
      )}
      <li>
        <Link to="/profile" onClick={onClick}>
          My Profile
        </Link>
      </li>
      <li>
        <Link to="/profile/portfolio" onClick={onClick}>
          My Portfolio
        </Link>
      </li>
      <li>
        <Link to="/profile/gallery" onClick={onClick}>
          My Gallery
        </Link>
      </li>
      <li>
        <Link to="/settings" onClick={onClick}>
          Settings
        </Link>
      </li>
      <li>
        <a onClick={handleLogout} className="logout-btn">
          Log out
        </a>
      </li>
    </>
  );

  return (
    <header className="header">
      <div className="header__left">
        <NavLink to="/" end>
          <h2>ArtFolio</h2>
        </NavLink>
      </div>

      <nav className="header__center desktop-only">{renderMainLinks()}</nav>

      <div className="header__right">
        {!isLoggedIn ? (
          <div className="header__btn-menu ">
            <Link className="btn__outline  " to="/signup">
              Create account
            </Link>
            <Link className="btn__outline desktop-only" to="/login">
              Sign In
            </Link>
          </div>
        ) : (
          <div
            className={`header__user-menu desktop-only tablet-only ${
              isMenuOpen ? "open" : ""
            }`}
          >
            <div
              className="dropdown-menu"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <p className="medium username">{username}</p>
              <div className="avatar">
                <img
                  src={
                    profilephoto
                      ? `http://localhost:8080/uploads/${profilephoto}`
                      : "/preview.png"
                  }
                  alt="avatar"
                />
              </div>
            </div>
            {isMenuOpen && (
              <ul className="dropdown">
                {renderUserDropdown(() => setIsMenuOpen(false))}
              </ul>
            )}
          </div>
        )}

        {isLoggedIn && (
          <button
            className="burger-btn mobile-only"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <a className="material-symbols-outlined burger-menu">menu</a>
          </button>
        )}
      </div>

      {isMenuOpen && isLoggedIn && (
        <div className="mobile-dropdown mobile-only">
          <div className="avatar">
            <img
              src={
                profilephoto
                  ? `http://localhost:8080/uploads/${profilephoto}`
                  : "/preview.png"
              }
              alt="avatar"
            />
          </div>
          {renderMainLinks(() => setIsMenuOpen(false))}
          {renderUserDropdown(() => setIsMenuOpen(false))}
        </div>
      )}
    </header>
  );
};

export default Navbar;
