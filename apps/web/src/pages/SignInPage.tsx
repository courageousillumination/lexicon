import {
  Button,
  Center,
  Container,
  PasswordInput,
  Stack,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { useContext } from "react";
import { Navigate, useNavigate } from "react-router-dom";

import { useForm } from "@mantine/form";
import { AuthContext } from "../contexts/AuthContext";
import { useSignIn } from "../hooks/auth";

export function SignInPage() {
  const { user, loading } = useContext(AuthContext)!;
  const signIn = useSignIn();
  const navigate = useNavigate();
  const form = useForm({
    initialValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = form.onSubmit(async (values) => {
    await signIn(values.email, values.password);
    void navigate("/", { replace: true });
  });

  // Redirect if the user is already authenticated.
  if (!loading && user) {
    return <Navigate to="/" replace />;
  }

  return (
    <Center mih="100vh" px="md">
      <Container size={400} w="100%" p={0}>
        <Stack gap="md">
          <Title order={1}>Lexicon</Title>
          <div>
            <Title order={2}>Sign in</Title>
            <Text c="dimmed" mt="xs">
              Enter your email and password to continue.
            </Text>
          </div>

          <form onSubmit={onSubmit}>
            <Stack gap="md">
              <TextInput
                label="Email"
                type="email"
                name="email"
                autoComplete="email"
                required
                {...form.getInputProps("email")}
              />

              <PasswordInput
                label="Password"
                name="password"
                autoComplete="current-password"
                required
                minLength={6}
                {...form.getInputProps("password")}
              />

              <Button type="submit" fullWidth loading={form.submitting}>
                Sign in
              </Button>
            </Stack>
          </form>
        </Stack>
      </Container>
    </Center>
  );
}
