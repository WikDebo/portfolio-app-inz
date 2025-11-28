import { useLocation } from "react-router-dom";
import { useEffect } from "react";

export default function ViewTransition({
  children,
}: {
  children: React.ReactNode;
}) {
  const location = useLocation();

  useEffect(() => {
    if (!document.startViewTransition) return;

    document.startViewTransition(() => {});
  }, [location.pathname]);

  return <>{children}</>;
}
