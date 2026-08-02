import { Center, Loader } from "@mantine/core";
import { Navigate, Outlet } from "react-router-dom";
import { useLexicons } from "../../api/lexicon";

export function RequireLexicon() {
  const { data: lexicons, isPending, isError } = useLexicons();

  if (isPending) {
    return (
      <Center mih="40vh">
        <Loader aria-label="Loading lexicons" />
      </Center>
    );
  }

  if (isError || !lexicons || lexicons.length === 0) {
    return <Navigate to="/lexicons" replace />;
  }

  return <Outlet />;
}
