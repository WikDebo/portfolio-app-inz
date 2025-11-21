import React, { useEffect, useState } from "react";
import AuthService from "../services/auth.service.ts";
import EventBus from "../common/EventBus";

const BoardAdmin: React.FC = () => {
  const [user, setUser] = useState(AuthService.getCurrentUser());

  useEffect(() => {
    if (!user || !user.roles?.includes("ROLE_ADMIN")) {
      window.location.href = "/login";
    }
  }, [user]);

  useEffect(() => {
    const forcedLogout = () => {
      AuthService.logout();
      setUser(null);
      window.location.href = "/login";
    };

    EventBus.on("logout", forcedLogout);

    return () => {
      EventBus.remove("logout", forcedLogout);
    };
  }, []);

  if (!user) return null;

  return <div>Admin Board - Welcome {user.username}</div>;
};

export default BoardAdmin;
