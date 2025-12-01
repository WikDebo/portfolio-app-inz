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
import ViewTransition from "./ViewTransition";
import { ThemeProvider } from "./context/ThemeProvider";
import SignupModal from "./components/SignupModal";
import LoginModal from "./components/LoginModal";
import Footer from "./components/Footer";

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <a className="skip-link" href="#main-content">
        Skip to main content
      </a>
      <Router>
        <Navbar />

        <main id="main-content">
          <ViewTransition>
            <Routes>
              <Route path="/login" element={<LoginModal />} />
              <Route path="/signup" element={<SignupModal />} />
              <Route
                path="/"
                element={
                  <PrivateRoutes>
                    <Home />
                  </PrivateRoutes>
                }
              />

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

              <Route
                path="/profile/edit"
                element={
                  <PrivateRoutes>
                    <ProfileEdit />
                  </PrivateRoutes>
                }
              />

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

              <Route
                path="/profile/portfolio/edit"
                element={
                  <PrivateRoutes>
                    <PortfolioEditPage />
                  </PrivateRoutes>
                }
              />

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

              <Route
                path="/profile/portfolio/category/:categoryId/edit"
                element={
                  <PrivateRoutes>
                    <CategoryEditPage />
                  </PrivateRoutes>
                }
              />

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

              <Route
                path="/settings"
                element={
                  <PrivateRoutes>
                    <Settings />
                  </PrivateRoutes>
                }
              />

              <Route
                path="/admin"
                element={
                  <PrivateRoutes roles={["ROLE_ADMIN"]}>
                    <BoardAdmin />
                  </PrivateRoutes>
                }
              />
            </Routes>
          </ViewTransition>
        </main>

        <Footer />
      </Router>
    </ThemeProvider>
  );
};

export default App;
