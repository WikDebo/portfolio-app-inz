import React from "react";
import AuthService from "../services/auth.service.ts";

interface PrivateRouteProps {
  children: React.ReactElement;
  roles?: string[];
}

const PrivateRoutes: React.FC<PrivateRouteProps> = ({ children, roles }) => {
  const currentUser = AuthService.getCurrentUser();

  if (!currentUser) {
    return null;
  }

  if (roles && !roles.some((role) => currentUser.roles?.includes(role))) {
    return null;
  }

  return children;
};

export default PrivateRoutes;
