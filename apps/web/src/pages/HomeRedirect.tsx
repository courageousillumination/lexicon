import { Center, Loader } from "@mantine/core";
import { Navigate } from "react-router-dom";
import { useLexicons } from "../api/lexicon";

export function HomeRedirect() {
  const { data: lexicons, isPending, isError } = useLexicons();

  if (isPending) {
    return (
      <Center mih="40vh">
        <Loader />
      </Center>
    );
  }

  if (isError || !lexicons || lexicons.length === 0) {
    return <Navigate to="/lexicons" replace />;
  }

  return <Navigate to="/lexicon" replace />;
}
