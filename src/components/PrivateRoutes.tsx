import React, { useContext } from "react";
import AuthContext from "../context/AuthContext";
import { NavLink } from "react-router-dom";

interface PrivateRouteProps {
  children: React.ReactElement;
  roles?: string[];
}

const PrivateRoutes: React.FC<PrivateRouteProps> = ({ children, roles }) => {
  const { currentUser } = useContext(AuthContext);

  if (!currentUser) {
    return (
      <div className="home">
        <section className="home__enter">
          <div className="page-content">
            <h1 className="title-text">Create. Inspire. Encourage.</h1>
            <h2>Expand your horizons</h2>
            <p>
              Join our community of exceptional artists and art enthusiasts -
              support local creators, grow your skills and explore new talents
            </p>

            <button className="btn liquid">
              <NavLink to="/signup">
                <span className="small">Start Your Journey</span>
              </NavLink>
            </button>
          </div>
        </section>
      </div>
    );
  }

  if (roles && !roles.some((role) => currentUser.roles?.includes(role))) {
    return null;
  }

  return children;
};

export default PrivateRoutes;
