/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useContext, useState, useRef, useEffect } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";

const Navbar: React.FC = () => {
  const { currentUser, logout } = useContext(AuthContext);
  const isLoggedIn = !!currentUser;
  const username = currentUser?.username || "";
  const profilephoto = currentUser?.profilephoto || "";
  const isAdmin = currentUser?.roles?.includes("ROLE_ADMIN") || false;
  const navigate = useNavigate();

  const [openDropdown, setOpenDropdown] = useState<boolean>(false);
  const [burgerMenuOpen, setBurgerMenuOpen] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleLogout = () => {
    logout();
    navigate("/");
    setOpenDropdown(false);
    setBurgerMenuOpen(false);
  };

  useEffect(() => {
    const handleClickOutsideDropdown = (e: any) => {
      if (
        openDropdown &&
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target)
      ) {
        setOpenDropdown(false);
      }
    };
    window.addEventListener("click", handleClickOutsideDropdown);
    return () => {
      window.removeEventListener("click", handleClickOutsideDropdown);
    };
  }, [openDropdown]);

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
          <div className="header__btn-menu">
            <Link className="btn__outline" to="/signup">
              Create Account
            </Link>
            <Link className="btn__outline desktop-only" to="/login">
              Sign In
            </Link>
          </div>
        ) : (
          <div
            ref={dropdownRef}
            className={`header__user-menu desktop-only tablet-only ${
              openDropdown ? "open" : ""
            }`}
          >
            <button
              className="dropdown-menu"
              onClick={(e) => {
                e.stopPropagation();
                setOpenDropdown((prev) => !prev);
              }}
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
            </button>

            {openDropdown && (
              <ul className="dropdown">
                {renderUserDropdown(() => setOpenDropdown(false))}
              </ul>
            )}
          </div>
        )}

        {isLoggedIn && (
          <button
            className="burger-btn mobile-only"
            onClick={() => setBurgerMenuOpen((prev) => !prev)}
          >
            <span className="material-symbols-outlined burger-menu">menu</span>
          </button>
        )}
      </div>

      {burgerMenuOpen && isLoggedIn && (
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
          {renderMainLinks(() => setBurgerMenuOpen(false))}
          <ul>{renderUserDropdown(() => setBurgerMenuOpen(false))}</ul>
        </div>
      )}
    </header>
  );
};

export default Navbar;
