import { Center, Loader } from "@mantine/core";
import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";

export function RequireAuth() {
  const { user, loading } = useContext(AuthContext)!;

  if (loading) {
    return (
      <Center mih="100vh">
        <Loader aria-label="Checking session" />
      </Center>
    );
  }

  if (!user) {
    return <Navigate to="/sign-in" replace />;
  }

  return <Outlet />;
}
