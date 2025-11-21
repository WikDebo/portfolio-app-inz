import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./components/Home";
import Following from "./components/Following";
import PrivateRoutes from "./components/PrivateRoutes";
import Settings from "./components/Settings";
import BoardAdmin from "./components/BoardAdmin";
import Profile from "./components/Profile";
import Gallery from "./components/Gallery";
import Portfolio from "./components/Portfolio";
import ProfileEdit from "./components/ProfileEdit";
import SearchPage from "./components/Search";
import CategoryPage from "./components/CategoryPage";
import PortfolioEditPage from "./components/PortfolioEditPage";
import CategoryEditPage from "./components/CategoryEditPage";

const App: React.FC = () => {
  return (
    <Router>
      <Navbar />
      <main>
        <Routes>
          {/* Main Rotues */}
          <Route path="/" element={<Home />} />

          <Route
            path="/search"
            element={
              <PrivateRoutes>
                <SearchPage />
              </PrivateRoutes>
            }
          />

          <Route
            path="/following"
            element={
              <PrivateRoutes>
                <Following />
              </PrivateRoutes>
            }
          />
          {/* Profile */}
          <Route
            path="/profile"
            element={
              <PrivateRoutes>
                <Profile />
              </PrivateRoutes>
            }
          />
          <Route
            path="/profile/:username"
            element={
              <PrivateRoutes>
                <Profile />
              </PrivateRoutes>
            }
          />
          {/* Profile Edit */}
          <Route
            path="/profile/edit"
            element={
              <PrivateRoutes>
                <ProfileEdit />
              </PrivateRoutes>
            }
          />
          {/* Portfolio */}
          <Route
            path="/profile/portfolio"
            element={
              <PrivateRoutes>
                <Portfolio />
              </PrivateRoutes>
            }
          />
          <Route
            path="/profile/:username/portfolio"
            element={
              <PrivateRoutes>
                <Portfolio />
              </PrivateRoutes>
            }
          />

          {/* Portfolio Edit */}
          <Route
            path="/profile/portfolio/edit"
            element={
              <PrivateRoutes>
                <PortfolioEditPage />
              </PrivateRoutes>
            }
          />

          {/* Category */}
          <Route
            path="/profile/portfolio/category/:categoryId"
            element={
              <PrivateRoutes>
                <CategoryPage />
              </PrivateRoutes>
            }
          />
          <Route
            path="/profile/:username/portfolio/category/:categoryId"
            element={
              <PrivateRoutes>
                <CategoryPage />
              </PrivateRoutes>
            }
          />

          {/* Category Edit */}
          <Route
            path="/profile/portfolio/category/:categoryId/edit"
            element={
              <PrivateRoutes>
                <CategoryEditPage />
              </PrivateRoutes>
            }
          />

          {/* Gallery */}
          <Route
            path="/profile/gallery"
            element={
              <PrivateRoutes>
                <Gallery />
              </PrivateRoutes>
            }
          />
          <Route
            path="/profile/:username/gallery"
            element={
              <PrivateRoutes>
                <Gallery />
              </PrivateRoutes>
            }
          />

          {/* Settings */}
          <Route
            path="/settings"
            element={
              <PrivateRoutes>
                <Settings />
              </PrivateRoutes>
            }
          />

          {/* Admin */}
          <Route
            path="/admin"
            element={
              <PrivateRoutes roles={["ROLE_ADMIN"]}>
                <BoardAdmin />
              </PrivateRoutes>
            }
          />
        </Routes>
      </main>
      <footer className="footer">
        <div className="footer__top">
          <div className="footer__left">
            <div className="col">
              <h1 style={{ color: "var(--color-text)" }}>Artfolio</h1>
              <h1 style={{ color: "var(--color-dark-1)" }}>Artfolio</h1>
              <h1 style={{ color: "var(--color-dark-2)" }}>Artfolio</h1>
              <h1 style={{ color: "var(--color-dark-3)" }}>Artfolio</h1>
              <h1 style={{ color: "var(--color-dark-4)" }}>Artfolio</h1>
            </div>
          </div>
          <div className="footer__right">
            <div className="col">
              <ul>
                <li>
                  <a>Contact us</a>
                </li>
                <li>
                  <a>Our Services</a>
                </li>
                <li>
                  <a>Privacy Policy</a>
                </li>
                <li>
                  <a>Terms & Conditions</a>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="footer__bottom">
          WIKTORIA © 2025 — All rights reserved
        </div>
      </footer>
    </Router>
  );
};

export default App;
